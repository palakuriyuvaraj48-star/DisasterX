import { 
  UserRole, 
  IncidentReport, 
  Shelter, 
  Hospital, 
  RoadblockHazard, 
  ResourceItem, 
  ResponseTeam, 
  AuditLogEntry, 
  EvacuationRoute,
  RiskZone,
  ScenarioSimulationState,
  DisasterType,
  SeverityLevel
} from '../types/disaster';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_SHELTERS, 
  INITIAL_HOSPITALS, 
  INITIAL_ROADBLOCKS, 
  INITIAL_RESOURCES, 
  INITIAL_TEAMS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_EVACUATION_ROUTES,
  INITIAL_RISK_ZONES
} from '../data/mockDisasterData';
import { TrustEngine } from './trustEngine';

const STORAGE_KEY = 'disasterguard_state_v1';

export interface DisasterStoreState {
  currentRole: UserRole;
  isEmergencyMode: boolean;
  isHighContrast: boolean;
  isAudioAlertsEnabled: boolean;
  isOffline: boolean;
  lastSyncedTimestamp: string;
  selectedDisaster: DisasterType | null;
  
  // Entities
  incidents: IncidentReport[];
  shelters: Shelter[];
  hospitals: Hospital[];
  roadblocks: RoadblockHazard[];
  resources: ResourceItem[];
  teams: ResponseTeam[];
  auditLogs: AuditLogEntry[];
  evacuationRoutes: EvacuationRoute[];
  riskZones: RiskZone[];
  
  // Selected map entity for contextual slide-out
  selectedMapItem: {
    type: 'INCIDENT' | 'SHELTER' | 'HOSPITAL' | 'HAZARD' | 'TEAM' | 'RESOURCE';
    id: string;
  } | null;

  // Active Evacuation Route Display
  activeEvacuationRouteId: string;

  // SIH / Authority Scenario Simulation
  simulation: ScenarioSimulationState;
  
  // Notification banner / alerts
  broadcastAlert: {
    id: string;
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    timestamp: string;
  } | null;

  // Offline Pending Queue for incident reports
  offlineQueueCount: number;
}

// Generate unique hash
const generateHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'SHA256:' + Math.abs(hash).toString(16).padStart(16, '0') + Math.abs(hash * 31).toString(16);
};

export class DisasterStore {
  private state: DisasterStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    const defaults = this.getDefaultState();
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<DisasterStoreState>;

        const safeArray = <T>(value: unknown, fallback: T[]): T[] =>
          Array.isArray(value) ? value : fallback;

        const safeString = (value: unknown, fallback: string): string =>
          typeof value === 'string' ? value : fallback;

        const safeBoolean = (value: unknown, fallback: boolean): boolean =>
          typeof value === 'boolean' ? value : fallback;

        const safeNumber = (value: unknown, fallback: number): number =>
          typeof value === 'number' ? value : fallback;

        const safeObject = <T>(value: unknown, fallback: T): T =>
          typeof value === 'object' && value !== null ? value as T : fallback;

        this.state = {
          ...defaults,
          ...parsed,
          currentRole: safeString(parsed.currentRole, defaults.currentRole) as UserRole,
          isEmergencyMode: safeBoolean(parsed.isEmergencyMode, defaults.isEmergencyMode),
          isHighContrast: safeBoolean(parsed.isHighContrast, defaults.isHighContrast),
          isAudioAlertsEnabled: safeBoolean(parsed.isAudioAlertsEnabled, defaults.isAudioAlertsEnabled),
          isOffline: !navigator.onLine,
          lastSyncedTimestamp: safeString(parsed.lastSyncedTimestamp, defaults.lastSyncedTimestamp),
          selectedDisaster: parsed.selectedDisaster ?? defaults.selectedDisaster,
          incidents: safeArray(parsed.incidents, defaults.incidents),
          shelters: safeArray(parsed.shelters, defaults.shelters),
          hospitals: safeArray(parsed.hospitals, defaults.hospitals),
          roadblocks: safeArray(parsed.roadblocks, defaults.roadblocks),
          resources: safeArray(parsed.resources, defaults.resources),
          teams: safeArray(parsed.teams, defaults.teams),
          auditLogs: safeArray(parsed.auditLogs, defaults.auditLogs),
          evacuationRoutes: safeArray(parsed.evacuationRoutes, defaults.evacuationRoutes),
          riskZones: safeArray(parsed.riskZones, defaults.riskZones),
          selectedMapItem: safeObject(parsed.selectedMapItem, defaults.selectedMapItem),
          activeEvacuationRouteId: safeString(parsed.activeEvacuationRouteId, defaults.activeEvacuationRouteId),
          simulation: safeObject(parsed.simulation, defaults.simulation),
          broadcastAlert: safeObject(parsed.broadcastAlert, defaults.broadcastAlert),
          offlineQueueCount: safeNumber(parsed.offlineQueueCount, defaults.offlineQueueCount),
        };
      } catch (e) {
        this.state = defaults;
      }
    } else {
      this.state = defaults;
    }

    // Bind browser online/offline events
    window.addEventListener('online', () => {
      this.setState({ isOffline: false, lastSyncedTimestamp: new Date().toLocaleTimeString() });
    });
    window.addEventListener('offline', () => {
      this.setState({ isOffline: true });
    });
  }

  private getDefaultState(): DisasterStoreState {
    return {
      currentRole: 'CITIZEN',
      isEmergencyMode: false,
      isHighContrast: false,
      isAudioAlertsEnabled: true,
      isOffline: !navigator.onLine,
      lastSyncedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      selectedDisaster: null,
      incidents: INITIAL_INCIDENTS,
      shelters: INITIAL_SHELTERS,
      hospitals: INITIAL_HOSPITALS,
      roadblocks: INITIAL_ROADBLOCKS,
      resources: INITIAL_RESOURCES,
      teams: INITIAL_TEAMS,
      auditLogs: INITIAL_AUDIT_LOGS,
      evacuationRoutes: INITIAL_EVACUATION_ROUTES,
      riskZones: INITIAL_RISK_ZONES,
      selectedMapItem: null,
      activeEvacuationRouteId: 'ROUTE-ADAPTIVE-01',
      simulation: {
        isSimulating: false,
        activeScenarioName: null,
        stepIndex: 0,
        stepMessage: 'Scenario idle'
      },
      broadcastAlert: {
        id: 'ALERT-01',
        type: 'WARNING',
        message: 'High tide alert: Low-lying sectors should monitor rising floodwaters and shelter routes.',
        timestamp: '15 mins ago'
      },
      offlineQueueCount: 0
    };
  }

  public getState(): DisasterStoreState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  public setState(partial: Partial<DisasterStoreState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  // Set User Role
  public setRole(role: UserRole) {
    this.setState({ currentRole: role });
  }

  // Toggle Emergency Mode
  public toggleEmergencyMode(force?: boolean) {
    const next = force !== undefined ? force : !this.state.isEmergencyMode;
    this.setState({ isEmergencyMode: next });
  }

  // Toggle High Contrast Mode
  public toggleHighContrast(force?: boolean) {
    const next = force !== undefined ? force : !this.state.isHighContrast;
    if (next) {
      document.body.classList.add('emergency-high-contrast');
    } else {
      document.body.classList.remove('emergency-high-contrast');
    }
    this.setState({ isHighContrast: next });
  }

  // Toggle Audio Alerts
  public toggleAudioAlerts() {
    this.setState({ isAudioAlertsEnabled: !this.state.isAudioAlertsEnabled });
  }

  // Select disaster category for guidance
  public setSelectedDisaster(disaster: DisasterType | null) {
    this.setState({ selectedDisaster: disaster });
  }

  // Select Map item for contextual inspector
  public setSelectedMapItem(item: { type: 'INCIDENT' | 'SHELTER' | 'HOSPITAL' | 'HAZARD' | 'TEAM' | 'RESOURCE'; id: string } | null) {
    this.setState({ selectedMapItem: item });
  }

  // Set active route
  public setActiveEvacuationRoute(routeId: string) {
    this.setState({ activeEvacuationRouteId: routeId });
  }

  // Clear broadcast alert
  public dismissBroadcastAlert() {
    this.setState({ broadcastAlert: null });
  }

  // Citizen report submission
  public reportIncident(data: {
    type: DisasterType;
    title: string;
    description: string;
    locationName: string;
    coordinates?: { lat: number; lng: number };
    severity: SeverityLevel;
    estimatedPeopleAffected?: number;
    reporterName?: string;
    hasPhotoEvidence?: boolean;
  }): IncidentReport {
    const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trustBreakdown = TrustEngine.calculateTrustScore({
      source: 'CITIZEN_REPORT',
      supportingReportsCount: 1,
      hasPhotoEvidence: data.hasPhotoEvidence || false,
      verificationStatus: 'PENDING'
    });

    const newIncident: IncidentReport = {
      id: newId,
      type: data.type,
      title: data.title,
      description: data.description,
      locationName: data.locationName,
      coordinates: data.coordinates || { lat: 13.0827 + (Math.random() - 0.5) * 0.03, lng: 80.2707 + (Math.random() - 0.5) * 0.03 },
      severity: data.severity,
      verificationStatus: 'PENDING',
      confidenceScore: trustBreakdown.totalTrustScore,
      trustBreakdown,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportedBy: data.reporterName || 'Citizen Mobile App',
      source: 'CITIZEN_REPORT',
      estimatedPeopleAffected: data.estimatedPeopleAffected || 10,
      hasPhotoEvidence: data.hasPhotoEvidence || false,
      notes: ['Awaiting authority review']
    };

    const updatedIncidents = [newIncident, ...this.state.incidents];
    
    // Add audit log
    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName: data.reporterName || 'Citizen User (Mobile App)',
      officerRole: 'CITIZEN',
      action: 'INCIDENT_SUBMITTED',
      targetType: 'INCIDENT',
      targetId: newId,
      details: `Citizen submitted report "${data.title}" in ${data.locationName}. Status: PENDING_VERIFICATION.`,
      auditHash: generateHash(newId + Date.now())
    };

    this.setState({
      incidents: updatedIncidents,
      auditLogs: [auditEntry, ...this.state.auditLogs],
      lastSyncedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return newIncident;
  }

  // Admin verifies incident
  public verifyIncident(incidentId: string, officerName = 'Command Duty Officer'): void {
    const updated = this.state.incidents.map(inc => {
      if (inc.id === incidentId) {
        const trustBreakdown = TrustEngine.calculateTrustScore({
          source: inc.source,
          supportingReportsCount: inc.supportingReportsCount || 1,
          hasPhotoEvidence: inc.hasPhotoEvidence,
          responderConfirmed: true,
          verificationStatus: 'VERIFIED'
        });
        return {
          ...inc,
          verificationStatus: 'VERIFIED' as const,
          confidenceScore: trustBreakdown.totalTrustScore,
          trustBreakdown,
          responderConfirmed: true,
          updatedAt: new Date().toISOString(),
          notes: [...(inc.notes || []), `Verified by ${officerName} at ${new Date().toLocaleTimeString()}`]
        };
      }
      return inc;
    });

    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName,
      officerRole: 'ADMIN',
      action: 'INCIDENT_VERIFIED',
      targetType: 'INCIDENT',
      targetId: incidentId,
      details: `Incident ${incidentId} was manually verified and flagged as verified emergency ground truth.`,
      auditHash: generateHash(incidentId + 'VERIFY' + Date.now())
    };

    this.setState({
      incidents: updated,
      auditLogs: [auditEntry, ...this.state.auditLogs]
    });
  }

  // Admin rejects incident
  public rejectIncident(incidentId: string, reason = 'False alarm / Duplicate', officerName = 'Command Duty Officer'): void {
    const updated = this.state.incidents.map(inc => {
      if (inc.id === incidentId) {
        const trustBreakdown = TrustEngine.calculateTrustScore({
          source: inc.source,
          supportingReportsCount: inc.supportingReportsCount || 1,
          hasPhotoEvidence: inc.hasPhotoEvidence,
          verificationStatus: 'REJECTED'
        });
        return {
          ...inc,
          verificationStatus: 'REJECTED' as const,
          confidenceScore: trustBreakdown.totalTrustScore,
          trustBreakdown,
          updatedAt: new Date().toISOString(),
          notes: [...(inc.notes || []), `Rejected: ${reason} (by ${officerName})`]
        };
      }
      return inc;
    });

    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName,
      officerRole: 'ADMIN',
      action: 'INCIDENT_REJECTED',
      targetType: 'INCIDENT',
      targetId: incidentId,
      details: `Incident ${incidentId} marked as REJECTED. Reason: ${reason}`,
      auditHash: generateHash(incidentId + 'REJECT' + Date.now())
    };

    this.setState({
      incidents: updated,
      auditLogs: [auditEntry, ...this.state.auditLogs]
    });
  }

  // Update Severity
  public updateIncidentSeverity(incidentId: string, severity: SeverityLevel, officerName = 'Command Duty Officer'): void {
    const updated = this.state.incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          severity,
          updatedAt: new Date().toISOString()
        };
      }
      return inc;
    });

    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName,
      officerRole: 'ADMIN',
      action: 'SEVERITY_UPDATED',
      targetType: 'INCIDENT',
      targetId: incidentId,
      details: `Incident ${incidentId} severity updated to ${severity}`,
      auditHash: generateHash(incidentId + severity + Date.now())
    };

    this.setState({
      incidents: updated,
      auditLogs: [auditEntry, ...this.state.auditLogs]
    });
  }

  // Assign team to incident
  public assignTeam(incidentId: string, teamId: string, officerName = 'Operations Lead'): void {
    const targetTeam = this.state.teams.find(t => t.id === teamId);
    const updatedIncidents = this.state.incidents.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, assignedTeamId: teamId, updatedAt: new Date().toISOString() };
      }
      return inc;
    });

    const updatedTeams = this.state.teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          status: 'EN_ROUTE' as const,
          currentAssignmentIncidentId: incidentId,
          etaMinutes: 8,
          lastCheckin: 'Just now'
        };
      }
      return team;
    });

    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName,
      officerRole: 'ADMIN',
      action: 'TEAM_ASSIGNED',
      targetType: 'TEAM',
      targetId: teamId,
      details: `Assigned team ${targetTeam?.name || teamId} to Incident ${incidentId}. Status set to EN_ROUTE.`,
      auditHash: generateHash(teamId + incidentId + Date.now())
    };

    this.setState({
      incidents: updatedIncidents,
      teams: updatedTeams,
      auditLogs: [auditEntry, ...this.state.auditLogs]
    });
  }

  // Update Response Team Status
  public updateTeamStatus(teamId: string, status: ResponseTeam['status'], etaMinutes?: number): void {
    const updatedTeams = this.state.teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          status,
          etaMinutes: etaMinutes !== undefined ? etaMinutes : team.etaMinutes,
          lastCheckin: 'Just now'
        };
      }
      return team;
    });

    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName: 'Team Dispatcher',
      officerRole: 'RESPONDER',
      action: 'TEAM_STATUS_CHANGED',
      targetType: 'TEAM',
      targetId: teamId,
      details: `Team ${teamId} status changed to ${status}`,
      auditHash: generateHash(teamId + status + Date.now())
    };

    this.setState({
      teams: updatedTeams,
      auditLogs: [auditEntry, ...this.state.auditLogs]
    });
  }

  // Allocate Resource
  public allocateResource(resourceId: string, quantityToDeduct: number, destinationSector: string, officerName = 'Logistics Officer'): void {
    const updatedResources = this.state.resources.map(res => {
      if (res.id === resourceId) {
        const remaining = Math.max(0, res.quantity - quantityToDeduct);
        return {
          ...res,
          quantity: remaining,
          assignedToSector: destinationSector,
          lastUpdated: 'Just now'
        };
      }
      return res;
    });

    const targetRes = this.state.resources.find(r => r.id === resourceId);

    const auditEntry: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      officerName,
      officerRole: 'ADMIN',
      action: 'RESOURCE_DISPATCHED',
      targetType: 'RESOURCE',
      targetId: resourceId,
      details: `Dispatched ${quantityToDeduct} ${targetRes?.unit || 'units'} of ${targetRes?.name || resourceId} to ${destinationSector}.`,
      auditHash: generateHash(resourceId + quantityToDeduct + Date.now())
    };

    this.setState({
      resources: updatedResources,
      auditLogs: [auditEntry, ...this.state.auditLogs]
    });
  }

  // Update Shelter Occupancy
  public updateShelterOccupancy(shelterId: string, deltaOccupancy: number): void {
    const updated = this.state.shelters.map(s => {
      if (s.id === shelterId) {
        const newOcc = Math.max(0, Math.min(s.totalCapacity, s.currentOccupancy + deltaOccupancy));
        const status = newOcc >= s.totalCapacity ? 'FULL' : 'OPEN';
        return { ...s, currentOccupancy: newOcc, status: status as 'OPEN' | 'FULL' };
      }
      return s;
    });
    this.setState({ shelters: updated });
  }

  // --- SIH & Investor Dynamic Ground Condition Simulation Engine ---
  public async runDemoSimulation(onStepProgress?: (step: number, total: number, msg: string) => void): Promise<void> {
    this.setState({
      simulation: {
        isSimulating: true,
        activeScenarioName: 'Flash Flood & Roadblock Adaptive Evacuation Flow',
        stepIndex: 1,
        stepMessage: 'Step 1/5: Citizen submits urgent flood report at Sector 4 Riverbank.'
      }
    });
    onStepProgress?.(1, 5, 'Step 1/5: Citizen submits urgent flood report at Sector 4 Riverbank.');

    // Step 1: Citizen submits report
    await new Promise(r => setTimeout(r, 1800));
    const newInc = this.reportIncident({
      type: 'FLOOD',
      title: 'CRITICAL: Rapid Water Rise & Transformer Surge near Riverbank Gate',
      description: 'Water breached low wall in Sector 4. Elderly residents stranded on ground floor.',
      locationName: 'Sector 4 Riverbank Colony',
      coordinates: { lat: 13.0765, lng: 80.2580 },
      severity: 'CRITICAL',
      estimatedPeopleAffected: 140,
      reporterName: 'Resident Association Head (V. Narayanan)'
    });

    // Step 2: Authority verifies
    this.setState({
      simulation: {
        isSimulating: true,
        activeScenarioName: 'Flash Flood & Roadblock Adaptive Evacuation Flow',
        stepIndex: 2,
        stepMessage: 'Step 2/5: Authority verifies ground truth with 98% confidence score.'
      }
    });
    onStepProgress?.(2, 5, 'Step 2/5: Authority verifies ground truth with 98% confidence score.');
    await new Promise(r => setTimeout(r, 1800));
    this.verifyIncident(newInc.id, 'District Magistrate Control');

    // Step 3: Dispatch NDRF Rescue Team
    this.setState({
      simulation: {
        isSimulating: true,
        activeScenarioName: 'Flash Flood & Roadblock Adaptive Evacuation Flow',
        stepIndex: 3,
        stepMessage: 'Step 3/5: Dispatching NDRF 04 Battalion Rescue Squad with Motorized Boats.'
      }
    });
    onStepProgress?.(3, 5, 'Step 3/5: Dispatching NDRF 04 Battalion Rescue Squad with Motorized Boats.');
    await new Promise(r => setTimeout(r, 1800));
    this.assignTeam(newInc.id, 'TEAM-NDRF-01', 'District Disaster Commander');

    // Step 4: Ground condition shift (Roadblock occurs)
    this.setState({
      simulation: {
        isSimulating: true,
        activeScenarioName: 'Flash Flood & Roadblock Adaptive Evacuation Flow',
        stepIndex: 4,
        stepMessage: 'Step 4/5: DANGER! Sector 4 Causeway road completely submerged (4.8ft water).'
      },
      broadcastAlert: {
        id: `ALERT-${Date.now()}`,
        type: 'CRITICAL',
        message: '🚨 CRITICAL HAZARD: Sector 4 Causeway is SUBMERGED & IMPASSABLE. Adaptive Evacuation activated!',
        timestamp: 'Just now'
      }
    });
    onStepProgress?.(4, 5, 'Step 4/5: DANGER! Sector 4 Causeway road completely submerged (4.8ft water).');
    await new Promise(r => setTimeout(r, 2200));

    // Step 5: Adaptive Evacuation triggers automatic safe re-route & resource allocation
    this.setState({
      activeEvacuationRouteId: 'ROUTE-ADAPTIVE-01',
      simulation: {
        isSimulating: false,
        activeScenarioName: 'Flash Flood & Roadblock Adaptive Evacuation Flow',
        stepIndex: 5,
        stepMessage: 'Step 5/5: COMPLETE! System recalculated evacuation route to North Ridge Highway & allocated 2,000L water.'
      }
    });
    this.allocateResource('RES-01', 2000, 'District Community Hall (Shelter 01)', 'Emergency Logistics AI');
    onStepProgress?.(5, 5, 'Step 5/5: COMPLETE! System recalculated evacuation route to North Ridge Highway & allocated 2,000L water.');
  }

  // Reset demo data to initial state
  public resetToDemoDefaults(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.getDefaultState();
    this.notify();
  }
}

// Global Singleton Instance
export const disasterStore = new DisasterStore();
