import { IncidentReport, TrustScoreBreakdown } from '../types/disaster';

// Configurable prototype weights (can later be replaced by a trained ML verification model)
export const TRUST_SCORING_WEIGHTS = {
  CITIZEN_BASE: 20,
  MULTIPLE_REPORTS: 20,
  PHOTO_VIDEO_EVIDENCE: 10,
  RESPONDER_CONFIRMATION: 30,
  OFFICIAL_SOURCE: 20,
};

export class TrustEngine {
  public static calculateTrustScore(params: {
    source: IncidentReport['source'];
    supportingReportsCount?: number;
    hasPhotoEvidence?: boolean;
    responderConfirmed?: boolean;
    verificationStatus: IncidentReport['verificationStatus'];
  }): TrustScoreBreakdown {
    let baseScore = 0;
    let independentReportsScore = 0;
    let evidenceScore = 0;
    let responderConfirmationScore = 0;
    let officialSourceScore = 0;

    // 1. Source Weight
    if (params.source === 'CITIZEN_REPORT') {
      baseScore = TRUST_SCORING_WEIGHTS.CITIZEN_BASE;
    } else if (params.source === 'IOT_SENSOR' || params.source === 'SATELLITE_FEED' || params.source === 'DRONE_RECON') {
      baseScore = TRUST_SCORING_WEIGHTS.CITIZEN_BASE + 15;
      officialSourceScore = 15;
    } else if (params.source === 'OFFICIAL_DISPATCH') {
      baseScore = TRUST_SCORING_WEIGHTS.CITIZEN_BASE;
      officialSourceScore = TRUST_SCORING_WEIGHTS.OFFICIAL_SOURCE;
    }

    // 2. Multiple Independent Reports (+20 if > 2 reports)
    const reports = params.supportingReportsCount || 1;
    if (reports >= 3) {
      independentReportsScore = TRUST_SCORING_WEIGHTS.MULTIPLE_REPORTS;
    } else if (reports === 2) {
      independentReportsScore = 10;
    }

    // 3. Evidence (+10 if photo/video attached)
    if (params.hasPhotoEvidence) {
      evidenceScore = TRUST_SCORING_WEIGHTS.PHOTO_VIDEO_EVIDENCE;
    }

    // 4. Responder Confirmation (+30 if ground team verified)
    if (params.responderConfirmed || params.verificationStatus === 'VERIFIED') {
      responderConfirmationScore = TRUST_SCORING_WEIGHTS.RESPONDER_CONFIRMATION;
    }

    // Total Normalized Score (0 - 100)
    let totalTrustScore = Math.min(100, Math.max(0, 
      baseScore + independentReportsScore + evidenceScore + responderConfirmationScore + officialSourceScore
    ));

    // If explicitly rejected, override to low
    if (params.verificationStatus === 'REJECTED') {
      totalTrustScore = 10;
    }

    // Determine Confidence Tier
    let confidenceTier: TrustScoreBreakdown['confidenceTier'] = 'LOW';
    if (totalTrustScore >= 81) confidenceTier = 'VERY_HIGH';
    else if (totalTrustScore >= 61) confidenceTier = 'HIGH';
    else if (totalTrustScore >= 31) confidenceTier = 'MODERATE';
    else confidenceTier = 'LOW';

    // Decision Eligibility: Only verified incidents OR incidents with >= 80% trust score can trigger official route recalculations
    const isDecisionEligible = params.verificationStatus === 'VERIFIED' || totalTrustScore >= 80;

    return {
      baseScore,
      independentReportsScore,
      evidenceScore,
      responderConfirmationScore,
      officialSourceScore,
      totalTrustScore,
      confidenceTier,
      isDecisionEligible,
    };
  }
}
