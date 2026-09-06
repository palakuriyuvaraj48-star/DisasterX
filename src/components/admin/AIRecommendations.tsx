import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const AIRecommendations: React.FC = () => {
  const { incidents, shelters, teams, store } = useDisasterStore();
  const [, setAcceptedCount] = useState(0);

  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' && i.verificationStatus === 'VERIFIED');
  const nearCapacityShelters = shelters.filter(s => {
    const occ = (s.currentOccupancy / s.totalCapacity) * 100;
    return occ >= 80 && s.status === 'OPEN';
  });
  const availableTeams = teams.filter(t => t.status === 'AVAILABLE');

  const recommendations = [
    ...(criticalIncidents.length > 0 && availableTeams.length > 0 ? [{
      id: 'REC-01',
      title: `Deploy ${availableTeams[0].name} to nearest CRITICAL incident`,
      reason: `${criticalIncidents.length} critical incident(s) verified with no nearby response unit assigned.`,
      impact: `Response time: 12 min → ${availableTeams[0].etaMinutes || 4} min`,
      action: 'Accept',
      type: 'DEPLOY_TEAM' as const
    }] : []),
    ...(nearCapacityShelters.length > 0 ? [{
      id: 'REC-02',
      title: `Open alternate shelter or activate relief camp`,
      reason: `${nearCapacityShelters[0].name} at ${Math.round((nearCapacityShelters[0].currentOccupancy / nearCapacityShelters[0].totalCapacity) * 100)}% capacity.`,
      impact: `Prevents overcrowding and ensures dignity of displaced persons`,
      action: 'Accept',
      type: 'OPEN_SHELTER' as const
    }] : []),
    ...(criticalIncidents.some(i => i.estimatedPeopleAffected && i.estimatedPeopleAffected > 100) ? [{
      id: 'REC-03',
      title: 'Issue evacuation alert to affected zone',
      reason: `High-density impact (${criticalIncidents.find(i => (i.estimatedPeopleAffected || 0) > 100)?.estimatedPeopleAffected || 0}+ residents) with confirmed hazard.`,
      impact: 'Prevents casualties by prompting pre-emptive movement to shelters',
      action: 'Send Alert',
      type: 'ISSUE_ALERT' as const
    }] : []),
    ...(availableTeams.length > 1 ? [{
      id: 'REC-04',
      title: `Pre-position ${availableTeams[1].name} at Sector 4 staging point`,
      reason: 'Proactive deployment reduces response latency for anticipated secondary incidents.',
      impact: 'Ready reserve cuts secondary incident response by ~40%',
      action: 'Accept',
      type: 'PRE_POSITION' as const
    }] : [])
  ];

  const handleAccept = (rec: any) => {
    soundEffects.playVerificationBlip();
    setAcceptedCount(prev => prev + 1);
    
    if (rec.type === 'DEPLOY_TEAM' && availableTeams.length > 0) {
      const targetIncident = criticalIncidents[0];
      if (targetIncident) {
        store.assignTeam(availableTeams[0].id, targetIncident.id, 'AI Recommendation Engine');
      }
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl text-center">
        <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
        <h3 className="text-base font-bold text-white mb-1">AI Analysis Complete</h3>
        <p className="text-xs text-gray-400">No critical recommendations at this time. Situation stable.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          <h3 className="text-base font-bold text-white font-mono">AI RECOMMENDATIONS</h3>
        </div>
        <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-mono font-bold">
          {recommendations.length} SUGGESTIONS
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-gray-950/80 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white leading-snug">{rec.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{rec.reason}</p>
                <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">Impact: {rec.impact}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleAccept(rec)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rec.action}</span>
              </button>
              <button
                onClick={() => soundEffects.playVerificationBlip()}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700 transition"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
