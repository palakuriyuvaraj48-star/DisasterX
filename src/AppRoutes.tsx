import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDisasterStore } from './services/useDisasterStore';
import { Navbar } from './components/common/Navbar';
import { EmergencyMode } from './components/citizen/EmergencyMode';
import { EmergencyFab } from './components/citizen/EmergencyFab';
import { BottomNav } from './components/citizen/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { RouteChangeBanner } from './components/common/RouteChangeBanner';
import { DataFreshnessIndicator } from './components/common/DataFreshnessIndicator';
import { soundEffects } from './services/soundEffects';

// Citizen
import { CitizenHome } from './components/citizen/CitizenHome';
import { DisasterMap } from './components/map/DisasterMap';
import { ShelterFinder } from './components/citizen/ShelterFinder';
import { AlertsScreen } from './components/citizen/AlertsScreen';
import { ProfileScreen } from './components/citizen/ProfileScreen';
import { EvacuationIntelligence } from './components/evacuation/EvacuationIntelligence';
import { ResponseSimulationLab } from './components/simulation/ResponseSimulationLab';
import { CitizenIncidentsList } from './components/citizen/CitizenIncidentsList';
import { CitizenIncidentDetail } from './components/citizen/CitizenIncidentDetail';
import { ShelterDetail } from './components/citizen/ShelterDetail';
import { EvacuationRouteDetail } from './components/evacuation/EvacuationRouteDetail';

// Responder
import { ResponderDashboard } from './components/responder/ResponderDashboard';
import { ResponderIncidents } from './components/responder/ResponderIncidents';
import { ResponderIncidentDetail } from './components/responder/ResponderIncidentDetail';
import { ResponderTeams } from './components/responder/ResponderTeams';
import { ResponderTasks } from './components/responder/ResponderTasks';

// Admin
import { CommandCenter } from './components/admin/CommandCenter';
import { AIRecommendations } from './components/admin/AIRecommendations';
import { AuthorityResources } from './components/admin/AuthorityResources';
import { AuthorityShelters } from './components/admin/AuthorityShelters';
import { AuthorityVerification } from './components/admin/AuthorityVerification';
import { AuthorityAudit } from './components/admin/AuthorityAudit';
import { AuthorityAnalytics } from './components/admin/AuthorityAnalytics';
import { AuthoritySimulation } from './components/admin/AuthoritySimulation';

// System
import { DataIntelligence } from './components/system/DataIntelligence';
import { VerificationPage } from './components/system/VerificationPage';
import { HelpPage } from './components/system/HelpPage';
import { OfflinePage } from './components/system/OfflinePage';

// Modals / Overlays
import { IncidentReportModal } from './components/citizen/IncidentReportModal';
import { ResponseAIChat } from './components/ai/ResponseAIChat';

const PRIMARY_CITIZEN_TABS = ['HOME', 'MAP', 'ALERTS', 'AI', 'PROFILE'] as const;
type CitizenTab = typeof PRIMARY_CITIZEN_TABS[number] | 'EVACUATION' | 'SHELTERS' | 'SIMULATION' | 'REPORT';

const AppContent: React.FC = () => {
  const { currentRole, isEmergencyMode, store } = useDisasterStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (isEmergencyMode || location.pathname === '/emergency') {
    return <EmergencyMode />;
  }

  const getCitizenTabFromPath = (path: string): CitizenTab => {
    if (path.startsWith('/map')) return 'MAP';
    if (path.startsWith('/alerts')) return 'ALERTS';
    if (path.startsWith('/ai-assistant')) return 'AI';
    if (path.startsWith('/profile')) return 'PROFILE';
    if (path.startsWith('/evacuation')) return 'EVACUATION';
    if (path.startsWith('/shelters')) return 'SHELTERS';
    if (path.startsWith('/simulation')) return 'SIMULATION';
    if (path.startsWith('/report-incident')) return 'REPORT';
    return 'HOME';
  };

  const activeCitizenView = getCitizenTabFromPath(location.pathname);
  const useMobileNav = PRIMARY_CITIZEN_TABS.includes(activeCitizenView as any);

  const handleOpenEmergency = () => {
    store.toggleEmergencyMode(true);
    soundEffects.playEmergencyAlert();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <RouteChangeBanner onViewRoute={() => navigate('/evacuation')} />
      <OfflineBanner />
      <DataFreshnessIndicator />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Citizen */}
          <Route path="/" element={
            <CitizenHome
              onOpenReportModal={() => navigate('/report-incident')}
              onOpenAIChat={() => navigate('/ai-assistant')}
              onNavigateToMap={() => navigate('/map')}
              onNavigateToShelters={() => navigate('/shelters')}
            />
          } />
          <Route path="/emergency" element={<EmergencyMode />} />
          <Route path="/map" element={<div className="h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-gray-800"><DisasterMap /></div>} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/evacuation" element={<EvacuationIntelligence />} />
          <Route path="/evacuation/:routeId" element={<EvacuationRouteDetail />} />
          <Route path="/shelters" element={<ShelterFinder />} />
          <Route path="/shelters/:shelterId" element={<ShelterDetail />} />
          <Route path="/simulation" element={<ResponseSimulationLab />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/report-incident" element={<IncidentReportModal isOpen={true} onClose={() => navigate('/')} />} />
          <Route path="/ai-assistant" element={<ResponseAIChat isOpen={true} onClose={() => navigate('/')} onNavigateToMap={() => navigate('/map')} onNavigateToShelters={() => navigate('/shelters')} onOpenReportModal={() => navigate('/report-incident')} />} />
          <Route path="/incidents" element={<CitizenIncidentsList />} />
          <Route path="/incidents/:incidentId" element={<CitizenIncidentDetail />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/offline" element={<OfflinePage />} />

          {/* Responder */}
          <Route path="/responder" element={<ResponderDashboard />} />
          <Route path="/responder/incidents" element={<ResponderIncidents />} />
          <Route path="/responder/incidents/:incidentId" element={<ResponderIncidentDetail />} />
          <Route path="/responder/teams" element={<ResponderTeams />} />
          <Route path="/responder/tasks" element={<ResponderTasks />} />
          <Route path="/responder/routes" element={<EvacuationIntelligence />} />
          <Route path="/responder/map" element={<div className="h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-gray-800"><DisasterMap /></div>} />

          {/* Authority */}
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/command-center/incidents" element={<CommandCenter />} />
          <Route path="/command-center/teams" element={<CommandCenter />} />
          <Route path="/command-center/resources" element={<AuthorityResources />} />
          <Route path="/command-center/shelters" element={<AuthorityShelters />} />
          <Route path="/command-center/recommendations" element={<AIRecommendations />} />
          <Route path="/command-center/verification" element={<AuthorityVerification />} />
          <Route path="/command-center/audit" element={<AuthorityAudit />} />
          <Route path="/command-center/analytics" element={<AuthorityAnalytics />} />
          <Route path="/command-center/simulation" element={<AuthoritySimulation />} />

          {/* System */}
          <Route path="/data-intelligence" element={<DataIntelligence />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/status" element={<DataFreshnessIndicator />} />
          <Route path="/simulation" element={<ResponseSimulationLab />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Desktop sub-navigation for non-primary citizen routes */}
      {!useMobileNav && currentRole === 'CITIZEN' && (
        <div className="flex items-center gap-2 bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto no-scrollbar">
          <Link to="/" className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${location.pathname === '/' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
            🏠 Citizen Hub
          </Link>
          <Link to="/evacuation" className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${location.pathname.startsWith('/evacuation') ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
            🗺️ Adaptive Evacuation
          </Link>
          <Link to="/map" className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${location.pathname.startsWith('/map') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
            📍 Tactical Map
          </Link>
          <Link to="/shelters" className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${location.pathname.startsWith('/shelters') ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
            🏠 Shelters & Relief
          </Link>
          <Link to="/simulation" className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${location.pathname.startsWith('/simulation') ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg' : 'text-amber-400 hover:text-amber-200 hover:bg-gray-800'}`}>
            📊 Response Simulation Lab
          </Link>
        </div>
      )}

      {/* Bottom Navigation for primary citizen tabs */}
      {useMobileNav && (
        <BottomNav onOpenEmergency={handleOpenEmergency} />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-900 bg-gray-950/80 py-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Disaster X © 2026 • AI-Powered Adaptive Disaster Response & Management System</span>
          <span className="text-gray-400">DEMO ENVIRONMENT • Inter-Agency Rapid Response Architecture</span>
        </div>
      </footer>

      {/* Persistent Emergency FAB */}
      {!isEmergencyMode && !useMobileNav && <EmergencyFab />}
    </div>
  );
};

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);
