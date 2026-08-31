import React, { useState } from 'react';
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
  RefreshCw,
  AlertOctagon,
  Zap
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

  const [isSimulatedBlocked, setIsSimulatedBlocked] = useState(false);
  const [transitionState, setTransitionState] = useState<string | null>(null);

  const handleSimulateRoadBlock = () => {
    soundEffects.playEmergencyAlert();
    setTransitionState('🚨 Situation Changed: Main Road Submerged (4.8ft flood water) → AI Reassessing Ground Telemetry...');

    setTimeout(() => {
      setIsSimulatedBlocked(true);
      store.setActiveEvacuationRoute('ROUTE-ADAPTIVE-01');
      soundEffects.playRerouteChime();
      setTransitionState('✅ AI Reassessment Complete: New Recommended Route Active (Zone A → East Road → Shelter 07 via Ridge Highway)');
    }, 900);
  };

  const handleResetRoute = () => {
    setIsSimulatedBlocked(false);
    setTransitionState(null);
    store.setActiveEvacuationRoute('ROUTE-PRIMARY-01');
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
            🗺️ Adaptive Evacuation Intelligence
          </h2>
          <p className="text-xs text-gray-400">
            Real-time elevation vectors, hazard detection, and dynamically rerouted escape paths.
          </p>
        </div>

        {/* Interactive Simulation Controls for SIH Demo */}
        <div className="flex items-center gap-2">
          {!isSimulatedBlocked ? (
            <button
              onClick={handleSimulateRoadBlock}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-2 active:scale-95 animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>⚠️ SIMULATE ROAD BLOCK</span>
            </button>
          ) : (
            <button
              onClick={handleResetRoute}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold font-mono rounded-xl transition border border-gray-700 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Route Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Transition Banner */}
      {transitionState && (
        <div className="p-3.5 bg-blue-950/90 border-2 border-blue-500 rounded-xl text-xs font-mono text-blue-200 shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top">
          <div className="flex items-center gap-2 font-bold">
            <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span>{transitionState}</span>
          </div>
          <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded text-[10px]">
            ADAPTATION ACTIVE
          </span>
        </div>
      )}

      {/* Main Grid: Route Cards & Interactive Tactical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Route Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Current Risk Level Header */}
          <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 flex items-center justify-between font-mono">
            <span className="text-xs text-gray-400">CURRENT RISK ASSESSMENT:</span>
            <span className="px-2.5 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded font-bold text-xs">
              🔴 Flood Risk — HIGH
            </span>
          </div>

          {/* If NOT simulated blocked: Primary is recommended */}
          {!isSimulatedBlocked ? (
            <>
              {/* Recommended Route: Zone A -> Main Road -> Shelter 04 */}
              <div 
                className="p-5 rounded-2xl border-2 bg-emerald-950/40 border-emerald-500 shadow-emerald-950/50 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>RECOMMENDED ROUTE</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono font-bold">
                    🟢 VERIFIED SAFE
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">
                    Zone A → Main Road → Shelter 04
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 font-sans">
                    Standard high-elevation arterial corridor. All lanes passable.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                    <span className="text-gray-400 text-[10px] block">ESTIMATED DISTANCE</span>
                    <span className="text-base font-bold text-white">2.4 km</span>
                  </div>
                  <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                    <span className="text-gray-400 text-[10px] block">ESTIMATED TRAVEL</span>
                    <span className="text-base font-bold text-emerald-400">18 mins</span>
                  </div>
                </div>
              </div>

              {/* Standby Alternative Route: Zone A -> East Road -> Shelter 07 */}
              <div 
                className="p-4 rounded-2xl border bg-gray-900/60 border-gray-800 space-y-2 opacity-80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-gray-400 font-bold">
                    Alternative Route
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    Standby (2.8 km)
                  </span>
                </div>
                <h4 className="font-bold text-sm text-gray-300">
                  Zone A → East Road → Shelter 07
                </h4>
              </div>
            </>
          ) : (
            /* AFTER SIMULATED ROADBLOCK: Main Road is BLOCKED & Adaptive Alternative is ACTIVATED */
            <>
              {/* Blocked Main Road Alert */}
              <div 
                className="p-4 rounded-2xl border-2 bg-red-950/40 border-red-500 shadow-xl space-y-2 animate-in shake"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>MAIN ROAD STATUS</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-mono font-bold">
                    🔴 BLOCKED
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white line-through text-red-300">
                  Zone A → Main Road → Shelter 04
                </h3>
                <p className="text-xs text-red-200">
                  ⛔ 4.8ft flood surge overtopping causeway. Impassable.
                </p>
              </div>

              {/* NEW RECOMMENDED ROUTE (Adapted) */}
              <div 
                className="p-5 rounded-2xl border-2 bg-emerald-950/60 border-emerald-400 shadow-emerald-950/80 shadow-2xl space-y-3 animate-in zoom-in-95"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                    <span>NEW RECOMMENDED ROUTE</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-mono font-black">
                    🟢 ALTERNATIVE RECOMMENDED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">
                    Zone A → East Road → Shelter 07
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 font-sans">
                    Adaptive ridge overpass bypass. High-elevation ground verified clear.
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

                <div className="text-[11px] font-mono text-yellow-300 bg-black/40 p-2 rounded-lg border border-yellow-500/30">
                  ⚡ <strong>Adaptation Cycle:</strong> Situation Changed → AI Reassessed → New Route
                </div>
              </div>
            </>
          )}

          {/* Active Roadblocks summary */}
          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Active Roadblocks in Sector ({roadblocks.length + (isSimulatedBlocked ? 1 : 0)})</span>
            </span>
            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              {isSimulatedBlocked && (
                <div className="p-2 bg-red-950/60 rounded-lg border border-red-800 flex justify-between items-center text-red-200">
                  <span>Main Road Causeway (Zone A)</span>
                  <span className="text-red-400 font-bold">SUBMERGED</span>
                </div>
              )}
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
