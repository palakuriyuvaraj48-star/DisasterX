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
  Zap, 
  Brain, 
  Check, 
  ShieldAlert 
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

  const safeRoadblocks = Array.isArray(roadblocks) ? roadblocks : [];
  const safeShelters = Array.isArray(shelters) ? shelters : [];
  const safeEvacuationRoutes = Array.isArray(evacuationRoutes) ? evacuationRoutes : [];

  const [isSimulatedBlocked, setIsSimulatedBlocked] = useState(false);
  const [reassessingStage, setReassessingStage] = useState<'IDLE' | 'ANALYZING' | 'DONE'>('IDLE');

  const handleSimulateGroundChange = () => {
    soundEffects.playEmergencyAlert();
    setReassessingStage('ANALYZING');

    setTimeout(() => {
      setIsSimulatedBlocked(true);
      store.setActiveEvacuationRoute('ROUTE-ADAPTIVE-01');
      soundEffects.playRerouteChime();
      setReassessingStage('DONE');
    }, 1200);
  };

  const handleResetRoute = () => {
    setIsSimulatedBlocked(false);
    setReassessingStage('IDLE');
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
            When verified ground conditions change, the recommended evacuation route changes too.
          </p>
        </div>

        {/* Interactive Simulation Controls for SIH Demo */}
        <div className="flex items-center gap-2">
          {!isSimulatedBlocked ? (
            <button
              disabled={reassessingStage === 'ANALYZING'}
              onClick={handleSimulateGroundChange}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-2 active:scale-95 animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>⚠️ Simulate Ground Condition Change</span>
            </button>
          ) : (
            <button
              onClick={handleResetRoute}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold font-mono rounded-xl transition border border-gray-700 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Route Simulation</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Reassessing Stage Banner */}
      {reassessingStage === 'ANALYZING' && (
        <div className="p-4 bg-amber-950/90 border-2 border-amber-500 rounded-2xl text-xs font-mono text-amber-200 shadow-2xl space-y-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span>⚠️ SITUATION CHANGED: Main Road Submerged (4.8ft water overflow)</span>
          </div>
          <div className="space-y-1 pl-5 text-gray-200">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Risk assessment updated (🔴 Flood Risk — CRITICAL)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Topographical corridor constraints updated (Main Road impassable)</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluating optimal high-elevation alternative routes...</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Route Cards & Interactive Tactical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Route Cards & Explainable AI Box */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Current Risk Level Header */}
          <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 flex items-center justify-between font-mono">
            <span className="text-xs text-gray-400">CURRENT RISK ASSESSMENT:</span>
            <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${
              isSimulatedBlocked ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              🔴 Flood Risk — {isSimulatedBlocked ? 'CRITICAL' : 'HIGH'}
            </span>
          </div>

          {/* INITIAL STATE: Recommended Route Zone A -> Main Road -> Shelter 04 */}
          {!isSimulatedBlocked ? (
            <>
              <div className="p-5 rounded-2xl border-2 bg-emerald-950/40 border-emerald-500 shadow-emerald-950/50 shadow-xl space-y-3">
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

              <div className="p-4 rounded-2xl border bg-gray-900/60 border-gray-800 space-y-2 opacity-80">
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
            /* ADAPTED STATE: Main Road Blocked & Zone A -> East Road -> Shelter 07 Recommended */
            <>
              {/* Blocked Main Road Alert */}
              <div className="p-4 rounded-2xl border-2 bg-red-950/40 border-red-500 shadow-xl space-y-2 animate-in shake">
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

              {/* NEW RECOMMENDED ROUTE */}
              <div className="p-5 rounded-2xl border-2 bg-emerald-950/60 border-emerald-400 shadow-emerald-950/80 shadow-2xl space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                    <span>NEW RECOMMENDED ROUTE</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-mono font-black">
                    🟢 RECOMMENDED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">
                    Zone A → East Road → Shelter 07
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 font-sans">
                    Adaptive ridge overpass bypass. High-elevation corridor verified clear.
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
              </div>

              {/* EXPLAINABLE AI REASONING BOX */}
              <div className="bg-gray-950 border-2 border-blue-500/50 rounded-2xl p-4 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-blue-400 font-bold border-b border-gray-800 pb-2">
                  <Brain className="w-4 h-4" />
                  <span>🤖 EXPLAINABLE AI REASONING</span>
                </div>

                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Previous recommendation:</span>
                    <span className="text-gray-300 line-through">Main Road → Shelter 04</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">New ground information:</span>
                    <span className="text-red-400 font-bold">🚧 Road obstruction verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">System Decision:</span>
                    <span className="text-blue-400 font-bold">Route Recalculated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">New recommendation:</span>
                    <span className="text-emerald-400 font-bold">East Road → Shelter 07</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-yellow-300 block">Why did the route change?</span>
                  <ul className="text-[11px] text-gray-300 space-y-1">
                    <li className="flex items-center gap-1.5 text-red-300">
                      <span>• 🚧 Main Road became blocked by 4.8ft floodwater</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-amber-300">
                      <span>• 🔴 Flood risk increased in low-elevation valley</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-300">
                      <span>• 🏠 Shelter 07 is currently safer with available capacity</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-blue-300">
                      <span>• 🗺️ East Road alternative evaluated and verified safe</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Active Roadblocks summary */}
          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
               <span>Active Roadblocks in Sector ({safeRoadblocks.length + (isSimulatedBlocked ? 1 : 0)})</span>
             </span>
             <div className="space-y-1.5 text-xs text-gray-300 font-mono">
               {isSimulatedBlocked && (
                 <div className="p-2 bg-red-950/60 rounded-lg border border-red-800 flex justify-between items-center text-red-200">
                   <span>Main Road Causeway (Zone A)</span>
                   <span className="text-red-400 font-bold">SUBMERGED (4.8ft)</span>
                 </div>
               )}
               {safeRoadblocks.map((rb) => (
                <div key={rb.id} className="p-2 bg-gray-900 rounded-lg border border-gray-800 flex justify-between items-center">
                  <span>{rb.name}</span>
                  <span className="text-red-400 font-bold">{rb.reason}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive GIS Map */}
        <div className="lg:col-span-7 h-[620px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <DisasterMap />
        </div>

      </div>

    </div>
  );
};
