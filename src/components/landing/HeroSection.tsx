import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Navigation, 
  Bot, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Activity, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DemoBadge, OperationalStatusBadge } from '../common/DemoBadge';

interface HeroSectionProps {
  onExploreIntelligence: () => void;
  onOpenAIChat: () => void;
  onOpenReportModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreIntelligence,
  onOpenAIChat,
  onOpenReportModal
}) => {
  const { store } = useDisasterStore();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#070A10] border border-gray-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
      
      {/* Background Subtle Radar Glow */}
      <div className="absolute -right-32 -top-32 w-[480px] h-[480px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-32 -bottom-32 w-[480px] h-[480px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Core Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Eyebrow & Status Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>🚨 AI-POWERED DISASTER RESPONSE</span>
            </div>
            <OperationalStatusBadge />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            When every second matters,{' '}
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
              know what to do next.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
            <strong className="text-white font-bold">Disaster X</strong> is an AI-powered, offline-first disaster response platform connecting citizens, responders and authorities through emergency guidance, verified ground intelligence and adaptive evacuation support.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => store.toggleEmergencyMode(true)}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-xl shadow-red-900/40 flex items-center gap-2.5 transition active:scale-95"
            >
              <span>🆘 Get Emergency Help</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreIntelligence}
              className="px-6 py-3.5 bg-gray-800/90 hover:bg-gray-700 text-gray-200 font-semibold text-sm sm:text-base rounded-xl border border-gray-700 hover:border-gray-600 transition shadow flex items-center gap-2"
            >
              <span>🗺️ Open Response Center</span>
            </button>

            <button
              onClick={onOpenAIChat}
              className="px-4 py-3.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-sm rounded-xl flex items-center gap-2 transition"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Ask Response AI</span>
            </button>
          </div>

          {/* Quick Features Highlight Strip */}
          <div className="pt-4 grid grid-cols-3 gap-3 border-t border-gray-800/80 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>10s Citizen Directives</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Offline-First Resilient</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Adaptive Re-routing</span>
            </div>
          </div>

        </div>

        {/* Right Column: Hero Visual - Live Disaster Intelligence Simulation Widget */}
        <div className="lg:col-span-5">
          <div className="bg-gray-900/95 border-2 border-gray-700/80 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-md">
            
            {/* Widget Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">
                  LIVE SITUATION TELEMETRY
                </span>
              </div>
              <DemoBadge />
            </div>

            {/* Tactical Status Cards */}
            <div className="space-y-2.5 font-mono">
              
              <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-semibold">CURRENT INCIDENT</span>
                  <span className="text-sm font-bold text-red-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>Flood Risk — High</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase block font-semibold">AFFECTED AREA</span>
                  <span className="text-sm font-bold text-white">12 Zones</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-950/80 p-2.5 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase block">Verified Incidents</span>
                  <span className="text-lg font-black text-emerald-400">38</span>
                </div>
                <div className="bg-gray-950/80 p-2.5 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase block">Pending Triage</span>
                  <span className="text-lg font-black text-amber-400">4</span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="bg-gradient-to-r from-blue-950/70 to-indigo-950/70 p-3.5 rounded-xl border border-blue-600/50 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-blue-300 font-bold">
                  <span>RECOMMENDED ACTION:</span>
                  <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700 text-[10px]">
                    VERIFIED SAFE
                  </span>
                </div>
                <p className="text-xs font-bold text-white font-sans">
                  Evacuate Zone A → Main Road → Shelter 04
                </p>
                <div className="text-[11px] text-gray-300 font-sans flex items-center justify-between pt-1">
                  <span>Est. Distance: <strong>2.4 km</strong></span>
                  <span>Estimated Time: <strong>18 mins</strong></span>
                </div>
              </div>

            </div>

            {/* Quick Interactive Trigger in Hero */}
            <div className="pt-1 flex gap-2">
              <button
                onClick={onExploreIntelligence}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition shadow flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Launch Tactical Map</span>
              </button>

              <button
                onClick={onOpenReportModal}
                className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700 transition"
                title="Report Ground Incident"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
