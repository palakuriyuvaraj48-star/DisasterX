import React from 'react';
import { AlertTriangle, X, Navigation, MapPin, Clock } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const AlertsScreen: React.FC = () => {
  const { broadcastAlert, incidents, store } = useDisasterStore();

  const criticalAlerts = incidents
    .filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH')
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

  const warningAlerts = incidents
    .filter(i => i.severity === 'MODERATE' || i.severity === 'LOW')
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Active Alerts & Notifications
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Sorted by severity and proximity. Always check before traveling.
        </p>
      </div>

      {/* Broadcast Alert */}
      {broadcastAlert && (
        <div className={`p-4 rounded-2xl border-2 shadow-2xl ${
          broadcastAlert.type === 'CRITICAL' 
            ? 'bg-red-950/90 border-red-500 animate-pulse' 
            : 'bg-amber-950/80 border-amber-600'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${broadcastAlert.type === 'CRITICAL' ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
              <div>
                <div className={`text-xs font-mono uppercase font-bold mb-1 ${
                  broadcastAlert.type === 'CRITICAL' ? 'text-red-300' : 'text-amber-300'
                }`}>
                  {broadcastAlert.type} ALERT
                </div>
                <p className="text-sm font-bold text-white">{broadcastAlert.message}</p>
                <div className="flex items-center gap-1 text-[11px] text-gray-300 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{broadcastAlert.timestamp}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => store.dismissBroadcastAlert()}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Critical & High Incidents */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-red-400 font-mono uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Critical & High Priority ({criticalAlerts.length})
        </h3>
        {criticalAlerts.length === 0 ? (
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-xs text-gray-400 text-center">
            No critical alerts in your area. Stay prepared.
          </div>
        ) : (
          <div className="space-y-2">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-4 shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        alert.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(alert.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      {alert.locationName}
                    </p>
                    <p className="text-xs text-gray-300 mt-1.5 line-clamp-2">{alert.description}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        store.setSelectedMapItem({ type: 'INCIDENT', id: alert.id });
                        soundEffects.playVerificationBlip();
                      }}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                      title="View on map"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderate & Low Incidents */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Moderate & Low ({warningAlerts.length})
        </h3>
        {warningAlerts.length === 0 ? (
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-xs text-gray-400 text-center">
            No moderate alerts.
          </div>
        ) : (
          <div className="space-y-2">
            {warningAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-xl p-3 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        alert.severity === 'MODERATE' ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(alert.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                    <p className="text-xs text-gray-400">{alert.locationName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
