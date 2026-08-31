import React from 'react';
import { 
  Radio, 
  Brain, 
  ShieldCheck, 
  Compass, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const PlatformProcess: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Detect',
      desc: 'Ingest multi-source distress signals, IoT flood sensors, satellite telemetry, and citizen mobile reports.',
      icon: <Radio className="w-5 h-5 text-blue-400" />
    },
    {
      num: '02',
      title: 'Understand',
      desc: 'Deterministic AI engines process risk severity, flood elevation polygons, and vulnerable population density.',
      icon: <Brain className="w-5 h-5 text-indigo-400" />
    },
    {
      num: '03',
      title: 'Verify',
      desc: 'Command authorities cross-validate reports, filter false alarms, and assign verified confidence ratings.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />
    },
    {
      num: '04',
      title: 'Guide',
      desc: 'Citizens receive 10-second actionable safety playbooks, offline shelters, and clear evacuation vectors.',
      icon: <Compass className="w-5 h-5 text-emerald-400" />
    },
    {
      num: '05',
      title: 'Adapt',
      desc: 'As roads submerge or shelters fill, evacuation routes and resource dispatch automatically recalculate in real-time.',
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <section className="space-y-8 bg-gray-950/60 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-xl">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold bg-blue-950/60 border border-blue-800/80 px-3 py-1 rounded-full">
          CLOSED-LOOP ARCHITECTURE
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          How the Platform Works
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          From the initial ground telemetry signal to adaptive citizen rerouting.
        </p>
      </div>

      {/* 5-Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-gray-900/90 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 shadow-md space-y-3 relative group transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className="text-2xl font-black font-mono text-gray-600 group-hover:text-blue-400 transition-colors">
                  {step.num}
                </span>
                <div className="p-2 bg-gray-950 rounded-xl border border-gray-800">
                  {step.icon}
                </div>
              </div>

              <h3 className="font-bold text-base text-white mt-2 leading-snug">{step.title}</h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{step.desc}</p>
            </div>

            <div className="pt-2 text-[10px] font-mono text-blue-400/80 uppercase font-semibold">
              Phase {step.num} Active
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
