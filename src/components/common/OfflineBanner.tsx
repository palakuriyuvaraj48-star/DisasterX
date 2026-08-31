import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';

export const OfflineBanner: React.FC = () => {
  const { isOffline, lastSyncedTimestamp, store } = useDisasterStore();

  const handleSimulateToggle = () => {
    store.setState({ isOffline: !isOffline });
  };

  return (
    <div className={`w-full py-1.5 px-4 text-xs font-mono transition-colors flex items-center justify-between border-b ${
      isOffline 
        ? 'bg-amber-950/90 text-amber-200 border-amber-800/80' 
        : 'bg-gray-900/90 text-gray-400 border-gray-800'
    }`}>
      <div className="flex items-center gap-2">
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-bold text-amber-300">📴 OFFLINE MODE ACTIVE</span>
            <span className="hidden md:inline text-amber-300/80">— Serving cached emergency safety guides & shelters.</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-300">Live Telemetry Synchronized</span>
          </>
        )}
        <span className="text-gray-500">|</span>
        <span className="text-gray-400">Last Synced: {lastSyncedTimestamp}</span>
      </div>

      <button
        onClick={handleSimulateToggle}
        className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] border border-gray-700 transition"
        title="Toggle simulated offline state to test zero-connectivity resilience"
      >
        <RefreshCw className="w-3 h-3" />
        <span>{isOffline ? 'Go Online' : 'Simulate Offline'}</span>
      </button>
    </div>
  );
};
