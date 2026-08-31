import React from 'react';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DisasterMap } from '../map/DisasterMap';
import { soundEffects } from '../../services/soundEffects';

export const EvacuationIntelligence: React.FC = () => {
  const { 
    evacuationRoutes, 
    activeEvacuationRouteId, 
    shelters, 
    roadblocks, 
    store 
  } = useDisasterStore();

  const activeRoute = evacuationRoutes.find(r => r.id === activeEvacuationRouteId) || evacuationRoutes[1];
  const primaryBlockedRoute = evacuationRoutes.find(r => r.id === 'ROUTE-PRIMARY-01');
  const adaptiveSafeRoute = evacuationRoutes.find(r => r.id === 'ROUTE-ADAPTIVE-01');

  const handleSelectRoute = (routeId: string) => {
    store.setActiveEvacuationRoute(routeId);
    soundEffects.playVerificationBlip();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 p-5 rounded-2xl border border-gray-800 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/80 px-2.5 py-0.5 rounded-full">
            ADAPTIVE EVACUATION INTELLIGENCE
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
            Find the safest way out.
          </h2>
          <p className="text-xs text-gray-400">
            Real-time elevation vectors, hazard detection, and dynamically rerouted escape paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              store.setActiveEvacuationRoute('ROUTE-ADAPTIVE-01');
              soundEffects.playRerouteChime();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition shadow flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate Route</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Route Cards & Interactive Tactical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Route Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Recommended Route */}
          <div 
            onClick={() => handleSelectRoute('ROUTE-ADAPTIVE-01')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xl space-y-3 ${
              activeEvacuationRouteId === 'ROUTE-ADAPTIVE-01'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-emerald-950/50 scale-[1.01]'
                : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>RECOMMENDED ROUTE</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono font-bold">
                ✓ VERIFIED SAFE
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-white">
                Sector 4 → North Ridge Highway → Shelter 01
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Adaptive High-Elevation Detour avoiding low-lying riverbank flash surge.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-400 text-[10px] block">ESTIMATED DISTANCE</span>
                <span className="text-base font-bold text-white">2.8 km</span>
              </div>
              <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-400 text-[10px] block">ESTIMATED TRAVEL</span>
                <span className="text-base font-bold text-emerald-400">22 mins</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
              <span>● Status: High Ground Corridor Clear</span>
            </div>
          </div>

          {/* Card 2: Alternative / Compromised Route */}
          <div 
            onClick={() => handleSelectRoute('ROUTE-PRIMARY-01')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xl space-y-3 ${
              activeEvacuationRouteId === 'ROUTE-PRIMARY-01'
                ? 'bg-red-950/40 border-red-500 shadow-red-950/50 scale-[1.01]'
                : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>PRIMARY CAUSEWAY ROUTE</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold">
                ⛔ SUBMERGED / BLOCKED
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-white">
                Sector 4 → Causeway Bridge → Shelter 01
              </h3>
              <p className="text-xs text-red-200 mt-1">
                4.8ft floodwater overflow. Pavement erosion hazard. Do NOT traverse.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-400 text-[10px] block">ESTIMATED DISTANCE</span>
                <span className="text-base font-bold text-gray-400">2.1 km</span>
              </div>
              <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-400 text-[10px] block">HAZARD SEVERITY</span>
                <span className="text-base font-bold text-red-400">IMPASSABLE</span>
              </div>
            </div>
          </div>

          {/* Blocked Roads Telemetry Alert */}
          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Active Roadblocks in Sector ({roadblocks.length})</span>
            </span>
            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              {roadblocks.map((rb) => (
                <div key={rb.id} className="p-2 bg-gray-900 rounded-lg border border-gray-800 flex justify-between items-center">
                  <span>{rb.name}</span>
                  <span className="text-red-400 font-bold">{rb.reason}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive GIS Map */}
        <div className="lg:col-span-7 h-[580px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <DisasterMap />
        </div>

      </div>

    </div>
  );
};
