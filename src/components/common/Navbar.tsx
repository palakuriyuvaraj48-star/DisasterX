import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  RotateCcw, 
  User, 
  Ambulance, 
  Building2, 
  Zap,
  MapPin
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { UserRole } from '../../types/disaster';
import { DemoBadge, OperationalStatusBadge } from './DemoBadge';

interface NavbarProps {
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReportModal }) => {
  const { 
    currentRole, 
    isEmergencyMode, 
    isHighContrast, 
    isAudioAlertsEnabled, 
    store 
  } = useDisasterStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    store.setRole(role);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => store.setRole('CITIZEN')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/30 border border-red-500/30">
                <ShieldAlert className="w-6 h-6 text-white animate-pulse-fast" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                    DISASTER<span className="text-red-500">GUARD</span>
                  </span>
                  <span className="text-[10px] bg-red-950 text-red-400 font-mono px-1.5 py-0.2 rounded border border-red-800">AI</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium hidden sm:block">Adaptive Disaster Intelligence Platform</p>
              </div>
            </button>

            <div className="hidden lg:block ml-2">
              <OperationalStatusBadge />
            </div>
          </div>

          {/* Desktop Role Switcher Bar */}
          <div className="hidden md:flex items-center bg-gray-900/90 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => handleRoleChange('CITIZEN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                currentRole === 'CITIZEN'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => handleRoleChange('RESPONDER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                currentRole === 'RESPONDER'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <Ambulance className="w-3.5 h-3.5" />
              <span>Field Responder</span>
            </button>

            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                currentRole === 'ADMIN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </button>
          </div>

          {/* Action Tools & Toggles */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Citizen Report Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg border border-gray-700 transition shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Incident</span>
            </button>

            {/* Accessibility High-Contrast Button */}
            <button
              onClick={() => store.toggleHighContrast()}
              className={`p-2 rounded-lg text-xs font-medium border transition ${
                isHighContrast 
                  ? 'bg-yellow-400 text-black border-yellow-300 font-bold' 
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border-gray-800'
              }`}
              title="Toggle High Contrast Accessibility Mode (WCAG AAA)"
              aria-label="High contrast mode"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => store.toggleAudioAlerts()}
              className={`p-2 rounded-lg text-xs border transition ${
                isAudioAlertsEnabled 
                  ? 'bg-gray-900 hover:bg-gray-800 text-blue-400 border-gray-800' 
                  : 'bg-gray-900 text-gray-600 border-gray-800'
              }`}
              title={isAudioAlertsEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
              aria-label="Audio alerts"
            >
              {isAudioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset State Button */}
            <button
              onClick={() => {
                if (confirm('Reset application to original demo state?')) {
                  store.resetToDemoDefaults();
                }
              }}
              className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-200 rounded-lg border border-gray-800 transition"
              title="Reset Demo Data"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dedicated Emergency Mode Toggle */}
            <button
              onClick={() => store.toggleEmergencyMode()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide transition shadow-lg ${
                isEmergencyMode
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border border-red-400'
                  : 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-red-400 fill-current" />
              <span>{isEmergencyMode ? '🚨 EXIT EMERGENCY MODE' : '🚨 EMERGENCY MODE'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => store.toggleEmergencyMode()}
              className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-bold font-mono"
            >
              {isEmergencyMode ? 'EXIT' : '🚨 SOS'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-800 px-4 py-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <DemoBadge />
            <OperationalStatusBadge />
          </div>

          <div>
            <label className="text-[11px] uppercase font-mono text-gray-400 font-bold block mb-1.5">
              Select User Role Experience
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRoleChange('CITIZEN')}
                className={`py-2 px-2 rounded text-xs font-semibold text-center ${
                  currentRole === 'CITIZEN' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300'
                }`}
              >
                👤 Citizen
              </button>
              <button
                onClick={() => handleRoleChange('RESPONDER')}
                className={`py-2 px-2 rounded text-xs font-semibold text-center ${
                  currentRole === 'RESPONDER' ? 'bg-amber-600 text-white' : 'bg-gray-900 text-gray-300'
                }`}
              >
                🚑 Responder
              </button>
              <button
                onClick={() => handleRoleChange('ADMIN')}
                className={`py-2 px-2 rounded text-xs font-semibold text-center ${
                  currentRole === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-300'
                }`}
              >
                🏛️ Authority
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onOpenReportModal}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-amber-300 text-xs font-bold rounded-lg mr-2 text-center"
            >
              📍 Report Ground Incident
            </button>
            <button
              onClick={() => store.toggleHighContrast()}
              className="p-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-800"
              title="High Contrast"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
