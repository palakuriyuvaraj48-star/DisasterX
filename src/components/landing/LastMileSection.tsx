import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  WifiOff, 
  Users, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

export const LastMileSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-2 border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="max-w-3xl space-y-6 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4 text-blue-400" />
          <span>FIELD-HARDENED RESILIENCE</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
          Built for the last mile of disaster response.
        </h2>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
          Most disaster systems fail at the exact moment they are needed most — when telecom cell towers lose power, roads wash away, and panic floods call centers. 
          DisasterGuard is purpose-built to operate in zero-connectivity and rapidly shifting environments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-gray-300">
          <div className="flex items-center gap-2 bg-gray-950/80 p-3 rounded-xl border border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unreliable Cellular Connectivity</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-950/80 p-3 rounded-xl border border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Rapidly Submerging Roadways</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-950/80 p-3 rounded-xl border border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Simple Citizen Stress Directives</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-950/80 p-3 rounded-xl border border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Responder Telemetry</span>
          </div>
        </div>

      </div>
    </section>
  );
};
