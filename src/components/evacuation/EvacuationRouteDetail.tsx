import React from 'react';
import { useParams } from 'react-router-dom';
import { useDisasterStore } from '../../services/useDisasterStore';
import { AlertTriangle } from 'lucide-react';

export const EvacuationRouteDetail: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const { evacuationRoutes, activeEvacuationRouteId, roadblocks } = useDisasterStore();
  const route = evacuationRoutes.find(r => r.id === routeId);
  const isActive = routeId === activeEvacuationRouteId;
  const safeRoadblocks = Array.isArray(roadblocks) ? roadblocks : [];

  if (!route) {
    return (
      <div className="p-8 bg-gray-900/80 border border-gray-800 rounded-2xl text-center text-sm text-gray-400">
        Route not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${
            route.status === 'VERIFIED_SAFE' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
            route.status === 'BLOCKED' ? 'bg-red-950 text-red-300 border-red-700' :
            route.status === 'ALTERNATIVE_CALCULATED' ? 'bg-blue-950 text-blue-300 border-blue-700' :
            'bg-gray-800 text-gray-300 border-gray-700'
          }`}>
            {route.status.replace(/_/g, ' ')}
          </span>
          {isActive && (
            <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-blue-950 text-blue-300 border border-blue-700">
              ACTIVE ROUTE
            </span>
          )}
          <span className="text-xs text-gray-400 font-mono">{route.id}</span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white">{route.name}</h1>
          <p className="text-xs text-gray-400 mt-1">{route.pathDescription}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">DISTANCE</span>
            <span className="text-sm font-bold text-white">{route.distanceKm} km</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">TIME</span>
            <span className="text-sm font-bold text-white">{route.estimatedTimeMin} min</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">RISK</span>
            <span className="text-sm font-bold text-white">{route.riskLevel.replace(/_/g, ' ')}</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">STATUS</span>
            <span className="text-sm font-bold text-white">{route.status.replace(/_/g, ' ')}</span>
          </div>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/60 p-3 rounded-xl text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Roadblocks ({safeRoadblocks.length})</span>
          </div>
          {safeRoadblocks.length === 0 ? (
            <p className="text-[11px] text-amber-200/80">No reported roadblocks on this route.</p>
          ) : (
            <ul className="space-y-1">
              {safeRoadblocks.map(rb => (
                <li key={rb.id} className="flex justify-between">
                  <span>{rb.name}</span>
                  <span className="text-red-400 font-bold">{rb.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
