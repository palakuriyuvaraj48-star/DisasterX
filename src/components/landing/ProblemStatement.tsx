import React from 'react';
import { 
  Split, 
  WifiOff, 
  Activity, 
  Clock, 
  ArrowDown, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const ProblemStatement: React.FC = () => {
  const problems = [
    {
      icon: <Split className="w-6 h-6 text-red-400" />,
      title: 'Fragmented Information',
      desc: 'Emergency information is scattered across TV, social feeds, radio broadcasts, and rumors, creating fatal confusion.'
    },
    {
      icon: <WifiOff className="w-6 h-6 text-amber-400" />,
      title: 'Unreliable Connectivity',
      desc: 'Cellular towers and power grids frequently collapse. Critical instructions fail to reach citizens in damaged sectors.'
    },
    {
      icon: <Activity className="w-6 h-6 text-yellow-400" />,
      title: 'Changing Ground Conditions',
      desc: 'Roadways flood, bridges fracture, and shelters reach capacity in minutes. Static evacuation maps become death traps.'
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: 'Delayed Response',
      desc: 'Responders waste golden hours verifying duplicate or false alarms without unified triage and spatial coordinates.'
    }
  ];

  return (
    <section className="space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold bg-red-950/60 border border-red-800/80 px-3 py-1 rounded-full">
          THE REALITY OF CRISIS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Disasters don't wait for perfect information.
        </h2>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          During catastrophic events, the breakdown of communication infrastructure and reliance on unverified rumors puts millions of lives at risk.
        </p>
      </div>

      {/* 4 Problems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {problems.map((prob, i) => (
          <div
            key={i}
            className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 shadow-lg space-y-3 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 w-fit group-hover:scale-105 transition-transform">
                {prob.icon}
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{prob.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{prob.desc}</p>
            </div>

            <div className="pt-2 border-t border-gray-800/60 flex items-center gap-1.5 text-[11px] font-mono text-red-400/90 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>High Risk Factor</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Transition */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-950/80 border border-blue-600/50 text-blue-300 text-xs sm:text-sm font-bold font-mono shadow-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Our platform connects the missing pieces.</span>
        </div>
      </div>

    </section>
  );
};
