// Simulate DisasterStore hydration behavior
// to verify backward-compatible localStorage migration.

// Mock localStorage
const localStorageData = {};

const mockLocalStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, value) => { localStorageData[key] = value; },
  removeItem: (key) => { delete localStorageData[key]; },
};

global.localStorage = mockLocalStorage;

// Mock navigator
global.navigator = { onLine: true };

// Exact safe-merge logic from the fixed store.
function getDefaultState() {
  return {
    currentRole: 'CITIZEN',
    isEmergencyMode: false,
    isHighContrast: false,
    isAudioAlertsEnabled: true,
    isOffline: false,
    lastSyncedTimestamp: 'now',
    selectedDisaster: null,
    incidents: [{ id: 'INC-1', type: 'FLOOD', title: 'Test' }],
    shelters: [{ id: 'S-1', name: 'Test Shelter' }],
    hospitals: [{ id: 'H-1', name: 'Test Hospital' }],
    roadblocks: [{ id: 'RB-1', name: 'Test Block' }],
    resources: [{ id: 'RES-1', name: 'Test Resource' }],
    teams: [{ id: 'T-1', name: 'Test Team' }],
    auditLogs: [{ id: 'A-1', action: 'TEST' }],
    evacuationRoutes: [{ id: 'R-1', name: 'Test Route' }],
    riskZones: [{ id: 'RZ-1', name: 'Test Zone' }],
    selectedMapItem: null,
    activeEvacuationRouteId: 'ROUTE-ADAPTIVE-01',
    simulation: { isSimulating: false, activeScenarioName: null, stepIndex: 0, stepMessage: 'idle' },
    broadcastAlert: { id: 'ALERT-01', type: 'WARNING', message: 'test', timestamp: 'now' },
    offlineQueueCount: 0,
  };
}

function safeArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

function safeString(value, fallback) {
  return typeof value === 'string' ? value : fallback;
}

function safeBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function safeNumber(value, fallback) {
  return typeof value === 'number' ? value : fallback;
}

function safeObject(value, fallback) {
  return typeof value === 'object' && value !== null ? value : fallback;
}

function hydrate(saved) {
  const defaults = getDefaultState();
  if (!saved) return defaults;

  try {
    const parsed = JSON.parse(saved);
    return {
      ...defaults,
      ...parsed,
      currentRole: safeString(parsed.currentRole, defaults.currentRole),
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
    return defaults;
  }
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ FAIL: ${name} - ${e.message}`);
    failed++;
  }
}

// TEST A: Fresh browser (no localStorage)
test('Fresh state - all arrays present', () => {
  const state = hydrate(null);
  const arrays = ['incidents', 'shelters', 'hospitals', 'roadblocks', 'resources', 'teams', 'auditLogs', 'evacuationRoutes', 'riskZones'];
  for (const key of arrays) {
    if (!Array.isArray(state[key])) throw new Error(`${key} is not an array: ${typeof state[key]}`);
  }
});

// TEST B: Incomplete old state
test('Incomplete old state - missing arrays fallback to defaults', () => {
  const saved = JSON.stringify({
    currentRole: 'CITIZEN',
    incidents: [],
    shelters: []
  });
  const state = hydrate(saved);
  if (!Array.isArray(state.roadblocks)) throw new Error('roadblocks missing');
  if (!Array.isArray(state.teams)) throw new Error('teams missing');
  if (!Array.isArray(state.riskZones)) throw new Error('riskZones missing');
  if (!Array.isArray(state.evacuationRoutes)) throw new Error('evacuationRoutes missing');
  if (state.roadblocks.length === 0) throw new Error('roadblocks should have defaults');
});

// TEST C: Malformed state
test('Malformed state - invalid arrays fallback to defaults', () => {
  const saved = JSON.stringify({
    incidents: null,
    shelters: 'invalid',
    roadblocks: null,
    teams: {},
    riskZones: 'broken',
    evacuationRoutes: null
  });
  const state = hydrate(saved);
  if (!Array.isArray(state.incidents)) throw new Error('incidents not array');
  if (!Array.isArray(state.shelters)) throw new Error('shelters not array');
  if (!Array.isArray(state.roadblocks)) throw new Error('roadblocks not array');
  if (!Array.isArray(state.teams)) throw new Error('teams not array');
  if (!Array.isArray(state.riskZones)) throw new Error('riskZones not array');
  if (!Array.isArray(state.evacuationRoutes)) throw new Error('evacuationRoutes not array');
});

// TEST D: Valid state preserved
test('Valid state - user data preserved', () => {
  const saved = JSON.stringify({
    incidents: [{ id: 'USER-1', type: 'FIRE', title: 'User Report' }],
    shelters: [{ id: 'S-USER', name: 'User Shelter' }],
    isEmergencyMode: true,
  });
  const state = hydrate(saved);
  if (state.incidents.length !== 1) throw new Error('incidents not preserved');
  if (state.incidents[0].id !== 'USER-1') throw new Error('incident data corrupted');
  if (state.shelters.length !== 1) throw new Error('shelters not preserved');
  if (!state.isEmergencyMode) throw new Error('boolean flag not preserved');
});

// TEST E: JSON parse error
test('Malformed JSON - falls back to defaults', () => {
  const state = hydrate('not-json');
  if (!Array.isArray(state.incidents)) throw new Error('incidents not array after parse error');
  if (!Array.isArray(state.roadblocks)) throw new Error('roadblocks not array after parse error');
});

// TEST F: Verify all collections are arrays after hydration
test('All collections are arrays after any hydration', () => {
  const states = [
    hydrate(null),
    hydrate(JSON.stringify({ incidents: [] })),
    hydrate(JSON.stringify({ roadblocks: null })),
    hydrate('invalid-json'),
  ];
  const arrays = ['incidents', 'shelters', 'hospitals', 'roadblocks', 'resources', 'teams', 'auditLogs', 'evacuationRoutes', 'riskZones'];
  for (const state of states) {
    for (const key of arrays) {
      if (!Array.isArray(state[key])) throw new Error(`${key} is not array in state: ${typeof state[key]}`);
    }
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
