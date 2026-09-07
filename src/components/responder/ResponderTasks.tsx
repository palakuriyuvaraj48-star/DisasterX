import React from 'react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { ClipboardList } from 'lucide-react';

export const ResponderTasks: React.FC = () => {
  const { incidents, teams } = useDisasterStore();
  const assignedIncidents = incidents.filter(i => i.assignedTeamId);
  const pendingIncidents = incidents.filter(i => i.verificationStatus === 'PENDING');

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-amber-400" />
          Responder Tasks
        </h2>
        <p className="text-xs text-gray-400 mt-1">Assigned incidents and pending actions requiring response.</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider">
          Assigned Incidents ({assignedIncidents.length})
        </h3>
        {assignedIncidents.length === 0 ? (
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-xs text-gray-400 text-center">
            No incidents currently assigned to your team.
          </div>
        ) : (
          <div className="space-y-2">
            {assignedIncidents.map(inc => {
              const team = teams.find(t => t.id === inc.assignedTeamId);
              return (
                <div key={inc.id} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      inc.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{inc.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{inc.locationName}</p>
                  {team && (
                    <p className="text-xs text-blue-400 mt-1 font-mono">Assigned: {team.name} • Status: {team.status}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider">
          Pending Verification ({pendingIncidents.length})
        </h3>
        {pendingIncidents.length === 0 ? (
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-xs text-gray-400 text-center">
            No pending incidents requiring verification.
          </div>
        ) : (
          <div className="space-y-2">
            {pendingIncidents.map(inc => (
              <div key={inc.id} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    inc.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{inc.id}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{inc.locationName}</p>
                <p className="text-xs text-amber-300 mt-1 font-mono">Confidence: {inc.confidenceScore}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
