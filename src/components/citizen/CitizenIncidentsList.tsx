import React from 'react';
import { Link } from 'react-router-dom';
import { useDisasterStore } from '../../services/useDisasterStore';
import { AlertTriangle, MapPin } from 'lucide-react';

export const CitizenIncidentsList: React.FC = () => {
  const { incidents } = useDisasterStore();
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  const sorted = [...safeIncidents].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Incidents
        </h2>
        <p className="text-xs text-gray-400 mt-1">Live incident feed for your area.</p>
      </div>

      {sorted.length === 0 ? (
        <div className="p-8 bg-gray-900/80 border border-gray-800 rounded-2xl text-center text-sm text-gray-400">
          No active incidents reported.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((inc) => (
            <Link
              key={inc.id}
              to={`/incidents/${inc.id}`}
              className="block bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-4 shadow-lg transition"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  inc.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                  inc.severity === 'HIGH' ? 'bg-amber-600 text-white' :
                  inc.severity === 'MODERATE' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {inc.severity}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                  inc.verificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                  inc.verificationStatus === 'PENDING' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                  'bg-gray-800 text-gray-400 border-gray-700'
                }`}>
                  {inc.verificationStatus}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">{inc.id}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{inc.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                {inc.locationName}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {new Date(inc.reportedAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
