import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Navigation, 
  Home, 
  MapPin, 
  Phone,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DISASTER_GUIDES } from '../../data/disasterGuides';
import { DisasterType } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';

interface DisasterPlaybookProps {
  onNavigateToMap: () => void;
  onNavigateToShelters: () => void;
  onOpenReportModal: () => void;
}

export const DisasterPlaybook: React.FC<DisasterPlaybookProps> = ({
  onNavigateToMap,
  onNavigateToShelters,
  onOpenReportModal
}) => {
  const { selectedDisaster, store } = useDisasterStore();
  const [activeType, setActiveType] = useState<DisasterType>(selectedDisaster || 'FLOOD');

  const guide = DISASTER_GUIDES[activeType] || DISASTER_GUIDES.FLOOD;

  const handleSelect = (type: DisasterType) => {
    setActiveType(type);
    store.setSelectedDisaster(type);
    soundEffects.playVerificationBlip();
  };

  const disasterOptions: { type: DisasterType; label: string; emoji: string; desc: string }[] = [
    { type: 'FLOOD', label: 'Flood / Waterlogging', emoji: '🌊', desc: 'Rising water, flash surge' },
    { type: 'FIRE', label: 'Structure / Wildfire', emoji: '🔥', desc: 'Dense smoke, active blaze' },
    { type: 'EARTHQUAKE', label: 'Earthquake / Tremor', emoji: '🌎', desc: 'Ground shaking, building cracks' },
    { type: 'CYCLONE', label: 'Cyclone / High Storm', emoji: '🌪️', desc: 'Gale winds, storm surge' },
    { type: 'LANDSLIDE', label: 'Landslide / Mudflow', emoji: '⛰️', desc: 'Slope failure, road block' },
    { type: 'CHEMICAL', label: 'Gas Leak / Hazmat', emoji: '⚠️', desc: 'Toxic fumes, chemical spill' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Question */}
      <div className="text-center sm:text-left space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <span>Are you in an emergency?</span>
          <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-mono">
            RAPID TRIAGE
          </span>
        </h2>
        <p className="text-sm text-gray-400">
          Select your disaster type below to get immediate 10-second life-safety directives.
        </p>
      </div>

      {/* 2. Large Disaster Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {disasterOptions.map((opt) => {
          const isSelected = activeType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => handleSelect(opt.type)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-950/50 scale-[1.02]'
                  : 'bg-gray-900/80 border-gray-800 hover:border-gray-700 hover:bg-gray-800/80'
              }`}
            >
              <div className="text-3xl mb-2">{opt.emoji}</div>
              <div>
                <div className={`font-bold text-sm leading-snug ${isSelected ? 'text-blue-300' : 'text-gray-200'}`}>
                  {opt.label}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Actionable Instruction Card */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-gray-800 rounded-xl border border-gray-700">
              {guide.emoji}
            </span>
            <div>
              <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">
                Official NDMA / FEMA Protocol
              </span>
              <h3 className="text-xl font-extrabold text-white">{guide.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => store.toggleEmergencyMode(true)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition shadow"
            >
              🚨 Open in Emergency Mode
            </button>
          </div>
        </div>

        {/* What Should I Do Right Now? */}
        <div>
          <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>What should I do right now?</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.immediateActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/80">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What to Avoid */}
        <div>
          <h4 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-amber-400" />
            <span>Critical Hazards to Avoid</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {guide.whatToAvoid.map((avoid, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg text-xs text-red-200">
                <span className="text-red-400 font-bold">⛔</span>
                <span>{avoid}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onNavigateToMap}
            className="py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/30"
          >
            <Navigation className="w-4 h-4" />
            <span>🗺️ Find Safe Route</span>
          </button>

          <button
            onClick={onNavigateToShelters}
            className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30"
          >
            <Home className="w-4 h-4" />
            <span>🏠 Find Shelter</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="py-3 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-900/30"
          >
            <MapPin className="w-4 h-4" />
            <span>📍 Report Incident</span>
          </button>

          <a
            href="tel:112"
            className="py-3 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/30"
          >
            <Phone className="w-4 h-4" />
            <span>🆘 Emergency Help</span>
          </a>
        </div>

      </div>

    </div>
  );
};
