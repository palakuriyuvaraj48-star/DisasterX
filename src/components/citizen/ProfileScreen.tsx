import React from 'react';
import { User, Bell, Shield, Volume2, Eye, Moon, LogOut } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const ProfileScreen: React.FC = () => {
  const { isHighContrast, isAudioAlertsEnabled, store } = useDisasterStore();

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" />
          Profile & Settings
        </h2>
        <p className="text-xs text-gray-400 mt-1">Manage your preferences and emergency contacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Accessibility</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-200">High Contrast Mode</span>
            </div>
            <button
              onClick={() => {
                store.toggleHighContrast();
                soundEffects.playVerificationBlip();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isHighContrast ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300 border border-gray-700'
              }`}
            >
              {isHighContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-200">Audio Alerts</span>
            </div>
            <button
              onClick={() => {
                store.toggleAudioAlerts();
                soundEffects.playVerificationBlip();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isAudioAlertsEnabled ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'
              }`}
            >
              {isAudioAlertsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Emergency Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-200">Push Notifications</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">ENABLED</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-200">Location Sharing</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-200">Offline Mode</span>
            </div>
            <span className="text-xs text-gray-400 font-mono font-bold">AUTO</span>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-lg space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Account</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Citizen User</p>
              <p className="text-xs text-gray-400">user@disaster-x.in</p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
