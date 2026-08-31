import React, { useState } from 'react';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Filter, 
  Check, 
  Search,
  UserCheck
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { IncidentReport, SeverityLevel, VerificationStatus } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';

export const IncidentVerifier: React.FC = () => {
  const { incidents, teams, store } = useDisasterStore();
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncidentForAssignment, setSelectedIncidentForAssignment] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    if (filterStatus !== 'ALL' && inc.verificationStatus !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inc.title.toLowerCase().includes(term) ||
        inc.locationName.toLowerCase().includes(term) ||
        inc.id.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleVerify = (id: string) => {
    store.verifyIncident(id, 'District Magistrate Command');
    soundEffects.playVerificationBlip();
  };

  const handleReject = (id: string) => {
    store.rejectIncident(id, 'Flagged as duplicate / unsubstantiated', 'Command Duty Officer');
  };

  const handleAssignTeam = (incidentId: string) => {
    if (!selectedTeamId) return;
    store.assignTeam(incidentId, selectedTeamId, 'Operations Lead');
    soundEffects.playVerificationBlip();
    setSelectedIncidentForAssignment(null);
    setSelectedTeamId('');
  };

  return (
    <div className="space-y-4">
      
      {/* Triage Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search incidents by location or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {st} ({incidents.filter(i => st === 'ALL' || i.verificationStatus === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 text-gray-400 text-xs">
            No incident reports found matching filter.
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isPending = incident.verificationStatus === 'PENDING';
            const isVerified = incident.verificationStatus === 'VERIFIED';
            const isCritical = incident.severity === 'CRITICAL';

            return (
              <div
                key={incident.id}
                className="bg-gray-900/90 border border-gray-800 hover:border-gray-700 rounded-xl p-4 shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-400">{incident.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isCritical ? 'bg-red-600 text-white' :
                      incident.severity === 'HIGH' ? 'bg-amber-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {incident.severity}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono flex items-center gap-1 ${
                      isVerified ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      isPending ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                      {incident.verificationStatus} ({incident.confidenceScore}% Trust)
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-gray-400">
                    Reported: {new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Source: {incident.source}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-white">{incident.title}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{incident.locationName}</span>
                    <span className="text-gray-500">|</span>
                    <span>Estimated Impact: ~{incident.estimatedPeopleAffected} citizens</span>
                  </p>
                  <p className="text-xs text-gray-300 mt-2 bg-gray-950/60 p-2.5 rounded-lg border border-gray-800">
                    {incident.description}
                  </p>
                </div>

                {/* Audit & Notes trail if available */}
                {incident.notes && incident.notes.length > 0 && (
                  <div className="text-[11px] text-gray-400 font-mono space-y-0.5">
                    {incident.notes.map((n, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-gray-400">
                        <span>↳ {n}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 font-mono">Assigned Unit:</span>
                    {incident.assignedTeamId ? (
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded font-mono font-bold">
                        {teams.find(t => t.id === incident.assignedTeamId)?.name || incident.assignedTeamId}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">None</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Assign Unit Dropdown Toggle */}
                    <button
                      onClick={() => setSelectedIncidentForAssignment(selectedIncidentForAssignment === incident.id ? null : incident.id)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700 flex items-center gap-1 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{incident.assignedTeamId ? 'Reassign Team' : 'Assign Team'}</span>
                    </button>

                    {/* Verification Actions */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleVerify(incident.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition shadow"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify Ground Truth</span>
                        </button>

                        <button
                          onClick={() => handleReject(incident.id)}
                          className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold rounded-lg transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Team Assignment Drawer */}
                {selectedIncidentForAssignment === incident.id && (
                  <div className="p-3 bg-gray-950 border border-gray-700 rounded-xl space-y-2 animate-in fade-in">
                    <label className="text-[11px] font-mono uppercase text-gray-300 font-bold block">
                      Select Response Unit to Dispatch:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none"
                      >
                        <option value="">-- Choose Unit --</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.category} • {t.status} • {t.personnelCount} personnel)
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={!selectedTeamId}
                        onClick={() => handleAssignTeam(incident.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition"
                      >
                        Confirm Dispatch
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
