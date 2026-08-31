import { EvacuationRoute, Shelter, RoadblockHazard, RouteConstraintScore } from '../types/disaster';

export class EvacuationEngine {
  /**
   * Calculates a composite constraint score for a candidate evacuation route.
   * Model: Safety + Shelter Availability + Road Reliability + Response Access - Risk - Distance - Travel Time
   */
  public static scoreRoute(params: {
    route: EvacuationRoute;
    destinationShelter: Shelter;
    activeRoadblocks: RoadblockHazard[];
    floodRiskLevel: 'HIGH' | 'CRITICAL';
  }): RouteConstraintScore {
    const { route, destinationShelter, activeRoadblocks, floodRiskLevel } = params;

    // Check if any roadblock blocks this route
    const isRouteImpassable = route.status === 'BLOCKED' || activeRoadblocks.some(rb => !rb.isPassable && rb.affectedRoadName.toLowerCase().includes('causeway'));

    if (isRouteImpassable) {
      return {
        safetyScore: 10,
        shelterAvailabilityScore: 50,
        roadReliabilityScore: 0,
        responseAccessScore: 20,
        riskPenalty: 50,
        distancePenalty: 20,
        travelTimePenalty: 20,
        totalCompositeScore: 10, // Impassable
      };
    }

    // 1. Safety Score (Base 80 - flood hazard penalty)
    let safetyScore = floodRiskLevel === 'CRITICAL' ? 70 : 85;
    if (route.name.includes('Ridge') || route.name.includes('Highway')) {
      safetyScore += 10; // High elevation bonus
    }

    // 2. Shelter Availability Score (based on occupancy)
    const occupancyRate = destinationShelter.currentOccupancy / destinationShelter.totalCapacity;
    let shelterAvailabilityScore = Math.max(0, Math.round((1 - occupancyRate) * 100));

    // 3. Road Reliability
    const roadReliabilityScore = 90;

    // 4. Response Access (Medical/Support availability)
    const responseAccessScore = destinationShelter.amenities.hasMedical ? 90 : 70;

    // 5. Penalties
    const riskPenalty = floodRiskLevel === 'CRITICAL' ? 25 : 10;
    const distancePenalty = Math.round(route.distanceKm * 4);
    const travelTimePenalty = Math.round(route.estimatedTimeMin * 1.5);

    // Total Composite Score
    const totalRaw = (safetyScore * 0.35) + 
                     (shelterAvailabilityScore * 0.25) + 
                     (roadReliabilityScore * 0.20) + 
                     (responseAccessScore * 0.20) - 
                     (riskPenalty * 0.15) - 
                     (distancePenalty * 0.1) - 
                     (travelTimePenalty * 0.1);

    const totalCompositeScore = Math.min(100, Math.max(0, Math.round(totalRaw * 1.15)));

    return {
      safetyScore,
      shelterAvailabilityScore,
      roadReliabilityScore,
      responseAccessScore,
      riskPenalty,
      distancePenalty,
      travelTimePenalty,
      totalCompositeScore,
    };
  }
}
