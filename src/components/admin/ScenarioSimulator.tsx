import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  RotateCcw, 
  Navigation, 
  ShieldCheck, 
  Send, 
  Truck,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const ScenarioSimulator: React.FC = () => {
  const { simulation, store } = useDisasterStore();
  const [currentStepInfo, setCurrentStepInfo] = useState<string>(
    simulation.isSimulating ? simulation.stepMessage : 'Ready to simulate dynamic disaster scenario.'
  );

  const startSimulation = async () => {
    soundEffects.playEmergencyAlert();
    await store.runDemoSimulation((step, total, msg) => {
      setCurrentStepInfo(msg);
      if (step === 5) {
        soundEffects.playRerouteChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  };

  const stepsList = [
    { title: 'Citizen Ground Report', desc: 'Citizen in Sector 4 reports rapid flash flood overtopping retaining wall.' },
    { title: 'Authority Verification', desc: 'Command Duty Officer cross-checks IoT sensor and verifies with 98% confidence.' },
    { title: 'Response Team Dispatch', desc: 'NDRF 04 Battalion Rescue Squad dispatched with motorized rescue boats.' },
    { title: 'Ground Condition Shift', desc: 'CRITICAL HAZARD: Sector 4 Causeway completely submerged (4.8ft water).' },
    { title: 'Adaptive Rerouting & Logistics', desc: 'Evacuation engine auto-reroutes citizens via North Ridge Highway & allocates 2,000L water.' }
  ];

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </span>
            <h3 className="text-lg font-bold text-white font-mono">
              SIH & JURY LIVE SCENARIO SIMULATION ENGINE
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Demonstrates real-time closed-loop adaptation: Citizen Report → Verification → Dispatch → Hazard Shift → Adaptive Re-routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={simulation.isSimulating}
            onClick={startSimulation}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{simulation.isSimulating ? 'Simulating Ground Shift...' : 'Trigger Live Hazard Scenario'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Telemetry Box */}
      <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${simulation.isSimulating ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
            <span>Telemetry Simulation Feed:</span>
          </span>
          <span className="text-xs font-mono text-gray-400">
            Step {simulation.stepIndex} of 5
          </span>
        </div>
        <p className="text-sm font-semibold text-white font-mono bg-gray-900/90 p-3 rounded-lg border border-gray-700">
          {currentStepInfo}
        </p>
      </div>

      {/* 5-Step Architecture Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stepsList.map((st, i) => {
          const stepNum = i + 1;
          const isDone = simulation.stepIndex >= stepNum;
          const isCurrent = simulation.stepIndex === stepNum && simulation.isSimulating;

          return (
            <div
              key={i}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-950/50 border-amber-500 shadow-lg shadow-amber-950/40 animate-pulse'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-600 text-emerald-100'
                  : 'bg-gray-950/60 border-gray-800 text-gray-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isDone ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {isDone ? '✓' : stepNum}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-gray-400">Phase {stepNum}</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{st.title}</h4>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{st.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono font-bold">
                {isDone ? 'COMPLETED' : isCurrent ? 'EXECUTING...' : 'QUEUED'}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
