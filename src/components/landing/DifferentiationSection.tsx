import React from 'react';
import { 
  Bot, 
  WifiOff, 
  ShieldCheck, 
  Navigation, 
  Users2,
  Sparkles
} from 'lucide-react';

export const DifferentiationSection: React.FC = () => {
  const differentiators = [
    {
      icon: <Bot className="w-6 h-6 text-blue-400" />,
      title: 'AI-Guided Response',
      subtitle: 'Not just passive sirens — instant actionable directives.',
      desc: 'Context-aware response algorithms that immediately synthesize exact steps tailored to user situation and terrain.'
    },
    {
      icon: <WifiOff className="w-6 h-6 text-amber-400" />,
      title: 'Offline First',
      subtitle: 'Guaranteed operation during full grid blackout.',
      desc: 'Built with Service Worker caching and local IndexedDB store. Life-saving safety playbooks and shelter locations remain offline-ready.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Verified Ground Intelligence',
      subtitle: 'Separates rumors from ground truth.',
      desc: 'Explicit visual confidence scoring, authority verification triage, and cryptographic audit hashing prevent panic.'
    },
    {
      icon: <Navigation className="w-6 h-6 text-cyan-400" />,
      title: 'Adaptive Evacuation',
      subtitle: 'Routes dynamically evolve with ground hazards.',
      desc: 'If a causeway submerges or a bridge collapses, the engine recalculates citizen routes away from danger zones.'
    },
    {
      icon: <Users2 className="w-6 h-6 text-indigo-400" />,
      title: 'Citizen + Responder Unity',
      subtitle: 'One synchronized command ecosystem.',
      desc: 'Connects citizen reports directly to field rescue teams and government logistics depots without middleware delays.'
    }
  ];

  return (
    <section className="space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
          CORE INNOVATIONS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Why this is different
        </h2>
        <p className="text-sm text-gray-400">
          Engineered from the ground up for extreme high-stress disaster conditions.
        </p>
      </div>

      {/* Differentiator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {differentiators.map((item, i) => (
          <div
            key={i}
            className="bg-gray-900/90 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 shadow-xl space-y-4 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 w-fit">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs font-semibold text-blue-300 font-mono mt-0.5">{item.subtitle}</p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{item.desc}</p>
            </div>

            <div className="pt-2 border-t border-gray-800/80 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold">
              <span>● Production Standard</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
