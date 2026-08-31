import React, { useEffect } from 'react';
import { AlertCircle, Bell, X, Volume2 } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const BroadcastBar: React.FC = () => {
  const { broadcastAlert, isAudioAlertsEnabled, store } = useDisasterStore();

  useEffect(() => {
    if (broadcastAlert && isAudioAlertsEnabled) {
      soundEffects.playEmergencyAlert();
    }
  }, [broadcastAlert, isAudioAlertsEnabled]);

  if (!broadcastAlert) return null;

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="bg-red-950/95 border-b-2 border-red-500 text-white px-4 py-2.5 shadow-lg flex items-center justify-between gap-3 animate-bounce-subtle"
    >
      <div className="flex items-center gap-3">
        <span className="p-1 bg-red-600 rounded-full flex items-center justify-center animate-ping-slow">
          <AlertCircle className="w-5 h-5 text-white" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider bg-red-800 text-red-100 px-1.5 py-0.5 rounded font-mono">
              Emergency Broadcast
            </span>
            <span className="text-xs text-red-300 font-mono">{broadcastAlert.timestamp}</span>
          </div>
          <p className="text-sm font-semibold text-red-50 mt-0.5">{broadcastAlert.message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => soundEffects.playEmergencyAlert()}
          className="p-1.5 bg-red-900/60 hover:bg-red-800 rounded text-red-200 transition"
          title="Play Sound Beacon"
        >
          <Volume2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => store.dismissBroadcastAlert()}
          className="p-1.5 bg-red-900/60 hover:bg-red-800 rounded text-red-200 transition"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
