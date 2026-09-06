import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Volume2, X } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const EmergencyFab: React.FC = () => {
  const { isEmergencyMode, broadcastAlert, store } = useDisasterStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    if (isExpanded && !isEmergencyMode) {
      store.toggleEmergencyMode(true);
      soundEffects.playEmergencyAlert();
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }, [isExpanded, isEmergencyMode, store]);

  const handleSOS = () => {
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
    soundEffects.playEmergencyAlert();
    
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  if (isEmergencyMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1500] flex flex-col items-end gap-3">
      {isExpanded && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-bottom duration-200">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-3 shadow-2xl space-y-2 w-64">
            {broadcastAlert && (
              <div className="p-2 bg-red-950/80 border border-red-800 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ACTIVE ALERT</span>
                </div>
                <p className="text-[11px] text-gray-200 leading-relaxed">{broadcastAlert.message}</p>
                <span className="text-[10px] text-gray-400 font-mono">{broadcastAlert.timestamp}</span>
              </div>
            )}
            
            <button
              onClick={handleSOS}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-red-900/40"
            >
              <Phone className="w-4 h-4" />
              <span>{sosSent ? 'SOS TRANSMITTED!' : '🆘 SEND SOS'}</span>
            </button>

            <button
              onClick={() => {
                store.toggleEmergencyMode(true);
                soundEffects.playEmergencyAlert();
                setIsExpanded(false);
                if (navigator.vibrate) navigator.vibrate(200);
              }}
              className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-gray-600"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>EMERGENCY MODE</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => soundEffects.playEmergencyAlert()}
                className="flex-1 py-2 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition border border-amber-700"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 border-4 border-white ${
          isExpanded 
            ? 'bg-gray-700 rotate-45' 
            : 'bg-red-600 hover:bg-red-500 animate-pulse'
        }`}
        aria-label="Emergency access"
      >
        {isExpanded ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <AlertTriangle className="w-8 h-8 text-white" />
        )}
      </button>
    </div>
  );
};
