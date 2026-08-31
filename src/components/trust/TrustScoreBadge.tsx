import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Camera, 
  Users, 
  Info,
  Layers,
  X
} from 'lucide-react';
import { IncidentReport, TrustScoreBreakdown } from '../../types/disaster';
import { TrustEngine } from '../../services/trustEngine';

interface TrustScoreBadgeProps {
  incident: IncidentReport;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({ incident, size = 'md' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breakdown: TrustScoreBreakdown = incident.trustBreakdown || TrustEngine.calculateTrustScore({
    source: incident.source,
    supportingReportsCount: incident.supportingReportsCount || (incident.source === 'CITIZEN_REPORT' ? 3 : 1),
    hasPhotoEvidence: incident.hasPhotoEvidence !== undefined ? incident.hasPhotoEvidence : true,
    responderConfirmed: incident.responderConfirmed || incident.verificationStatus === 'VERIFIED',
    verificationStatus: incident.verificationStatus,
  });

  const getTierColor = () => {
    switch (breakdown.confidenceTier) {
      case 'VERY_HIGH': return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'HIGH': return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'MODERATE': return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'LOW': return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono font-bold transition hover:opacity-90 shadow-sm ${getTierColor()} ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
        title="Click to view Prototype Trust Score breakdown"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Trust: {breakdown.totalTrustScore}/100</span>
        <span className="text-[10px] text-gray-400 font-sans hidden sm:inline">({breakdown.confidenceTier.replace('_', ' ')})</span>
      </button>

      {/* Trust Score Breakdown Modal */}
      {isModalOpen && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gray-900 border-2 border-gray-700 rounded-3xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/40">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-mono">PROTOTYPE TRUST SCORE</h3>
                  <p className="text-[11px] text-gray-400">Deterministic Verification Weight Model</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Tier Header */}
            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 block">Calculated Confidence</span>
                <span className="text-3xl font-black text-white font-mono">{breakdown.totalTrustScore}</span>
                <span className="text-gray-400 text-xs"> / 100</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-gray-400 block">Confidence Tier</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${getTierColor()}`}>
                  {breakdown.confidenceTier.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Breakdown Weights */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-[11px] uppercase text-gray-400 font-bold block">Scoring Weight Attribution:</span>
              
              <div className="bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/80 flex justify-between items-center">
                <span className="text-gray-300">Citizen Report Base Weight</span>
                <span className="font-bold text-emerald-400">+{breakdown.baseScore} pts</span>
              </div>

              <div className="bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/80 flex justify-between items-center">
                <span className="text-gray-300">Independent Corroborating Reports (x3)</span>
                <span className="font-bold text-emerald-400">+{breakdown.independentReportsScore} pts</span>
              </div>

              <div className="bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/80 flex justify-between items-center">
                <span className="text-gray-300">Ground Evidence (Photo/Video Telemetry)</span>
                <span className="font-bold text-emerald-400">+{breakdown.evidenceScore} pts</span>
              </div>

              <div className="bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/80 flex justify-between items-center">
                <span className="text-gray-300">Field Responder / Officer Verification</span>
                <span className="font-bold text-emerald-400">+{breakdown.responderConfirmationScore} pts</span>
              </div>
            </div>

            {/* Decision Eligibility Rule Notice */}
            <div className={`p-3 rounded-xl border text-xs ${
              breakdown.isDecisionEligible 
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
                : 'bg-amber-950/40 border-amber-800 text-amber-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-0.5">
                <Info className="w-4 h-4" />
                <span>Decision Eligibility: {breakdown.isDecisionEligible ? 'ELIGIBLE' : 'PENDING'}</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                {breakdown.isDecisionEligible
                  ? 'This report is verified or has high confidence (>= 80%). The AI Response Optimizer is permitted to dynamically adapt citizen evacuation routes.'
                  : 'Unverified citizen reports are tagged as Pending and do NOT automatically alter official evacuation vectors until verified.'}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono transition"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </>
  );
};
