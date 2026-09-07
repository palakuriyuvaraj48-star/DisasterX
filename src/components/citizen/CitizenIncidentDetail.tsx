import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDisasterStore } from '../../services/useDisasterStore';
import { MapPin, ArrowLeft } from 'lucide-react';

export const CitizenIncidentDetail: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const { incidents } = useDisasterStore();
  const incident = incidents.find(i => i.id === incidentId);

  if (!incident) {
    return (
      <div className="space-y-4">
        <Link to="/incidents" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
        </Link>
        <div className="p-8 bg-gray-900/80 border border-gray-800 rounded-2xl text-center text-sm text-gray-400">
          Incident not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/incidents" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents
      </Link>

      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
            incident.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
            incident.severity === 'HIGH' ? 'bg-amber-600 text-white' :
            incident.severity === 'MODERATE' ? 'bg-yellow-900 text-yellow-300' :
            'bg-blue-900 text-blue-300'
          }`}>
            {incident.severity}
          </span>
          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${
            incident.verificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
            incident.verificationStatus === 'PENDING' ? 'bg-amber-950 text-amber-300 border-amber-700' :
            'bg-gray-800 text-gray-400 border-gray-700'
          }`}>
            {incident.verificationStatus}
          </span>
          <span className="text-xs text-gray-400 font-mono">{incident.id}</span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white">{incident.title}</h1>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            {incident.locationName}
          </p>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Reported: {new Date(incident.reportedAt).toLocaleString()}
          </p>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">{incident.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">TYPE</span>
            <span className="text-sm font-bold text-white">{incident.type}</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">PEOPLE AFFECTED</span>
            <span className="text-sm font-bold text-white">~{incident.estimatedPeopleAffected || 'N/A'}</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">SOURCE</span>
            <span className="text-sm font-bold text-white">{incident.source.replace('_', ' ')}</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">CONFIDENCE</span>
            <span className="text-sm font-bold text-white">{incident.confidenceScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
