import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Navigation, 
  Home, 
  PhoneCall, 
  AlertTriangle, 
  Volume2, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DISASTER_GUIDES } from '../../data/disasterGuides';
import { DisasterType } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';

export const EmergencyMode: React.FC = () => {
  const { 
    selectedDisaster, 
    shelters, 
    evacuationRoutes, 
    activeEvacuationRouteId, 
    store 
  } = useDisasterStore();

  const [activeDisaster, setActiveDisaster] = useState<DisasterType>(selectedDisaster || 'FLOOD');
  const guide = DISASTER_GUIDES[activeDisaster] || DISASTER_GUIDES.FLOOD;
  const nearestOpenShelter = shelters.find(s => s.status === 'OPEN') || shelters[0];
  const activeRoute = evacuationRoutes.find(r => r.id === activeEvacuationRouteId) || evacuationRoutes[1];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 font-sans select-none pb-20">
      
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b-4 border-red-600 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-600 rounded-lg animate-pulse">
              <AlertOctagon className="w-8 h-8 text-white" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-red-500 font-mono">
                🚨 EMERGENCY ACTIVE MODE
              </h1>
              <p className="text-xs sm:text-sm text-yellow-300 font-bold">
                Distraction-Free Directives • Offline Resilient • Instant Help
              </p>
            </div>
          </div>

          <button
            onClick={() => store.toggleEmergencyMode(false)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm rounded-lg border-2 border-gray-600 transition"
          >
            ✕ Exit SOS
          </button>
        </div>

        {/* Quick Disaster Selector in Emergency Mode */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-yellow-300 font-bold tracking-wider">
            1. Select Your Current Emergency Type:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(['FLOOD', 'FIRE', 'EARTHQUAKE', 'CYCLONE', 'LANDSLIDE', 'CHEMICAL'] as DisasterType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setActiveDisaster(type);
                  soundEffects.playVerificationBlip();
                }}
                className={`py-3 px-2 rounded-xl text-center font-bold text-sm sm:text-base border-2 transition ${
                  activeDisaster === type
                    ? 'bg-red-600 text-white border-white shadow-xl scale-105'
                    : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="text-xl sm:text-2xl mb-1">{DISASTER_GUIDES[type]?.emoji}</div>
                <div className="text-xs">{type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 5 CORE EMERGENCY DIRECTIVES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: 🚨 WHAT HAPPENED */}
          <div className="bg-gray-950 border-4 border-red-600 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-lg font-black uppercase font-mono tracking-wider">
                🚨 WHAT HAPPENED
              </h2>
            </div>
            <p className="text-xl font-bold text-white leading-tight">
              {guide.title}
            </p>
            <p className="text-sm text-yellow-200 mt-2 font-medium">
              {guide.brief}
            </p>
          </div>

          {/* Card 2: 🛡️ WHAT TO DO RIGHT NOW */}
          <div className="bg-gray-950 border-4 border-emerald-500 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <CheckCircle className="w-6 h-6" />
              <h2 className="text-lg font-black uppercase font-mono tracking-wider">
                🛡️ WHAT TO DO RIGHT NOW
              </h2>
            </div>
            <ul className="space-y-2 mt-1">
              {guide.immediateActions.slice(0, 3).map((act, idx) => (
                <li key={idx} className="text-sm font-bold text-white flex items-start gap-2 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800">
                  <span className="bg-emerald-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: 🗺️ WHERE TO GO (Adaptive Safe Route) */}
          <div className="bg-gray-950 border-4 border-blue-500 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Navigation className="w-6 h-6" />
                <h2 className="text-lg font-black uppercase font-mono tracking-wider">
                  🗺️ WHERE TO GO
                </h2>
              </div>
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-xs font-bold rounded">
                SAFE
              </span>
            </div>

            <div className="bg-blue-950/40 border border-blue-800 p-3 rounded-xl space-y-1">
              <div className="text-sm font-bold text-white">Recommended Shelter:</div>
              <div className="text-base font-black text-blue-300">{nearestOpenShelter.name}</div>
              <div className="text-xs text-yellow-300 font-mono">
                📍 {nearestOpenShelter.locationName} (~{nearestOpenShelter.distanceKm} km away)
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-300 bg-gray-900 p-2.5 rounded-lg font-mono">
              <span className="text-blue-400 font-bold">ROUTE: </span>
              {activeRoute.pathDescription}
            </div>
          </div>

          {/* Card 4: ⚠️ WHAT TO AVOID */}
          <div className="bg-gray-950 border-4 border-yellow-500 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <XCircle className="w-6 h-6" />
              <h2 className="text-lg font-black uppercase font-mono tracking-wider">
                ⚠️ WHAT TO AVOID
              </h2>
            </div>
            <ul className="space-y-2 mt-1">
              {guide.whatToAvoid.slice(0, 3).map((avoid, idx) => (
                <li key={idx} className="text-sm font-bold text-yellow-100 flex items-start gap-2 bg-yellow-950/40 p-2 rounded-lg border border-yellow-800">
                  <span className="text-red-400 font-black shrink-0">⛔</span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 5: 🆘 GET IMMEDIATE HELP - GIANT TOUCH BUTTONS */}
        <div className="bg-red-950/80 border-4 border-red-500 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-white">
            <PhoneCall className="w-8 h-8 text-yellow-400 animate-bounce" />
            <h2 className="text-2xl font-black uppercase font-mono tracking-wider">
              🆘 GET IMMEDIATE HELP (ONE-TOUCH DIAL)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="tel:112"
              className="py-4 px-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-center text-lg border-2 border-white shadow-xl flex flex-col items-center justify-center transition active:scale-95"
            >
              <span className="text-2xl font-mono">📞 112</span>
              <span className="text-xs uppercase font-bold text-yellow-200 mt-0.5">National Emergency</span>
            </a>

            <a
              href="tel:108"
              className="py-4 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-center text-lg border-2 border-white shadow-xl flex flex-col items-center justify-center transition active:scale-95"
            >
              <span className="text-2xl font-mono">🚑 108</span>
              <span className="text-xs uppercase font-bold text-emerald-100 mt-0.5">Ambulance & Medical</span>
            </a>

            <a
              href="tel:101"
              className="py-4 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-center text-lg border-2 border-white shadow-xl flex flex-col items-center justify-center transition active:scale-95"
            >
              <span className="text-2xl font-mono">🚒 101</span>
              <span className="text-xs uppercase font-bold text-amber-100 mt-0.5">Fire & Rescue</span>
            </a>

            <a
              href="tel:1078"
              className="py-4 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-center text-lg border-2 border-white shadow-xl flex flex-col items-center justify-center transition active:scale-95"
            >
              <span className="text-2xl font-mono">🛡️ 1078</span>
              <span className="text-xs uppercase font-bold text-blue-100 mt-0.5">NDRF Disaster Force</span>
            </a>
          </div>
        </div>

        {/* Audio Siren Beacon Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => soundEffects.playEmergencyAlert()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base rounded-full shadow-2xl transition active:scale-95 font-mono"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span>SOUND AUDIBLE SOS BEACON (PRESS TO ALERT NEARBY RESCUERS)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
