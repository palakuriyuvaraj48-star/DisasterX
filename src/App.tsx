import React, { useState, useEffect } from 'react';
import { useDisasterStore } from './services/useDisasterStore';
import { Navbar } from './components/common/Navbar';
import { CitizenHome } from './components/citizen/CitizenHome';
import { EmergencyMode } from './components/citizen/EmergencyMode';
import { CommandCenter } from './components/admin/CommandCenter';
import { ResponderDashboard } from './components/responder/ResponderDashboard';
import { IncidentReportModal } from './components/citizen/IncidentReportModal';
import { ResponseAIChat } from './components/ai/ResponseAIChat';
import { OfflineBanner } from './components/common/OfflineBanner';
import { RouteChangeBanner } from './components/common/RouteChangeBanner';
import { ResponseSimulationLab } from './components/simulation/ResponseSimulationLab';
import { DisasterMap } from './components/map/DisasterMap';
import { ShelterFinder } from './components/citizen/ShelterFinder';
import { EvacuationIntelligence } from './components/evacuation/EvacuationIntelligence';
import { soundEffects } from './services/soundEffects';

export function App() {
  const { currentRole, isEmergencyMode, isHighContrast, store } = useDisasterStore();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [activeCitizenView, setActiveCitizenView] = useState<'HOME' | 'MAP' | 'SHELTERS' | 'EVACUATION' | 'SIMULATION'>('HOME');

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('emergency-high-contrast');
    } else {
      document.body.classList.remove('emergency-high-contrast');
    }
  }, [isHighContrast]);

  const handleNavigateToMap = () => {
    setActiveCitizenView('MAP');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToShelters = () => {
    setActiveCitizenView('SHELTERS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToEvacuation = () => {
    setActiveCitizenView('EVACUATION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSimulationLab = () => {
    setActiveCitizenView('SIMULATION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* 1. Real-time Dynamic Route Change Notification Banner */}
      <RouteChangeBanner onViewRoute={handleNavigateToEvacuation} />

      {/* 2. Offline Status Banner */}
      <OfflineBanner />

      {/* 3. Global Navbar */}
      <Navbar 
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSimulationLab={handleOpenSimulationLab}
      />

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Full-screen dedicated Emergency Mode */}
        {isEmergencyMode ? (
          <EmergencyMode />
        ) : (
          <>
            {/* ROLE 1: CITIZEN EXPERIENCE */}
            {currentRole === 'CITIZEN' && (
              <div className="space-y-6">
                
                {/* Citizen View Sub-navigation */}
                <div className="flex items-center gap-2 bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveCitizenView('HOME')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${
                      activeCitizenView === 'HOME'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    🏠 Citizen Hub
                  </button>

                  <button
                    onClick={() => setActiveCitizenView('EVACUATION')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${
                      activeCitizenView === 'EVACUATION'
                        ? 'bg-cyan-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    🗺️ Adaptive Evacuation
                  </button>

                  <button
                    onClick={() => setActiveCitizenView('MAP')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${
                      activeCitizenView === 'MAP'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    📍 Tactical Map
                  </button>

                  <button
                    onClick={() => setActiveCitizenView('SHELTERS')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${
                      activeCitizenView === 'SHELTERS'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    🏠 Shelters & Relief
                  </button>

                  <button
                    onClick={() => setActiveCitizenView('SIMULATION')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${
                      activeCitizenView === 'SIMULATION'
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg'
                        : 'text-amber-400 hover:text-amber-200 hover:bg-gray-800'
                    }`}
                  >
                    📊 Response Simulation Lab
                  </button>
                </div>

                {/* Sub-view rendering */}
                {activeCitizenView === 'HOME' && (
                  <CitizenHome 
                    onOpenReportModal={() => setIsReportModalOpen(true)}
                    onOpenAIChat={() => setIsAIChatOpen(true)}
                    onNavigateToMap={handleNavigateToMap}
                    onNavigateToShelters={handleNavigateToShelters}
                  />
                )}

                {activeCitizenView === 'EVACUATION' && (
                  <EvacuationIntelligence />
                )}

                {activeCitizenView === 'MAP' && (
                  <div className="h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                    <DisasterMap />
                  </div>
                )}

                {activeCitizenView === 'SHELTERS' && (
                  <ShelterFinder />
                )}

                {activeCitizenView === 'SIMULATION' && (
                  <ResponseSimulationLab />
                )}

              </div>
            )}

            {/* ROLE 2: FIELD RESPONDER */}
            {currentRole === 'RESPONDER' && (
              <ResponderDashboard />
            )}

            {/* ROLE 3: GOVERNMENT COMMAND CENTER */}
            {currentRole === 'ADMIN' && (
              <CommandCenter />
            )}
          </>
        )}

      </main>

      {/* 5. Incident Reporting Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* 6. Response AI Floating Assistant */}
      <ResponseAIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onNavigateToMap={handleNavigateToMap}
        onNavigateToShelters={handleNavigateToShelters}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* 7. Footer */}
      <footer className="mt-auto border-t border-gray-900 bg-gray-950/80 py-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Disaster X © 2026 • AI-Powered Adaptive Disaster Response & Management System</span>
          <span className="text-gray-400">DEMO ENVIRONMENT • Inter-Agency Rapid Response Architecture</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
