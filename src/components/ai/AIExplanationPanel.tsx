import React from 'react';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  TrendingDown,
  Navigation,
  Home
} from 'lucide-react';

interface AIExplanationPanelProps {
  previousRoute?: string;
  newRoute?: string;
  verifiedHazard?: string;
  confidencePercent?: number;
  decisionText?: string;
  reasons?: { text: string; type: 'POSITIVE' | 'NEUTRAL' | 'WARNING' }[];
}

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({
  previousRoute = 'Zone A → Main Road → Shelter 04',
  newRoute = 'Zone A → East Road → Shelter 07',
  verifiedHazard = 'Main Road Causeway submerged under 4.8ft flood surge',
  confidencePercent = 88,
  decisionText = 'Dynamic Evacuation Vector Shift to Shelter 07 via Ridge Bypass',
  reasons = [
    { text: 'Lower flood water exposure (elevation +18m above sea level)', type: 'POSITIVE' },
    { text: 'Verified accessible arterial corridor (Ridge Highway clear)', type: 'POSITIVE' },
    { text: 'Shelter 07 capacity available (34% occupancy, medical ward active)', type: 'POSITIVE' },
    { text: 'Longer travel distance (+400m / +4 minutes travel time)', type: 'NEUTRAL' }
  ]
}) => {
  return (
    <div className="bg-gray-950 border-2 border-blue-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              🤖 EXPLAINABLE AI DECISION LAYER
            </h3>
            <p className="text-[11px] text-gray-400">Deterministic Multi-Constraint Optimization</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Confidence: {confidencePercent}%</span>
        </div>
      </div>

      {/* Decision Summary */}
      <div className="bg-gray-900/90 p-3.5 rounded-2xl border border-gray-800 space-y-1.5 font-sans">
        <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">Optimized Action Directive</span>
        <h4 className="font-bold text-sm sm:text-base text-white">{decisionText}</h4>
      </div>

      {/* Route Transformation Diff */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-red-950/30 p-3 rounded-xl border border-red-900/40 space-y-1">
          <span className="text-[10px] text-red-400 uppercase font-bold block">Previous Recommendation (Compromised)</span>
          <p className="text-gray-300 line-through font-mono">{previousRoute}</p>
          <span className="text-[10px] text-red-400 block pt-0.5">↳ Hazard: {verifiedHazard}</span>
        </div>

        <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/60 space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase font-bold block">New Recommendation (Verified Safe)</span>
          <p className="text-emerald-200 font-bold font-mono">{newRoute}</p>
          <span className="text-[10px] text-emerald-400 block pt-0.5">↳ Evaluated via High-Ground Ridge Corridor</span>
        </div>
      </div>

      {/* Transparent Reasons Grid */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-mono uppercase text-gray-400 font-bold block">
          Why did we change your route? (Weighted Decision Factors):
        </span>

        <div className="space-y-1.5 text-xs">
          {reasons.map((r, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 font-sans ${
                r.type === 'POSITIVE'
                  ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-100'
                  : r.type === 'WARNING'
                  ? 'bg-red-950/20 border-red-800/50 text-red-200'
                  : 'bg-gray-900/60 border-gray-800 text-gray-300'
              }`}
            >
              <span className="shrink-0 text-sm">
                {r.type === 'POSITIVE' ? '🟢' : r.type === 'WARNING' ? '🔴' : '🟡'}
              </span>
              <span className="font-medium text-xs">{r.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
