import React from 'react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { BarChart3 } from 'lucide-react';

export const AuthorityAnalytics: React.FC = () => {
  const { incidents, shelters, teams, roadblocks } = useDisasterStore();
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const safeShelters = Array.isArray(shelters) ? shelters : [];
  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeRoadblocks = Array.isArray(roadblocks) ? roadblocks : [];

  const criticalCount = safeIncidents.filter(i => i.severity === 'CRITICAL').length;
  const verifiedCount = safeIncidents.filter(i => i.verificationStatus === 'VERIFIED').length;
  const pendingCount = safeIncidents.filter(i => i.verificationStatus === 'PENDING').length;
  const openShelters = safeShelters.filter(s => s.status === 'OPEN').length;
  const activeTeams = safeTeams.filter(t => t.status === 'EN_ROUTE' || t.status === 'ON_SCENE').length;
  const blockedRoads = safeRoadblocks.filter(r => !r.isPassable).length;

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          Disaster Analytics
        </h2>
        <p className="text-xs text-gray-400 mt-1">Operational overview derived from current state.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Total Incidents" value={safeIncidents.length} />
        <MetricCard label="Critical" value={criticalCount} accent="text-red-400" />
        <MetricCard label="Verified" value={verifiedCount} accent="text-emerald-400" />
        <MetricCard label="Pending" value={pendingCount} accent="text-amber-400" />
        <MetricCard label="Active Teams" value={activeTeams} accent="text-blue-400" />
        <MetricCard label="Blocked Roads" value={blockedRoads} accent="text-red-400" />
        <MetricCard label="Open Shelters" value={openShelters} accent="text-emerald-400" />
        <MetricCard label="Total Shelters" value={safeShelters.length} />
        <MetricCard label="Total Teams" value={safeTeams.length} />
        <MetricCard label="Total Roadblocks" value={safeRoadblocks.length} />
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Status Summary</h3>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>Verification Rate</span>
            <span className="font-mono font-bold text-white">
              {safeIncidents.length > 0 ? Math.round((verifiedCount / safeIncidents.length) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shelter Utilization</span>
            <span className="font-mono font-bold text-white">
              {safeShelters.length > 0 ? Math.round((safeShelters.reduce((a, s) => a + s.currentOccupancy, 0) / safeShelters.reduce((a, s) => a + s.totalCapacity, 0)) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Team Deployment Rate</span>
            <span className="font-mono font-bold text-white">
              {safeTeams.length > 0 ? Math.round((activeTeams / safeTeams.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: number; accent?: string }> = ({ label, value, accent = 'text-white' }) => (
  <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
    <span className="text-[10px] text-gray-400 block">{label}</span>
    <span className={`text-sm font-bold ${accent}`}>{value}</span>
  </div>
);
