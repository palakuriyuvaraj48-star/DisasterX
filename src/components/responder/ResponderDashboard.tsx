import React, { useState } from 'react';
import { 
  Ambulance, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Radio, 
  AlertTriangle, 
  Send,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { ResponseTeamStatus } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';
import { DisasterMap } from '../map/DisasterMap';

export const ResponderDashboard: React.FC = () => {
  const { teams, incidents, store } = useDisasterStore();
  const [activeTeamId, setActiveTeamId] = useState<string>('TEAM-NDRF-01');
  const [fieldNote, setFieldNote] = useState('');

  const currentTeam = teams.find(t => t.id === activeTeamId) || teams[0];
  const assignedIncident = incidents.find(i => i.id === currentTeam.currentAssignmentIncidentId);

  const handleStatusUpdate = (newStatus: ResponseTeamStatus) => {
    store.updateTeamStatus(currentTeam.id, newStatus);
    soundEffects.playVerificationBlip();
  };

  const handleSendFieldNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldNote.trim()) return;

    if (assignedIncident) {
      const updated = incidents.map(inc => {
        if (inc.id === assignedIncident.id) {
          return {
            ...inc,
            notes: [...(inc.notes || []), `Field update from ${currentTeam.name}: ${fieldNote}`]
          };
        }
        return inc;
      });
      store.setState({ incidents: updated });
    }

    setFieldNote('');
    soundEffects.playVerificationBlip();
    alert('Field telemetry & report transmitted to Command Center.');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Team Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <Ambulance className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                FIELD RESPONDER TERMINAL
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                TACTICAL UNIT
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Live Dispatch Feed • Tactical Evacuation Coordinates • Ground Situation Updates
            </p>
          </div>
        </div>

        {/* Active Unit Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">Active Unit:</span>
          <select
            value={activeTeamId}
            onChange={(e) => setActiveTeamId(e.target.value)}
            className="px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs font-mono text-white focus:outline-none"
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Assignment Card + Quick Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Current Active Incident Assignment & Field Comms */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Active Mission Card */}
          <div className="bg-gray-900/90 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>ACTIVE MISSION DIRECTIVE</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                {currentTeam.status}
              </span>
            </div>

            {assignedIncident ? (
              <div className="space-y-3">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    assignedIncident.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {assignedIncident.severity}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5 leading-snug">
                    {assignedIncident.title}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{assignedIncident.locationName}</span>
                  </p>
                </div>

                <p className="text-xs text-gray-300 bg-gray-950/80 p-3 rounded-xl border border-gray-800 leading-relaxed">
                  {assignedIncident.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase block">Estimated At Risk</span>
                    <span className="text-base font-bold text-red-400">~{assignedIncident.estimatedPeopleAffected}</span>
                  </div>
                  <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase block">Verification Trust</span>
                    <span className="text-base font-bold text-emerald-400">{assignedIncident.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-400">
                No active incident assigned to this unit. Unit on standby patrol.
              </div>
            )}

            {/* Quick Tactical Status Updates */}
            <div className="pt-2 border-t border-gray-800 space-y-2">
              <label className="text-[11px] font-mono uppercase text-gray-400 font-bold block">
                Update Mission Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusUpdate('EN_ROUTE')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    currentTeam.status === 'EN_ROUTE' ? 'bg-blue-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  🔵 En Route
                </button>
                <button
                  onClick={() => handleStatusUpdate('ON_SCENE')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    currentTeam.status === 'ON_SCENE' ? 'bg-amber-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  🟠 On Scene
                </button>
                <button
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    currentTeam.status === 'COMPLETED' ? 'bg-emerald-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  ✅ Completed
                </button>
                <button
                  onClick={() => handleStatusUpdate('AVAILABLE')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    currentTeam.status === 'AVAILABLE' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  🟢 Standby
                </button>
              </div>
            </div>
          </div>

          {/* Quick Field Telemetry Note Form */}
          <form onSubmit={handleSendFieldNote} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-mono uppercase text-gray-300 font-bold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Transmit Field SitRep to Command</span>
            </h4>
            <textarea
              rows={2}
              placeholder="e.g., Sector road water cleared to 1ft. Evacuation of 20 residents completed."
              value={fieldNote}
              onChange={(e) => setFieldNote(e.target.value)}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={!fieldNote.trim()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition shadow"
            >
              Transmit Ground Update
            </button>
          </form>

        </div>

        {/* Right Column: Live Tactical Map with Evacuation Routes */}
        <div className="lg:col-span-2 h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <DisasterMap />
        </div>

      </div>

    </div>
  );
};
