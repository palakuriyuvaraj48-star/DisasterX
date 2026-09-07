import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Ambulance, 
  Filter, 
  Eye, 
  Clock, 
  MapPin, 
  Sparkles,
  Search,
  ExternalLink,
  Phone,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { IncidentReport, SeverityLevel, VerificationStatus } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';
import { TrustScoreBadge } from '../trust/TrustScoreBadge';

export const IncidentVerifier: React.FC = () => {
  const { incidents, teams, store } = useDisasterStore();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && inc.verificationStatus !== filterStatus) return false;
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.locationName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleVerify = (id: string) => {
    store.verifyIncident(id, 'OFFICER-HQ-99');
    soundEffects.playVerificationBlip();
  };

  const handleReject = (id: string) => {
    store.rejectIncident(id, 'Ground reconnaissance found no active hazard.');
    soundEffects.playVerificationBlip();
  };

  const handleAssign = (incidentId: string) => {
    if (!selectedTeamId) return;
    store.assignTeam(incidentId, selectedTeamId);
    soundEffects.playVerificationBlip();
    setSelectedTeamId('');
  };

  return (
    <div className="space-y-6">
      
      {/* Controls & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 p-4 rounded-2xl border border-gray-800 shadow">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident reports by title or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs font-mono text-gray-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">🟡 Pending Verification</option>
            <option value="VERIFIED">🟢 Verified</option>
            <option value="REJECTED">🔴 Rejected</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs font-mono text-gray-200 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="MODERATE">🟡 Moderate</option>
            <option value="LOW">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Incidents Verification Table */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-950 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Type & Incident</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Trust Score</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4">Assigned Team</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-mono">
                    📭 No incidents matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  const assignedTeam = teams.find(t => t.id === inc.assignedTeamId);
                  return (
                    <tr key={inc.id} className="hover:bg-gray-800/40 transition">
                      
                      {/* Title & Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-sans text-sm">{inc.title}</div>
                        <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                          <span>{inc.source.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>{new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="text-gray-300 font-sans">{inc.locationName}</span>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {inc.coordinates.lat.toFixed(4)}, {inc.coordinates.lng.toFixed(4)}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                          inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                          inc.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          inc.severity === 'MODERATE' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>

                      {/* Trust Score Badge */}
                      <td className="py-3.5 px-4">
                        <TrustScoreBadge incident={inc} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {inc.verificationStatus === 'VERIFIED' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>VERIFIED BY RESPONSE TEAM</span>
                          </span>
                        )}
                        {inc.verificationStatus === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>PENDING VERIFICATION</span>
                          </span>
                        )}
                        {inc.verificationStatus === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3 text-red-400" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </td>

                      {/* Assigned Team */}
                      <td className="py-3.5 px-4">
                        {assignedTeam ? (
                          <span className="text-blue-300 font-sans text-xs flex items-center gap-1 font-bold">
                            <Ambulance className="w-3.5 h-3.5 text-blue-400" />
                            <span>{assignedTeam.name}</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={selectedTeamId}
                              onChange={(e) => setSelectedTeamId(e.target.value)}
                              className="px-2 py-1 bg-gray-950 border border-gray-700 rounded text-[11px] text-gray-300"
                            >
                              <option value="">Select Team...</option>
                              {teams.filter(t => t.status === 'AVAILABLE').map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                              ))}
                            </select>
                            <button
                              disabled={!selectedTeamId}
                              onClick={() => handleAssign(inc.id)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded text-[10px] font-bold"
                            >
                              Dispatch
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inc.verificationStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleVerify(inc.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition shadow flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify</span>
                              </button>

                              <button
                                onClick={() => handleReject(inc.id)}
                                className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {inc.verificationStatus === 'VERIFIED' && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              Decision Eligible ✓
                            </span>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
