import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Package, 
  Users, 
  History, 
  Sparkles, 
  AlertTriangle, 
  Home, 
  Activity,
  HeartPulse,
  Navigation,
  FileCheck2
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DisasterMap } from '../map/DisasterMap';
import { IncidentVerifier } from './IncidentVerifier';
import { ResourceMatrix } from './ResourceMatrix';
import { TeamManager } from './TeamManager';
import { AuditLogTable } from './AuditLogTable';
import { ScenarioSimulator } from './ScenarioSimulator';
import { DemoBadge } from '../common/DemoBadge';

export const CommandCenter: React.FC = () => {
  const { 
    incidents, 
    shelters, 
    hospitals, 
    roadblocks, 
    resources, 
    teams, 
    auditLogs 
  } = useDisasterStore();

  const [activeTab, setActiveTab] = useState<'MAP' | 'VERIFY' | 'RESOURCES' | 'TEAMS' | 'AUDIT' | 'SIMULATION'>('MAP');

  // Operational metrics
  const activeIncidentsCount = incidents.length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const verifiedCount = incidents.filter(i => i.verificationStatus === 'VERIFIED').length;
  const totalPeopleAtRisk = incidents.reduce((acc, curr) => acc + (curr.estimatedPeopleAffected || 0), 0);
  const openSheltersCount = shelters.filter(s => s.status === 'OPEN').length;
  const activeTeamsCount = teams.filter(t => t.status === 'EN_ROUTE' || t.status === 'ON_SCENE').length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. TOP COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                🏛️ Disaster Response Command Center
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                AUTHORITY ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Inter-Agency Command • Ground Truth Verification • Multi-Sector Asset Dispatch
            </p>
          </div>
        </div>

        <div>
          <DemoBadge />
        </div>
      </div>

      {/* 2. TOP OPERATIONAL METRICS STRIP (6 CORE METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        
        {/* Metric 1: Active Incidents */}
        <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl shadow">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Active Incidents</span>
          <div className="text-2xl font-black text-white mt-1 flex items-baseline justify-between">
            <span>{activeIncidentsCount}</span>
            <span className="text-[11px] text-red-400 font-bold">{criticalIncidentsCount} Critical</span>
          </div>
        </div>

        {/* Metric 2: Critical Danger Zones */}
        <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl shadow">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Critical Zones</span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-baseline justify-between">
            <span>{roadblocks.length}</span>
            <span className="text-[11px] text-gray-400">Blocked</span>
          </div>
        </div>

        {/* Metric 3: People at Risk */}
        <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl shadow">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">People at Risk</span>
          <div className="text-2xl font-black text-red-400 mt-1 flex items-baseline justify-between">
            <span>~{totalPeopleAtRisk}</span>
            <span className="text-[11px] text-gray-400">Est.</span>
          </div>
        </div>

        {/* Metric 4: Verified Reports */}
        <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl shadow">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Verified Reports</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline justify-between">
            <span>{verifiedCount}</span>
            <span className="text-[11px] text-gray-400">/ {incidents.length}</span>
          </div>
        </div>

        {/* Metric 5: Available Shelters */}
        <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl shadow">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Available Shelters</span>
          <div className="text-2xl font-black text-blue-400 mt-1 flex items-baseline justify-between">
            <span>{openSheltersCount}</span>
            <span className="text-[11px] text-gray-400">/ {shelters.length}</span>
          </div>
        </div>

        {/* Metric 6: Active Response Units */}
        <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl shadow">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Active Response Teams</span>
          <div className="text-2xl font-black text-indigo-400 mt-1 flex items-baseline justify-between">
            <span>{activeTeamsCount}</span>
            <span className="text-[11px] text-gray-400">/ {teams.length}</span>
          </div>
        </div>

      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('MAP')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
            activeTab === 'MAP'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Live Situation Map</span>
        </button>

        <button
          onClick={() => setActiveTab('VERIFY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
            activeTab === 'VERIFY'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Incident Verification ({incidents.filter(i => i.verificationStatus === 'PENDING').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
            activeTab === 'RESOURCES'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Resource Coordination</span>
        </button>

        <button
          onClick={() => setActiveTab('TEAMS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
            activeTab === 'TEAMS'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Response Teams</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
            activeTab === 'AUDIT'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATION')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
            activeTab === 'SIMULATION'
              ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg'
              : 'text-amber-400 hover:text-amber-200 hover:bg-gray-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>SIH Demo Simulation</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      <div>
        {activeTab === 'MAP' && (
          <div className="h-[620px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <DisasterMap />
          </div>
        )}

        {activeTab === 'VERIFY' && <IncidentVerifier />}

        {activeTab === 'RESOURCES' && <ResourceMatrix />}

        {activeTab === 'TEAMS' && <TeamManager />}

        {activeTab === 'AUDIT' && <AuditLogTable />}

        {activeTab === 'SIMULATION' && <ScenarioSimulator />}
      </div>

    </div>
  );
};
