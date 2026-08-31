import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Droplet, 
  Flame, 
  Wind, 
  Globe, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DisasterType, SimulationLabState } from '../../types/disaster';
import { SimulationEngine } from '../../services/simulationEngine';
import { soundEffects } from '../../services/soundEffects';
import { AIExplanationPanel } from '../ai/AIExplanationPanel';
import { DemoBadge } from '../common/DemoBadge';

export const ResponseSimulationLab: React.FC = () => {
  const [disasterType, setDisasterType] = useState<DisasterType>('FLOOD');
  const [timeStep, setTimeStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mainRoadBlocked, setMainRoadBlocked] = useState<boolean>(false);
  const [floodRiskLevel, setFloodRiskLevel] = useState<'HIGH' | 'CRITICAL'>('HIGH');
  const [shelter04Capacity, setShelter04Capacity] = useState<number>(60);
  const timerRef = useRef<number | null>(null);

  // Compute live metrics dynamically from current state
  const metrics = SimulationEngine.calculateSimulationMetrics({
    timeStep,
    mainRoadBlocked,
    floodRiskLevel,
    shelter04CapacityPercent: shelter04Capacity,
  });

  // Automated step progression when running
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeStep((prev) => {
          if (prev === 0) {
            soundEffects.playVerificationBlip();
            return 10;
          } else if (prev === 10) {
            setMainRoadBlocked(true);
            soundEffects.playEmergencyAlert();
            return 15;
          } else if (prev === 15) {
            setShelter04Capacity(95);
            setFloodRiskLevel('CRITICAL');
            soundEffects.playRerouteChime();
            return 20;
          } else {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            return 20;
          }
        });
      }, 2400);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    soundEffects.playVerificationBlip();
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeStep(0);
    setMainRoadBlocked(false);
    setFloodRiskLevel('HIGH');
    setShelter04Capacity(60);
    soundEffects.playVerificationBlip();
  };

  const handleTriggerRoadBlock = () => {
    setMainRoadBlocked(true);
    setTimeStep((prev) => Math.max(prev, 10));
    soundEffects.playEmergencyAlert();
  };

  const handleToggleRisk = () => {
    setFloodRiskLevel((prev) => (prev === 'HIGH' ? 'CRITICAL' : 'HIGH'));
    soundEffects.playVerificationBlip();
  };

  const handleToggleShelterCapacity = () => {
    setShelter04Capacity((prev) => (prev >= 90 ? 55 : 95));
    soundEffects.playVerificationBlip();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-900/95 border border-gray-800 p-6 rounded-3xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/40">
              <Zap className="w-5 h-5 text-blue-400" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
              SIH BENCHMARK LAB
            </span>
            <DemoBadge />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            📊 Response Simulation Lab
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Compare a traditional static disaster response plan against Disaster X's constraint-aware adaptive approach.
          </p>
        </div>

        {/* 🎬 SIH Demo Mode Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-5 py-3 bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:opacity-90 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>▶ Run Adaptive Disaster Scenario</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2 transition"
            >
              <Pause className="w-4 h-4" />
              <span>⏸ Pause Simulation</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl border border-gray-700 transition"
            title="Reset Simulation to T=0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector & Interactive Parameter Controls */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
          <div>
            <span className="text-[11px] font-mono uppercase text-gray-400 font-bold block">
              1. Simulation Scenario Configuration
            </span>
            <h3 className="text-base font-bold text-white font-mono mt-0.5">
              Flood Inundation — Sector Zone A (Pop: 50,000 at risk)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['FLOOD', 'FIRE', 'CYCLONE', 'EARTHQUAKE'] as DisasterType[]).map((t) => (
              <button
                key={t}
                onClick={() => setDisasterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
                  disasterType === t
                    ? 'bg-blue-600 text-white border-blue-400 shadow'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                }`}
              >
                {t === 'FLOOD' ? '🌊 Flood' : t === 'FIRE' ? '🔥 Fire' : t === 'CYCLONE' ? '🌪️ Cyclone' : '🌎 Quake'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Manual Parameter Overrides (Interactive State Changes) */}
        <div>
          <span className="text-[11px] font-mono uppercase text-gray-400 font-bold block mb-2">
            2. Real-time Ground Parameter Modifiers:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleTriggerRoadBlock}
              className={`p-3 rounded-2xl border text-left font-mono transition flex items-center justify-between ${
                mainRoadBlocked
                  ? 'bg-red-950/60 border-red-500 text-red-200'
                  : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-gray-400 block">ROAD CORRIDOR</span>
                <span className="text-xs font-bold font-sans">
                  {mainRoadBlocked ? '⛔ Main Road: BLOCKED' : '🟢 Main Road: Clear'}
                </span>
              </div>
              <AlertTriangle className={`w-4 h-4 ${mainRoadBlocked ? 'text-red-400' : 'text-gray-500'}`} />
            </button>

            <button
              onClick={handleToggleRisk}
              className={`p-3 rounded-2xl border text-left font-mono transition flex items-center justify-between ${
                floodRiskLevel === 'CRITICAL'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                  : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-gray-400 block">FLOOD SEVERITY</span>
                <span className="text-xs font-bold font-sans">
                  Risk Level: {floodRiskLevel}
                </span>
              </div>
              <Droplet className={`w-4 h-4 ${floodRiskLevel === 'CRITICAL' ? 'text-amber-400' : 'text-gray-500'}`} />
            </button>

            <button
              onClick={handleToggleShelterCapacity}
              className={`p-3 rounded-2xl border text-left font-mono transition flex items-center justify-between ${
                shelter04Capacity >= 90
                  ? 'bg-red-950/60 border-red-500 text-red-200'
                  : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-gray-400 block">SHELTER 04 CAPACITY</span>
                <span className="text-xs font-bold font-sans">
                  {shelter04Capacity}% ({shelter04Capacity >= 90 ? 'Critical' : 'Normal'})
                </span>
              </div>
              <TrendingUp className={`w-4 h-4 ${shelter04Capacity >= 90 ? 'text-red-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Simulation Timeline */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Simulation Chronological Timeline (Minutes from Crisis Start)</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-xs font-bold">
            Current: T+{timeStep} min
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* T+0 */}
          <div className={`p-3 rounded-2xl border transition ${
            timeStep >= 0 ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200' : 'bg-gray-950 border-gray-800 text-gray-500'
          }`}>
            <div className="font-bold flex items-center justify-between mb-1">
              <span>T+0 min</span>
              {timeStep >= 0 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="font-sans text-[11px] opacity-90">
              Disaster detected. Initial route assigned via Main Road to Shelter 04.
            </p>
          </div>

          {/* T+10 */}
          <div className={`p-3 rounded-2xl border transition ${
            timeStep >= 10 ? 'bg-red-950/40 border-red-500 text-red-200 animate-pulse' : 'bg-gray-950 border-gray-800 text-gray-500'
          }`}>
            <div className="font-bold flex items-center justify-between mb-1">
              <span>T+10 min</span>
              {timeStep >= 10 && <Check className="w-3.5 h-3.5 text-red-400" />}
            </div>
            <p className="font-sans text-[11px] opacity-90">
              🚧 Main Road causeway submerged (4.8ft water). Impassable!
            </p>
          </div>

          {/* T+15 */}
          <div className={`p-3 rounded-2xl border transition ${
            timeStep >= 15 ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-gray-950 border-gray-800 text-gray-500'
          }`}>
            <div className="font-bold flex items-center justify-between mb-1">
              <span>T+15 min</span>
              {timeStep >= 15 && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="font-sans text-[11px] opacity-90">
              Shelter 04 reaches 95% capacity overload. Disaster X balances to Shelter 07.
            </p>
          </div>

          {/* T+20 */}
          <div className={`p-3 rounded-2xl border transition ${
            timeStep >= 20 ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 shadow-xl' : 'bg-gray-950 border-gray-800 text-gray-500'
          }`}>
            <div className="font-bold flex items-center justify-between mb-1">
              <span>T+20 min</span>
              {timeStep >= 20 && <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
            </div>
            <p className="font-sans text-[11px] opacity-90">
              Disaster X completes closed-loop adaptation: Citizens safely rerouted.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Performance Comparison Table */}
      <div className="bg-gray-900/95 border-2 border-gray-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold block">
              EVALUATION BENCHMARK MATRIX
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Static Plan vs Disaster X Adaptive Response Performance
            </h3>
          </div>

          {/* Performance Improvement Badge */}
          <div className="bg-gradient-to-r from-blue-950 to-emerald-950 border border-emerald-500/60 px-4 py-2 rounded-2xl font-mono text-xs text-right">
            <span className="text-gray-400 text-[10px] uppercase block">CALCULATED RESILIENCE IMPROVEMENT</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">
              +{metrics.improvementScore} Performance Points ({(metrics.improvementScore / Math.max(1, metrics.staticPlan.performanceScore) * 100).toFixed(0)}% Boost)
            </span>
          </div>
        </div>

        {/* Metrics Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-950 text-gray-400 uppercase text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4 text-red-400">Static Plan (Legacy)</th>
                <th className="py-3 px-4 text-emerald-400">Disaster X (Adaptive Engine)</th>
                <th className="py-3 px-4 text-right">State Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Route Adaptations Triggered</td>
                <td className="py-3.5 px-4 text-red-300">0 (Static failure)</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.adaptivePlan.routeAdaptations} Dynamic Recalculations</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">+100% Adaptive</td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Active Recommended Route</td>
                <td className="py-3.5 px-4 text-red-300 line-through">{metrics.staticPlan.route}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.adaptivePlan.route}</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">Corridor Clear</td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Final Route Safety Risk</td>
                <td className="py-3.5 px-4 text-red-400 font-bold">{metrics.staticPlan.finalRouteRisk}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.adaptivePlan.finalRouteRisk}</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">Zero Submerged Lanes</td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Estimated Evacuation Delay</td>
                <td className="py-3.5 px-4 text-red-400 font-bold">{metrics.staticPlan.evacuationTimeMin} min (Stranded)</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.adaptivePlan.evacuationTimeMin} min (Fluid)</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">-82% Time Saved</td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Shelter Capacity Distribution</td>
                <td className="py-3.5 px-4 text-red-300">{metrics.staticPlan.shelterOverload}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.adaptivePlan.shelterOverload}</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">Load Balanced</td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Citizen Risk Exposure Index</td>
                <td className="py-3.5 px-4 text-red-400 font-bold">{metrics.staticPlan.riskExposureScore} / 100 (Severe)</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.adaptivePlan.riskExposureScore} / 100 (Minimal)</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">-66 pts Risk Reduced</td>
              </tr>

              <tr className="bg-gray-950 font-bold text-sm">
                <td className="py-4 px-4 text-white">Overall Composite Score</td>
                <td className="py-4 px-4 text-red-400">{metrics.staticPlan.performanceScore} / 100</td>
                <td className="py-4 px-4 text-emerald-400">{metrics.adaptivePlan.performanceScore} / 100</td>
                <td className="py-4 px-4 text-right text-emerald-400 font-black">+{metrics.improvementScore} pts</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable AI Decision Breakdown */}
      {timeStep >= 10 && (
        <AIExplanationPanel
          previousRoute="Zone A → Main Road → Shelter 04"
          newRoute="Zone A → East Road → Shelter 07"
          verifiedHazard="Main Road Causeway completely submerged under 4.8ft flood water"
          confidencePercent={94}
          decisionText="High-Elevation Ridge Evacuation Corridor Activated to Prevent Vehicle Stranding"
          reasons={[
            { text: 'Main Road causeway is verified impassable with 4.8ft rapid flood current', type: 'WARNING' },
            { text: 'East Road Ridge bypass provides +18m elevation safety buffer away from river basin', type: 'POSITIVE' },
            { text: 'Shelter 07 is verified open with 650 available beds, power generators, and medical staff', type: 'POSITIVE' },
            { text: 'Slightly longer transit (+4 min), but 100% passable with zero stranding risk', type: 'NEUTRAL' }
          ]}
        />
      )}

    </div>
  );
};
