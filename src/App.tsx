import React, { useState, useEffect } from 'react';
import { useDisasterStore } from './services/useDisasterStore';
import { Navbar } from './components/common/Navbar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { BroadcastBar } from './components/common/BroadcastBar';
import { CitizenHome } from './components/citizen/CitizenHome';
import { EmergencyMode } from './components/citizen/EmergencyMode';
import { ResponderDashboard } from './components/responder/ResponderDashboard';
import { CommandCenter } from './components/admin/CommandCenter';
import { IncidentReportModal } from './components/citizen/IncidentReportModal';
import { ResponseAIChat } from './components/ai/ResponseAIChat';
import { Bot, MapPin, PhoneCall, ShieldAlert, Zap } from 'lucide-react';
import { soundEffects } from './services/soundEffects';

export function App() {
  const { 
    currentRole, 
    isEmergencyMode, 
    isHighContrast, 
    store 
  } = useDisasterStore();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Register service worker if supported
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration optional notice:', err);
      });
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'bg-black text-white' : 'bg-[#0B0F19] text-gray-100'}`}>
      
      {/* Offline Status & Telemetry Sync Banner */}
      <OfflineBanner />

      {/* High-priority Emergency Broadcast Alert */}
      <BroadcastBar />

      {/* Main Navigation */}
      <Navbar onOpenReportModal={() => setIsReportModalOpen(true)} />

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isEmergencyMode ? (
          <EmergencyMode />
        ) : (
          <>
            {currentRole === 'CITIZEN' && (
              <CitizenHome
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenAIChat={() => setIsAIChatOpen(true)}
              />
            )}

            {currentRole === 'RESPONDER' && <ResponderDashboard />}

            {currentRole === 'ADMIN' && <CommandCenter />}
          </>
        )}
      </main>

      {/* Floating Action Button for Response AI */}
      {!isEmergencyMode && (
        <div className="fixed bottom-6 right-6 z-[1500] flex flex-col items-end gap-3">
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 border border-blue-400/40 transition-all hover:scale-105 font-bold text-xs sm:text-sm"
            aria-label="Open AI Emergency Assistant"
          >
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask Response AI</span>
          </button>
        </div>
      )}

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Response AI Assistant Drawer */}
      <ResponseAIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onNavigateToMap={() => {
          store.setRole('CITIZEN');
          const mapEl = document.getElementById('gis-command-map');
          mapEl?.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateToShelters={() => {
          store.setRole('CITIZEN');
          const shEl = document.getElementById('verified-shelters');
          shEl?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Government & Authority Disclaimers Footer */}
      {!isEmergencyMode && (
        <footer className="bg-gray-950 border-t border-gray-800 py-8 px-4 text-center text-xs text-gray-500 space-y-3 font-mono">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-gray-300">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>DisasterGuard AI v2.4 (Government Emergency Architecture)</span>
            </span>
            <span>•</span>
            <span>Integrated Emergency: <strong>112</strong></span>
            <span>•</span>
            <span>NDRF Hotline: <strong>1078</strong></span>
            <span>•</span>
            <span>Medical / Ambulance: <strong>108</strong></span>
          </div>
          <p className="text-[11px] text-gray-400">
            DEMO ENVIRONMENT NOTICE: Simulated disaster feeds and telemetry are displayed for demonstration and testing purposes. In active real-world life emergencies, immediately follow directives issued by your local State/District Disaster Management Authority.
          </p>
        </footer>
      )}

    </div>
  );
}

export default App;
