import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock, Database, Cloud } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';

export const DataFreshnessIndicator: React.FC = () => {
  const { isOffline, lastSyncedTimestamp } = useDisasterStore();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full py-2 px-4 text-xs font-mono transition-colors flex items-center justify-between border-b ${
      isOffline 
        ? 'bg-amber-950/90 text-amber-200 border-amber-800/80' 
        : 'bg-gray-900/90 text-gray-400 border-gray-800'
    }`}>
      <div className="flex items-center gap-3">
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-bold text-amber-300">OFFLINE MODE</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">LIVE DATA</span>
          </>
        )}
        <span className="text-gray-500">|</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Updated: {lastSyncedTimestamp}</span>
        </span>
        <span className="text-gray-500">|</span>
        <span className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          <span>Cached: Offline-ready</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500">Now: {currentTime}</span>
        {isOffline ? (
          <Cloud className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Cloud className="w-3.5 h-3.5 text-emerald-400" />
        )}
      </div>
    </div>
  );
};
