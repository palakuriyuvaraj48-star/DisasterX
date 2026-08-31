export type UserRole = 'CITIZEN' | 'RESPONDER' | 'ADMIN';

export type DisasterType = 
  | 'FLOOD' 
  | 'FIRE' 
  | 'EARTHQUAKE' 
  | 'CYCLONE' 
  | 'LANDSLIDE' 
  | 'CHEMICAL' 
  | 'OTHER';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'UNKNOWN';

export type ResponseTeamStatus = 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'COMPLETED' | 'UNAVAILABLE';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface IncidentReport {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  severity: SeverityLevel;
  verificationStatus: VerificationStatus;
  confidenceScore: number; // 0 - 100
  reportedAt: string; // ISO string
  updatedAt: string;
  reportedBy: string;
  source: 'CITIZEN_REPORT' | 'SATELLITE_FEED' | 'OFFICIAL_DISPATCH' | 'IOT_SENSOR' | 'DRONE_RECON';
  estimatedPeopleAffected?: number;
  assignedTeamId?: string;
  mediaUrls?: string[];
  notes?: string[];
  isHazardBlocked?: boolean; // For adaptive routing detection
}

export interface Shelter {
  id: string;
  name: string;
  locationName: string;
  coordinates: Coordinates;
  totalCapacity: number;
  currentOccupancy: number;
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'HIGH_RISK';
  contactPhone: string;
  amenities: {
    hasMedical: boolean;
    hasFood: boolean;
    hasWater: boolean;
    hasPower: boolean;
    wheelchairAccessible: boolean;
  };
  distanceKm?: number;
}

export interface Hospital {
  id: string;
  name: string;
  locationName: string;
  coordinates: Coordinates;
  availableBeds: number;
  icuAvailable: number;
  traumaLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  contactPhone: string;
  distanceKm?: number;
}

export interface RoadblockHazard {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinates;
  affectedRoadName: string;
  isPassable: boolean;
  reason: 'FLOODING' | 'DEBRIS' | 'BRIDGE_DAMAGE' | 'FIRE' | 'LANDSLIDE';
  reportedAt: string;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  startPoint: Coordinates;
  destinationShelterId: string;
  waypoints: Coordinates[];
  distanceKm: number;
  estimatedTimeMin: number;
  status: 'VERIFIED_SAFE' | 'COMPROMISED' | 'BLOCKED' | 'ALTERNATIVE_CALCULATED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMPASSABLE';
  pathDescription: string;
  alternativeRouteId?: string;
  hazardAlert?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'WATER' | 'FOOD' | 'MEDICAL' | 'SHELTER_KIT' | 'TRANSPORT' | 'RESCUE_EQUIPMENT';
  quantity: number;
  unit: string;
  locationName: string;
  coordinates: Coordinates;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
  assignedToSector: string;
  lastUpdated: string;
}

export interface ResponseTeam {
  id: string;
  name: string;
  category: 'NDRF' | 'FIRE_RESCUE' | 'MEDICAL_SQUAD' | 'AMBULANCE' | 'VOLUNTEER_CORPS';
  status: ResponseTeamStatus;
  personnelCount: number;
  contactLead: string;
  phone: string;
  coordinates: Coordinates;
  currentAssignmentIncidentId?: string;
  etaMinutes?: number;
  lastCheckin: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  action: string;
  targetType: 'INCIDENT' | 'RESOURCE' | 'TEAM' | 'ROUTE' | 'SYSTEM_ALERT';
  targetId: string;
  details: string;
  auditHash: string;
}

export interface DisasterGuide {
  type: DisasterType;
  title: string;
  emoji: string;
  brief: string;
  immediateActions: string[];
  whatToAvoid: string[];
  evacuationTips: string[];
  emergencyContacts: { label: string; number: string }[];
}

export interface ScenarioSimulationState {
  isSimulating: boolean;
  activeScenarioName: string | null;
  stepIndex: number;
  stepMessage: string;
  simulatedHazardId?: string;
}
