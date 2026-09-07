import React from 'react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DataFreshnessIndicator } from '../common/DataFreshnessIndicator';
import { Cloud, Database, Wifi, WifiOff, Clock, Globe, Satellite } from 'lucide-react';

export const DataIntelligence: React.FC = () => {
  const { isOffline, lastSyncedTimestamp } = useDisasterStore();

  const sources = [
    { name: 'Weather / IMD', status: isOffline ? 'CACHED' : 'LIVE', icon: Cloud, color: 'text-blue-400' },
    { name: 'Satellite / Sentinel', status: 'SIMULATED', icon: Satellite, color: 'text-purple-400' },
    { name: 'Local Storage', status: 'CACHED', icon: Database, color: 'text-emerald-400' },
    { name: 'Network', status: isOffline ? 'OFFLINE' : 'ONLINE', icon: isOffline ? WifiOff : Wifi, color: isOffline ? 'text-amber-400' : 'text-emerald-400' },
    { name: 'Map Tiles', status: 'CACHED', icon: Globe, color: 'text-cyan-400' },
    { name: 'Last Sync', status: lastSyncedTimestamp, icon: Clock, color: 'text-gray-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <Globe className="w-6 h-6 text-cyan-400" />
          Data Intelligence
        </h2>
        <p className="text-xs text-gray-400 mt-1">Data sources, freshness, and integration status.</p>
      </div>

      <DataFreshnessIndicator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <div key={source.name} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 shadow-lg space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${source.color}`} />
                <span className="text-sm font-bold text-white">{source.name}</span>
              </div>
              <span className={`text-xs font-mono font-bold ${source.color}`}>{source.status}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl text-xs text-amber-200">
        <span className="font-bold">Demo Environment: </span>
        Some integrations use simulated data for SIH demonstration. Live API keys can be added in production.
      </div>
    </div>
  );
};
