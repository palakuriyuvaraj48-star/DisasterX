import React from 'react';
import { WifiOff, Home, Phone, ShieldCheck, AlertTriangle } from 'lucide-react';

export const OfflinePage: React.FC = () => {

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <WifiOff className="w-6 h-6 text-amber-400" />
          Offline Emergency Center
        </h2>
        <p className="text-xs text-gray-400 mt-1">Cached information available without network.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 shadow-lg space-y-2">
          <Home className="w-5 h-5 text-emerald-400" />
          <div className="text-sm font-bold text-white">Shelters</div>
          <div className="text-xs text-gray-400">Cached shelter list with capacity</div>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 shadow-lg space-y-2">
          <Phone className="w-5 h-5 text-blue-400" />
          <div className="text-sm font-bold text-white">Emergency Contacts</div>
          <div className="text-xs text-gray-400">112, 108, 1078, 1070</div>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 shadow-lg space-y-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-sm font-bold text-white">Safety Guides</div>
          <div className="text-xs text-gray-400">Offline-ready emergency protocols</div>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 shadow-lg space-y-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div className="text-sm font-bold text-white">Last Alerts</div>
          <div className="text-xs text-gray-400">Most recent cached broadcast</div>
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl text-xs text-amber-200">
        <span className="font-bold">Offline Mode: </span>
        Live map updates and SMS alerts require network. Core emergency guidance remains available.
      </div>
    </div>
  );
};
