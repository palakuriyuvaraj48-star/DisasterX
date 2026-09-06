import React from 'react';
import { Home, MapPin, AlertTriangle, Bot, User, Siren } from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

interface BottomNavProps {
  activeTab: 'HOME' | 'MAP' | 'ALERTS' | 'AI' | 'PROFILE';
  onTabChange: (tab: 'HOME' | 'MAP' | 'ALERTS' | 'AI' | 'PROFILE') => void;
  onOpenEmergency: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onOpenEmergency }) => {
  const { broadcastAlert } = useDisasterStore();
  const hasCriticalAlert = broadcastAlert?.type === 'CRITICAL';

  const tabs = [
    { id: 'HOME' as const, label: 'Home', icon: Home },
    { id: 'MAP' as const, label: 'Map', icon: MapPin },
    { id: 'ALERTS' as const, label: 'Alerts', icon: AlertTriangle, badge: hasCriticalAlert ? 1 : 0 },
    { id: 'AI' as const, label: 'AI', icon: Bot },
    { id: 'PROFILE' as const, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Emergency FAB overlaps bottom nav */}
      <div className="fixed bottom-6 right-6 z-[1600]">
        <button
          onClick={onOpenEmergency}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl border-4 border-white transition active:scale-90 animate-pulse"
          aria-label="Emergency mode"
        >
          <Siren className="w-7 h-7" />
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-[1500] bg-gray-950/95 backdrop-blur-md border-t border-gray-800 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playVerificationBlip();
                  onTabChange(tab.id);
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition min-w-[64px] ${
                  isActive
                    ? 'text-blue-400 bg-blue-950/50'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
