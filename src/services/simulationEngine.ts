import { SimulationLabState, DisasterType } from '../types/disaster';

export class SimulationEngine {
  public static calculateSimulationMetrics(state: {
    timeStep: number;
    mainRoadBlocked: boolean;
    floodRiskLevel: 'HIGH' | 'CRITICAL';
    shelter04CapacityPercent: number;
  }): {
    staticPlan: SimulationLabState['staticPlan'];
    adaptivePlan: SimulationLabState['adaptivePlan'];
    improvementScore: number;
  } {
    const { timeStep, mainRoadBlocked, floodRiskLevel, shelter04CapacityPercent } = state;

    // --- Static Plan Metrics ---
    // A static plan is created at T=0 (Zone A -> Main Road -> Shelter 04) and never adapts when roads submerge or shelters fill up.
    let staticRouteRisk = '🟢 Low (Initial)';
    let staticEvacTime = 18;
    let staticOverload = `${shelter04CapacityPercent}%`;
    let staticExposure = 20;
    let staticScore = 85;

    if (timeStep >= 10 || mainRoadBlocked) {
      staticRouteRisk = '🔴 Impassable (Blocked Causeway)';
      staticEvacTime = 120; // Massive delays due to stranded vehicles
      staticExposure = 88;  // Trapped in rising floodwater
      staticScore = 24;
    }

    if (timeStep >= 15 && shelter04CapacityPercent >= 95) {
      staticOverload = `${shelter04CapacityPercent}% (OVERLOAD CRITICAL)`;
      staticScore = Math.max(10, staticScore - 10);
    }

    if (floodRiskLevel === 'CRITICAL') {
      staticExposure = Math.min(100, staticExposure + 8);
      staticScore = Math.max(5, staticScore - 5);
    }

    const staticPlan = {
      route: 'Zone A → Main Road → Shelter 04',
      routeAdaptations: 0,
      finalRouteRisk: staticRouteRisk,
      evacuationTimeMin: staticEvacTime,
      shelterOverload: staticOverload,
      riskExposureScore: staticExposure,
      performanceScore: staticScore,
    };

    // --- Adaptive Disaster X Plan Metrics ---
    // Adapts dynamically: Switches to East Road -> Shelter 07 when Main Road blocks, balances capacity.
    let adaptiveRoute = 'Zone A → Main Road → Shelter 04';
    let adaptiveAdaptations = 0;
    let adaptiveRouteRisk = '🟢 Verified Safe';
    let adaptiveEvacTime = 18;
    let adaptiveOverload = '55% (Balanced)';
    let adaptiveExposure = 15;
    let adaptiveScore = 90;

    if (timeStep >= 10 || mainRoadBlocked) {
      adaptiveRoute = 'Zone A → East Road → Shelter 07';
      adaptiveAdaptations = 1;
      adaptiveRouteRisk = '🟢 High Elevation Safe';
      adaptiveEvacTime = 22; // Slightly longer detour, but fully clear
      adaptiveExposure = 22;
      adaptiveScore = 92;
    }

    if (timeStep >= 15) {
      adaptiveAdaptations = 2; // Rerouted both road & optimized shelter distribution
      adaptiveOverload = '68% (Optimized)';
      adaptiveScore = 94;
    }

    if (floodRiskLevel === 'CRITICAL') {
      adaptiveExposure = 28;
      adaptiveScore = 91;
    }

    const adaptivePlan = {
      route: adaptiveRoute,
      routeAdaptations: adaptiveAdaptations,
      finalRouteRisk: adaptiveRouteRisk,
      evacuationTimeMin: adaptiveEvacTime,
      shelterOverload: adaptiveOverload,
      riskExposureScore: adaptiveExposure,
      performanceScore: adaptiveScore,
    };

    const improvementScore = adaptivePlan.performanceScore - staticPlan.performanceScore;

    return {
      staticPlan,
      adaptivePlan,
      improvementScore,
    };
  }
}
