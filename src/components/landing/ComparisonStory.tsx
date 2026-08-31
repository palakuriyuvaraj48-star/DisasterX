import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export const ComparisonStory: React.FC = () => {
  return (
    <section className="space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-800/80 px-3 py-1 rounded-full">
          THE SYSTEM TRANSFORMATION
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          From Information Overload to Actionable Decisions
        </h2>
        <p className="text-sm text-gray-400">
          Comparing the legacy manual alert cycle against DisasterGuard's adaptive closed-loop intelligence.
        </p>
      </div>

      {/* Side-by-side Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Traditional Response */}
        <div className="bg-red-950/20 border-2 border-red-900/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-red-900/40">
            <span className="p-2.5 bg-red-950 rounded-xl border border-red-800 text-red-400">
              <AlertOctagon className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Traditional Legacy Response</h3>
              <p className="text-xs text-red-300/80 font-mono">Slow • Fragmented • Static</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-mono">
            <div className="flex items-start gap-3 bg-red-950/30 p-3 rounded-xl border border-red-900/30">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Fragmented Information:</strong>
                Scattered across news, local radio, unverified tweets, and messaging apps.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-red-950/30 p-3 rounded-xl border border-red-900/30">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Conflicting Reports & Rumors:</strong>
                Panicked citizens flood call centers with conflicting claims, causing panic.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-red-950/30 p-3 rounded-xl border border-red-900/30">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Static Evacuation Warnings:</strong>
                Citizens are told "Evacuate North" even when northern highways are washed out.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-red-950/30 p-3 rounded-xl border border-red-900/30">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Delayed Resource Dispatch:</strong>
                Medical and food supplies sent to wrong sectors without real-time inventory tracking.
              </div>
            </div>
          </div>
        </div>

        {/* Our System */}
        <div className="bg-emerald-950/20 border-2 border-emerald-600/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/40">
            <span className="p-2.5 bg-emerald-950 rounded-xl border border-emerald-700 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">DisasterGuard Adaptive System</h3>
              <p className="text-xs text-emerald-300 font-mono">Offline-First • AI Verified • Real-Time Adaptive</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-mono">
            <div className="flex items-start gap-3 bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Unified Ground Telemetry:</strong>
                Aggregates IoT flood sensors, satellite feeds, citizen reports, and emergency dispatch.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Authority Verification Engine:</strong>
                Transparent trust scores, rapid triage, and tamper-evident cryptographic audit log.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Dynamic Adaptive Evacuation:</strong>
                Live elevation routing that automatically redirects citizens when hazard roads submerge.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Offline-First Local Cache:</strong>
                100% functional safety instructions and emergency shelter maps even when cell towers fail.
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
