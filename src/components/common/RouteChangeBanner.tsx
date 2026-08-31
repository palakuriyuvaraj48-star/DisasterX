import React from 'react';
import { AlertTriangle, Navigation, ArrowRight, X } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

interface RouteChangeBannerProps {
  onViewRoute: () => void;
}

export const RouteChangeBanner: React.FC<RouteChangeBannerProps> = ({ onViewRoute }) => {
  const { activeEvacuationRouteId } = useDisasterStore();

  if (activeEvacuationRouteId !== 'ROUTE-ADAPTIVE-01') return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-amber-950 to-gray-950 border-b-2 border-amber-500 text-white px-4 py-3 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 bg-amber-600 rounded-xl text-black font-bold shrink-0 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-black" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-red-800 text-red-100 px-2 py-0.2 rounded font-bold">
              CITIZEN REROUTE ALERT
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">
              ⚠️ Your evacuation route has changed
            </span>
          </div>
          <p className="text-xs text-gray-200">
            <strong>Reason:</strong> Main Road has been reported & verified as blocked (4.8ft flood surge). 
            New recommended safe route: <strong className="text-emerald-400">Zone A → East Road → Shelter 07</strong>.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          soundEffects.playVerificationBlip();
          onViewRoute();
        }}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition shadow-lg shrink-0 flex items-center justify-center gap-1.5"
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>🗺️ View New Route</span>
      </button>
    </div>
  );
};
