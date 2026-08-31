import React from 'react';
import { 
  Users, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Radio
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { ResponseTeam, ResponseTeamStatus } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';

export const TeamManager: React.FC = () => {
  const { teams, incidents, store } = useDisasterStore();

  const handleStatusChange = (teamId: string, newStatus: ResponseTeamStatus) => {
    store.updateTeamStatus(teamId, newStatus);
    soundEffects.playVerificationBlip();
  };

  const getStatusBadge = (status: ResponseTeamStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">🟢 AVAILABLE</span>;
      case 'EN_ROUTE':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800 animate-pulse">🔵 EN ROUTE</span>;
      case 'ON_SCENE':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">🟠 ON SCENE</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-gray-800 text-gray-300 border border-gray-700">✅ COMPLETED</span>;
      case 'UNAVAILABLE':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">⚫ UNAVAILABLE</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-900/90 p-4 rounded-xl border border-gray-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Response Teams & Field Battalions Dispatch</span>
          </h3>
          <p className="text-xs text-gray-400">
            Real-time status tracking, responder check-ins, and active sector deployments.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const assignedIncident = incidents.find(i => i.id === team.currentAssignmentIncidentId);

          return (
            <div
              key={team.id}
              className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-400 font-bold">{team.id}</span>
                  {getStatusBadge(team.status)}
                </div>

                <div>
                  <h4 className="font-bold text-base text-white">{team.name}</h4>
                  <p className="text-xs text-gray-400">
                    Lead: <strong className="text-gray-200">{team.contactLead}</strong> ({team.personnelCount} Responders)
                  </p>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="bg-gray-950/70 p-3 rounded-xl border border-gray-800/80 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Assignment:</span>
                  <span className="font-bold text-blue-300">
                    {assignedIncident ? assignedIncident.title.slice(0, 24) + '...' : 'Standby / Patrol'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Telemetry Ping:</span>
                  <span className="text-gray-300">{team.lastCheckin}</span>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold block">
                  Update Operational Status:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleStatusChange(team.id, 'AVAILABLE')}
                    className={`py-1 rounded text-[11px] font-semibold border transition ${
                      team.status === 'AVAILABLE' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => handleStatusChange(team.id, 'EN_ROUTE')}
                    className={`py-1 rounded text-[11px] font-semibold border transition ${
                      team.status === 'EN_ROUTE' ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    En Route
                  </button>
                  <button
                    onClick={() => handleStatusChange(team.id, 'ON_SCENE')}
                    className={`py-1 rounded text-[11px] font-semibold border transition ${
                      team.status === 'ON_SCENE' ? 'bg-amber-600 text-white border-amber-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    On Scene
                  </button>
                </div>

                <a
                  href={`tel:${team.phone}`}
                  className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg border border-gray-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Radio Hotline ({team.phone})</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
