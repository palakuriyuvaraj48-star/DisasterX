import { IncidentReport, Shelter, Hospital, RoadblockHazard, ResourceItem, ResponseTeam, AuditLogEntry, EvacuationRoute, RiskZone } from '../types/disaster';

// Primary Coordinates centered around an urban/suburban district with river & coastal topography (e.g. 13.0827, 80.2707)
export const DISTRICT_CENTER = { lat: 13.0827, lng: 80.2707 };

export const INITIAL_RISK_ZONES: RiskZone[] = [
  {
    id: 'RISK-FLOOD-01',
    name: 'Sector 4 Critical Flood Zone',
    type: 'FLOOD',
    riskLevel: 'CRITICAL',
    coordinates: [
      { lat: 13.0780, lng: 80.2560 },
      { lat: 13.0795, lng: 80.2610 },
      { lat: 13.0760, lng: 80.2620 },
      { lat: 13.0745, lng: 80.2570 }
    ],
    description: 'Active flooding with 4.8ft water depth. Impassable for all vehicles.',
    affectedRadiusKm: 1.2
  },
  {
    id: 'RISK-FLOOD-02',
    name: 'North Bridge Approach Flood',
    type: 'FLOOD',
    riskLevel: 'HIGH',
    coordinates: [
      { lat: 13.0970, lng: 80.2530 },
      { lat: 13.1005, lng: 80.2570 },
      { lat: 13.0990, lng: 80.2600 },
      { lat: 13.0955, lng: 80.2560 }
    ],
    description: 'Water overtopping causeway approach. Pedestrian access restricted.',
    affectedRadiusKm: 0.8
  },
  {
    id: 'RISK-FIRE-01',
    name: 'High Street Fire Hazard Zone',
    type: 'FIRE',
    riskLevel: 'HIGH',
    coordinates: [
      { lat: 13.0895, lng: 80.2790 },
      { lat: 13.0925, lng: 80.2825 },
      { lat: 13.0910, lng: 80.2845 },
      { lat: 13.0880, lng: 80.2810 }
    ],
    description: 'Structural fire with dense smoke. 200m exclusion zone active.',
    affectedRadiusKm: 0.6
  },
  {
    id: 'RISK-LANDSIDE-01',
    name: 'Valley Link Road Landslide',
    type: 'LANDSLIDE',
    riskLevel: 'MEDIUM',
    coordinates: [
      { lat: 13.0630, lng: 80.2430 },
      { lat: 13.0670, lng: 80.2470 },
      { lat: 13.0650, lng: 80.2490 },
      { lat: 13.0610, lng: 80.2450 }
    ],
    description: 'Mudslide debris blocking both lanes. Minor aftershock risk.',
    affectedRadiusKm: 0.5
  },
  {
    id: 'RISK-FLOOD-03',
    name: 'Central Bus Terminus Waterlogging',
    type: 'FLOOD',
    riskLevel: 'MEDIUM',
    coordinates: [
      { lat: 13.0825, lng: 80.2730 },
      { lat: 13.0855, lng: 80.2770 },
      { lat: 13.0840, lng: 80.2790 },
      { lat: 13.0810, lng: 80.2750 }
    ],
    description: 'Moderate waterlogging. Traffic slow. Pedestrian movement possible with caution.',
    affectedRadiusKm: 0.4
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'INC-2026-8801',
    type: 'FLOOD',
    title: 'Severe Waterlogging & Rising Floodwaters in Sector 4',
    description: 'Rapid water accumulation exceeding 4.5 feet near Sector 4 residential colony. Ground floor residents marooned. Transformer short-circuit hazard.',
    locationName: 'Sector 4, Riverbank Colony',
    coordinates: { lat: 13.0765, lng: 80.2580 },
    severity: 'CRITICAL',
    verificationStatus: 'VERIFIED',
    confidenceScore: 96,
    reportedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    reportedBy: 'Citizen Patrol / IoT Water Sensor #42',
    source: 'IOT_SENSOR',
    estimatedPeopleAffected: 120,
    assignedTeamId: 'TEAM-NDRF-01',
    isHazardBlocked: true,
    notes: ['Water levels rising at ~5cm/hr', 'Boat evacuation in progress for 35 elderly residents']
  },
  {
    id: 'INC-2026-8802',
    type: 'FIRE',
    title: 'Commercial Complex Electrical Fire on High Street',
    description: 'Dense smoke pouring from 2nd floor electronics warehouse. Sprinkler systems offline. Fire spreading towards adjacent residential apartments.',
    locationName: 'High Street Commercial Plaza',
    coordinates: { lat: 13.0910, lng: 80.2810 },
    severity: 'CRITICAL',
    verificationStatus: 'VERIFIED',
    confidenceScore: 98,
    reportedAt: new Date(Date.now() - 75 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    reportedBy: 'Metropolitan Fire Dispatch #09',
    source: 'OFFICIAL_DISPATCH',
    estimatedPeopleAffected: 85,
    assignedTeamId: 'TEAM-FIRE-01',
    isHazardBlocked: false,
    notes: ['3 tenders active on scene', 'Perimeter secured within 200m']
  },
  {
    id: 'INC-2026-8803',
    type: 'FLOOD',
    title: 'Bridge Approach Embankment Erosion at North Bridge',
    description: 'Water overtopping North Causeway bridge approach road. Pavement cracks observed. Citizens attempting to cross on foot.',
    locationName: 'North Bridge Causeway, Highway 7',
    coordinates: { lat: 13.0990, lng: 80.2550 },
    severity: 'HIGH',
    verificationStatus: 'PENDING',
    confidenceScore: 78,
    reportedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    reportedBy: 'Citizen (Anil K.)',
    source: 'CITIZEN_REPORT',
    estimatedPeopleAffected: 45,
    isHazardBlocked: true,
    notes: ['Awaiting drone recon team confirmation']
  },
  {
    id: 'INC-2026-8804',
    type: 'LANDSLIDE',
    title: 'Mudslide & Tree Fall on Valley Link Road',
    description: 'Heavy mudslide blocked both lanes of the valley bypass road. Two passenger vehicles stranded, passengers evacuated safely to roadside shelter.',
    locationName: 'Valley Link Road, Km Marker 14',
    coordinates: { lat: 13.0650, lng: 80.2450 },
    severity: 'HIGH',
    verificationStatus: 'VERIFIED',
    confidenceScore: 92,
    reportedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    reportedBy: 'Highway Patrol Unit 4',
    source: 'OFFICIAL_DISPATCH',
    estimatedPeopleAffected: 25,
    assignedTeamId: 'TEAM-VOL-01',
    isHazardBlocked: true
  },
  {
    id: 'INC-2026-8805',
    type: 'CHEMICAL',
    title: 'Potential Ammonia Smell Detected near Cold Storage',
    description: 'Pungent odor reported by neighborhood residents. Breathing discomfort in 4 individuals. Investigation team dispatched.',
    locationName: 'Industrial Zone Gate 3',
    coordinates: { lat: 13.1080, lng: 80.2920 },
    severity: 'MODERATE',
    verificationStatus: 'PENDING',
    confidenceScore: 65,
    reportedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    reportedBy: 'Resident Alert (Deepa S.)',
    source: 'CITIZEN_REPORT',
    estimatedPeopleAffected: 15
  },
  {
    id: 'INC-2026-8806',
    type: 'OTHER',
    title: 'High-Tension Power Cable Snapped Across Footpath',
    description: 'Live wire dangling across pedestrian walkway near bus terminus. Immediate barricading requested.',
    locationName: 'Central Bus Terminus, Gate 2',
    coordinates: { lat: 13.0840, lng: 80.2750 },
    severity: 'HIGH',
    verificationStatus: 'VERIFIED',
    confidenceScore: 94,
    reportedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60000).toISOString(),
    reportedBy: 'Electricity Board Inspector',
    source: 'OFFICIAL_DISPATCH',
    estimatedPeopleAffected: 60,
    assignedTeamId: 'TEAM-MED-01'
  }
];

export const INITIAL_SHELTERS: Shelter[] = [
  {
    id: 'SHELTER-01',
    name: 'District Community Hall & Safe Camp',
    locationName: 'Sector 2 High Ground, West Avenue',
    coordinates: { lat: 13.0890, lng: 80.2450 },
    totalCapacity: 500,
    currentOccupancy: 285,
    status: 'OPEN',
    contactPhone: '+91 44 2851 0011',
    amenities: {
      hasMedical: true,
      hasFood: true,
      hasWater: true,
      hasPower: true,
      wheelchairAccessible: true
    },
    distanceKm: 1.8
  },
  {
    id: 'SHELTER-02',
    name: 'Govt. Higher Secondary School Relief Center',
    locationName: 'East Ridge Road, Block B',
    coordinates: { lat: 13.0720, lng: 80.2880 },
    totalCapacity: 800,
    currentOccupancy: 420,
    status: 'OPEN',
    contactPhone: '+91 44 2851 0022',
    amenities: {
      hasMedical: true,
      hasFood: true,
      hasWater: true,
      hasPower: true,
      wheelchairAccessible: true
    },
    distanceKm: 2.6
  },
  {
    id: 'SHELTER-03',
    name: 'National Sports Complex Safe Haven',
    locationName: 'Stadium Road, North Sector',
    coordinates: { lat: 13.1120, lng: 80.2680 },
    totalCapacity: 1200,
    currentOccupancy: 310,
    status: 'OPEN',
    contactPhone: '+91 44 2851 0033',
    amenities: {
      hasMedical: true,
      hasFood: true,
      hasWater: true,
      hasPower: true,
      wheelchairAccessible: true
    },
    distanceKm: 3.4
  },
  {
    id: 'SHELTER-04',
    name: 'St. Jude Youth Center Shelter',
    locationName: 'Pinehill Road, South Sector',
    coordinates: { lat: 13.0580, lng: 80.2620 },
    totalCapacity: 350,
    currentOccupancy: 340,
    status: 'FULL',
    contactPhone: '+91 44 2851 0044',
    amenities: {
      hasMedical: false,
      hasFood: true,
      hasWater: true,
      hasPower: true,
      wheelchairAccessible: false
    },
    distanceKm: 4.1
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP-01',
    name: 'Government District General Hospital',
    locationName: 'Hospital Boulevard, Central',
    coordinates: { lat: 13.0830, lng: 80.2650 },
    availableBeds: 64,
    icuAvailable: 12,
    traumaLevel: 'LEVEL_1',
    contactPhone: '+91 44 2530 5000',
    distanceKm: 1.2
  },
  {
    id: 'HOSP-02',
    name: 'City Trauma & Emergency Institute',
    locationName: 'North Ring Road',
    coordinates: { lat: 13.1010, lng: 80.2780 },
    availableBeds: 38,
    icuAvailable: 8,
    traumaLevel: 'LEVEL_1',
    contactPhone: '+91 44 2530 6000',
    distanceKm: 2.9
  },
  {
    id: 'HOSP-03',
    name: 'Cantonment Care Center',
    locationName: 'South Barracks Road',
    coordinates: { lat: 13.0610, lng: 80.2730 },
    availableBeds: 22,
    icuAvailable: 4,
    traumaLevel: 'LEVEL_2',
    contactPhone: '+91 44 2530 7000',
    distanceKm: 3.7
  }
];

export const INITIAL_ROADBLOCKS: RoadblockHazard[] = [
  {
    id: 'HAZARD-01',
    name: 'Sector 4 Main Causeway Submerged',
    description: 'Water depth 4.8ft across 400m stretch. All vehicular & pedestrian traffic blocked.',
    coordinates: { lat: 13.0760, lng: 80.2600 },
    affectedRoadName: 'Sector 4 Riverbank Causeway',
    isPassable: false,
    reason: 'FLOODING',
    reportedAt: new Date(Date.now() - 50 * 60000).toISOString(),
    verifiedByAuthority: true
  },
  {
    id: 'HAZARD-02',
    name: 'Commercial High Street Fire Barricade',
    description: 'Road closed for fire tender operations and smoke hazard.',
    coordinates: { lat: 13.0905, lng: 80.2805 },
    affectedRoadName: 'High Street Northbound',
    isPassable: false,
    reason: 'FIRE',
    reportedAt: new Date(Date.now() - 70 * 60000).toISOString(),
    verifiedByAuthority: true
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-01',
    name: 'Potable Drinking Water (20L Cans)',
    category: 'WATER',
    quantity: 4200,
    unit: 'Units',
    locationName: 'Central Logistics Depot, West Gate',
    coordinates: { lat: 13.0850, lng: 80.2500 },
    priority: 'CRITICAL',
    assignedToSector: 'Sector 2 & Sector 4',
    lastUpdated: '10 mins ago'
  },
  {
    id: 'RES-02',
    name: 'Ready-to-Eat Emergency Food Packs',
    category: 'FOOD',
    quantity: 8500,
    unit: 'Packs',
    locationName: 'State Civil Supplies Warehouse',
    coordinates: { lat: 13.0950, lng: 80.2600 },
    priority: 'HIGH',
    assignedToSector: 'All Relief Camps',
    lastUpdated: '25 mins ago'
  },
  {
    id: 'RES-03',
    name: 'Trauma First Aid & Anti-Venom Kits',
    category: 'MEDICAL',
    quantity: 650,
    unit: 'Kits',
    locationName: 'Govt. Medical Store Depot',
    coordinates: { lat: 13.0820, lng: 80.2670 },
    priority: 'CRITICAL',
    assignedToSector: 'Field Ambulances',
    lastUpdated: '5 mins ago'
  },
  {
    id: 'RES-04',
    name: 'Inflatable Motorized Rescue Boats',
    category: 'RESCUE_EQUIPMENT',
    quantity: 14,
    unit: 'Boats',
    locationName: 'NDRF Base Camp Unit 4',
    coordinates: { lat: 13.0780, lng: 80.2520 },
    priority: 'CRITICAL',
    assignedToSector: 'Sector 4 Riverbank',
    lastUpdated: '12 mins ago'
  },
  {
    id: 'RES-05',
    name: 'Emergency Blankets & Tarpaulin Tents',
    category: 'SHELTER_KIT',
    quantity: 1800,
    unit: 'Kits',
    locationName: 'Red Cross Relief Stockpile',
    coordinates: { lat: 13.0880, lng: 80.2720 },
    priority: 'STANDARD',
    assignedToSector: 'Sports Complex Shelter',
    lastUpdated: '40 mins ago'
  },
  {
    id: 'RES-06',
    name: '4x4 High-Clearance Evacuation Trucks',
    category: 'TRANSPORT',
    quantity: 9,
    unit: 'Vehicles',
    locationName: 'District Transport Pool',
    coordinates: { lat: 13.0700, lng: 80.2600 },
    priority: 'HIGH',
    assignedToSector: 'Sector 4 & Valley bypass',
    lastUpdated: '15 mins ago'
  }
];

export const INITIAL_TEAMS: ResponseTeam[] = [
  {
    id: 'TEAM-NDRF-01',
    name: 'NDRF 04 Battalion Rescue Squad',
    category: 'NDRF',
    status: 'ON_SCENE',
    personnelCount: 18,
    contactLead: 'Cmdr. Rajesh Kumar',
    phone: '+91 98400 11223',
    coordinates: { lat: 13.0770, lng: 80.2575 },
    currentAssignmentIncidentId: 'INC-2026-8801',
    etaMinutes: 0,
    lastCheckin: '3 mins ago'
  },
  {
    id: 'TEAM-FIRE-01',
    name: 'Metro Fire Rapid Strike Team',
    category: 'FIRE_RESCUE',
    status: 'ON_SCENE',
    personnelCount: 14,
    contactLead: 'Station Officer S. Raman',
    phone: '+91 98400 44556',
    coordinates: { lat: 13.0912, lng: 80.2815 },
    currentAssignmentIncidentId: 'INC-2026-8802',
    etaMinutes: 0,
    lastCheckin: '7 mins ago'
  },
  {
    id: 'TEAM-MED-01',
    name: 'Mobile Trauma & Paramedic Unit 03',
    category: 'MEDICAL_SQUAD',
    status: 'EN_ROUTE',
    personnelCount: 6,
    contactLead: 'Dr. Anita Roy',
    phone: '+91 98400 77889',
    coordinates: { lat: 13.0860, lng: 80.2710 },
    currentAssignmentIncidentId: 'INC-2026-8806',
    etaMinutes: 4,
    lastCheckin: '1 min ago'
  },
  {
    id: 'TEAM-VOL-01',
    name: 'Civil Defense Volunteer Quick Response',
    category: 'VOLUNTEER_CORPS',
    status: 'ON_SCENE',
    personnelCount: 25,
    contactLead: 'Lead Vol. K. Vignesh',
    phone: '+91 98400 99001',
    coordinates: { lat: 13.0655, lng: 80.2455 },
    currentAssignmentIncidentId: 'INC-2026-8804',
    etaMinutes: 0,
    lastCheckin: '14 mins ago'
  },
  {
    id: 'TEAM-AMB-02',
    name: 'Advanced Life Support Ambulance Unit 07',
    category: 'AMBULANCE',
    status: 'AVAILABLE',
    personnelCount: 4,
    contactLead: 'EMT David M.',
    phone: '+91 98400 22334',
    coordinates: { lat: 13.0835, lng: 80.2660 },
    lastCheckin: 'Just now'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUDIT-1091',
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    officerName: 'District Collector / Magistrate',
    officerRole: 'ADMIN',
    action: 'INCIDENT_VERIFIED',
    targetType: 'INCIDENT',
    targetId: 'INC-2026-8801',
    details: 'Verified flood report in Sector 4 based on IoT water level sensor telemetry and aerial visual. Severity set to CRITICAL.',
    auditHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'AUDIT-1092',
    timestamp: new Date(Date.now() - 38 * 60000).toISOString(),
    officerName: 'Chief Disaster Coordinator',
    officerRole: 'ADMIN',
    action: 'TEAM_DISPATCHED',
    targetType: 'TEAM',
    targetId: 'TEAM-NDRF-01',
    details: 'Dispatched NDRF 04 Battalion Rescue Squad to Sector 4 Riverbank with 4 motorized boats.',
    auditHash: 'SHA256:cb8379ac2c110350d477ee709738d330949d45d3ac7187e51794e143820de45f'
  },
  {
    id: 'AUDIT-1093',
    timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    officerName: 'Logistics Commander',
    officerRole: 'ADMIN',
    action: 'RESOURCE_ALLOCATED',
    targetType: 'RESOURCE',
    targetId: 'RES-01',
    details: 'Allocated 2,000 units of 20L Potable Drinking Water to District Community Hall Relief Camp (SHELTER-01).',
    auditHash: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
];

// Pre-calculated primary & adaptive evacuation routes for demonstration
export const INITIAL_EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'ROUTE-PRIMARY-01',
    name: 'Sector 4 Standard Route via Riverbank Causeway',
    startPoint: { lat: 13.0765, lng: 80.2580 },
    destinationShelterId: 'SHELTER-01',
    waypoints: [
      { lat: 13.0765, lng: 80.2580 }, // Start Sector 4
      { lat: 13.0760, lng: 80.2600 }, // Hazard Causeway (Blocked!)
      { lat: 13.0820, lng: 80.2550 },
      { lat: 13.0890, lng: 80.2450 }  // Shelter 01
    ],
    distanceKm: 2.1,
    estimatedTimeMin: 18,
    status: 'BLOCKED',
    riskLevel: 'IMPASSABLE',
    pathDescription: 'Sector 4 → Causeway Bridge → West Avenue → Shelter 01',
    alternativeRouteId: 'ROUTE-ADAPTIVE-01',
    hazardAlert: 'Causeway impassable due to 4.8ft water overflow. Do NOT attempt.'
  },
  {
    id: 'ROUTE-ADAPTIVE-01',
    name: 'Adaptive High-Ground Detour via North Ridge Highway',
    startPoint: { lat: 13.0765, lng: 80.2580 },
    destinationShelterId: 'SHELTER-01',
    waypoints: [
      { lat: 13.0765, lng: 80.2580 }, // Start Sector 4
      { lat: 13.0790, lng: 80.2510 }, // Uphill North turn
      { lat: 13.0840, lng: 80.2480 }, // Ridge Highway Overpass
      { lat: 13.0890, lng: 80.2450 }  // Shelter 01 High Ground
    ],
    distanceKm: 2.8,
    estimatedTimeMin: 22,
    status: 'VERIFIED_SAFE',
    riskLevel: 'LOW',
    pathDescription: 'Sector 4 → Ridge Bypass → High Ground Overpass → Shelter 01 (100% Verified Safe Elevation)',
    hazardAlert: undefined
  }
];
