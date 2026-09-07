import React from 'react';
import { AlertTriangle, ShieldCheck, MapPin, Cloud, Wind, Droplet } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';

export const HomeSafetyStatus: React.FC = () => {
  const { incidents, broadcastAlert, isOffline } = useDisasterStore();

  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const nearbyCritical = safeIncidents.filter(i => i.severity === 'CRITICAL' && i.verificationStatus === 'VERIFIED');
  const nearbyHigh = safeIncidents.filter(i => i.severity === 'HIGH');
  const hasBlockedRoads = safeIncidents.some(i => i.isHazardBlocked);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let recommendation = 'Safe to proceed with normal activities';
  let bgColor = 'bg-emerald-950/80 border-emerald-700';
  let textColor = 'text-emerald-300';
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (nearbyCritical.length > 0) {
    riskLevel = 'CRITICAL';
    recommendation = 'Evacuate immediately to nearest shelter. Avoid all main roads.';
    bgColor = 'bg-red-950/90 border-red-600';
    textColor = 'text-red-300';
    icon = <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />;
  } else if (nearbyHigh.length > 0 || hasBlockedRoads) {
    riskLevel = 'HIGH';
    recommendation = 'Stay alert. Avoid reported hazard zones. Keep emergency kit ready.';
    bgColor = 'bg-amber-950/90 border-amber-600';
    textColor = 'text-amber-300';
    icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
  } else if (incidents.length > 0) {
    riskLevel = 'MEDIUM';
    recommendation = 'Monitor alerts. Some incidents reported in your district.';
    bgColor = 'bg-yellow-950/80 border-yellow-700';
    textColor = 'text-yellow-300';
    icon = <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  }

  return (
    <div className={`p-4 rounded-2xl border-2 shadow-xl ${bgColor} transition-all`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {icon}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono uppercase font-bold ${textColor}`}>
                Zone Risk Level
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' :
                riskLevel === 'HIGH' ? 'bg-amber-600 text-white' :
                riskLevel === 'MEDIUM' ? 'bg-yellow-600 text-white' :
                'bg-emerald-600 text-white'
              }`}>
                {riskLevel}
              </span>
            </div>
            <p className="text-sm font-bold text-white">{recommendation}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-300 font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {safeIncidents.length} active incidents nearby
              </span>
              {isOffline && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Cloud className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {broadcastAlert && (
        <div className="mt-3 p-2.5 bg-gray-950/80 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-200 font-medium">{broadcastAlert.message}</p>
          <span className="text-[10px] text-gray-400 font-mono">{broadcastAlert.timestamp}</span>
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-950/60 rounded-lg p-2 border border-gray-800">
          <Droplet className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-[10px] text-gray-400">Rainfall</div>
          <div className="text-xs font-bold text-white">125mm/hr</div>
        </div>
        <div className="bg-gray-950/60 rounded-lg p-2 border border-gray-800">
          <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <div className="text-[10px] text-gray-400">Wind</div>
          <div className="text-xs font-bold text-white">45km/h</div>
        </div>
        <div className="bg-gray-950/60 rounded-lg p-2 border border-gray-800">
          <Cloud className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <div className="text-[10px] text-gray-400">Status</div>
          <div className={`text-xs font-bold ${isOffline ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isOffline ? 'Offline' : 'Live'}
          </div>
        </div>
      </div>
    </div>
  );
};
