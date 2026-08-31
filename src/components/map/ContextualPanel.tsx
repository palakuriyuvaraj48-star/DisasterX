import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Navigation, 
  Bed, 
  Activity, 
  Clock, 
  Layers
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';

export const ContextualPanel: React.FC = () => {
  const { 
    selectedMapItem, 
    incidents, 
    shelters, 
    hospitals, 
    roadblocks, 
    teams, 
    resources, 
    currentRole,
    store 
  } = useDisasterStore();

  if (!selectedMapItem) return null;

  const handleClose = () => {
    store.setSelectedMapItem(null);
  };

  // Find corresponding item
  let itemData: any = null;
  if (selectedMapItem.type === 'INCIDENT') {
    itemData = incidents.find(i => i.id === selectedMapItem.id);
  } else if (selectedMapItem.type === 'SHELTER') {
    itemData = shelters.find(s => s.id === selectedMapItem.id);
  } else if (selectedMapItem.type === 'HOSPITAL') {
    itemData = hospitals.find(h => h.id === selectedMapItem.id);
  } else if (selectedMapItem.type === 'HAZARD') {
    itemData = roadblocks.find(r => r.id === selectedMapItem.id);
  } else if (selectedMapItem.type === 'TEAM') {
    itemData = teams.find(t => t.id === selectedMapItem.id);
  } else if (selectedMapItem.type === 'RESOURCE') {
    itemData = resources.find(res => res.id === selectedMapItem.id);
  }

  if (!itemData) return null;

  return (
    <div className="absolute top-4 right-4 z-[1000] w-96 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/90 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-300">
            {selectedMapItem.type} DETAILS
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
        
        {/* Type 1: INCIDENT */}
        {selectedMapItem.type === 'INCIDENT' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  itemData.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                  itemData.severity === 'HIGH' ? 'bg-amber-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {itemData.severity}
                </span>

                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono flex items-center gap-1 ${
                  itemData.verificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                  itemData.verificationStatus === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {itemData.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {itemData.verificationStatus === 'PENDING' && <Clock className="w-3 h-3 text-amber-400" />}
                  {itemData.verificationStatus} ({itemData.confidenceScore}%)
                </span>
              </div>

              <h3 className="font-bold text-base text-white leading-snug">{itemData.title}</h3>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                {itemData.locationName}
              </p>
            </div>

            <p className="text-xs text-gray-300 bg-gray-950/60 p-3 rounded-lg border border-gray-800 leading-relaxed">
              {itemData.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-gray-800/60 p-2 rounded border border-gray-700">
                <span className="text-gray-400 block text-[10px]">PEOPLE AT RISK</span>
                <span className="font-bold text-white text-sm">~{itemData.estimatedPeopleAffected || 'N/A'}</span>
              </div>
              <div className="bg-gray-800/60 p-2 rounded border border-gray-700">
                <span className="text-gray-400 block text-[10px]">SOURCE</span>
                <span className="font-bold text-white text-xs">{itemData.source}</span>
              </div>
            </div>

            {/* Quick Admin Actions if user is Admin / Responder */}
            {(currentRole === 'ADMIN' || currentRole === 'RESPONDER') && (
              <div className="pt-2 border-t border-gray-800 space-y-2">
                <label className="text-[11px] uppercase font-mono text-gray-400 font-bold block">
                  Authority Triage Action
                </label>
                <div className="flex gap-2">
                  {itemData.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => store.verifyIncident(itemData.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition shadow"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verify Incident
                    </button>
                  )}
                  {itemData.verificationStatus !== 'REJECTED' && (
                    <button
                      onClick={() => store.rejectIncident(itemData.id)}
                      className="py-1.5 px-3 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded text-xs font-semibold transition"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Type 2: SHELTER */}
        {selectedMapItem.type === 'SHELTER' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  itemData.status === 'OPEN' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {itemData.status}
                </span>
                <span className="text-xs text-gray-400 font-mono">Distance: ~{itemData.distanceKm} km</span>
              </div>
              <h3 className="font-bold text-base text-white">{itemData.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-blue-400" />
                {itemData.locationName}
              </p>
            </div>

            {/* Occupancy bar */}
            <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-300 font-semibold">Capacity Occupancy</span>
                <span className="font-bold text-white">{itemData.currentOccupancy} / {itemData.totalCapacity}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all ${
                    (itemData.currentOccupancy / itemData.totalCapacity) > 0.85 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (itemData.currentOccupancy / itemData.totalCapacity) * 100)}%` }}
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400 font-bold block mb-1.5">Verified Facilities</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${itemData.amenities.hasMedical ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Medical Aid</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${itemData.amenities.hasFood ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Food Supplies</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${itemData.amenities.hasWater ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Drinking Water</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${itemData.amenities.wheelchairAccessible ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Wheelchair Acc.</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${itemData.contactPhone}`}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Shelter Coordinator ({itemData.contactPhone})</span>
            </a>
          </div>
        )}

        {/* Type 3: HOSPITAL */}
        {selectedMapItem.type === 'HOSPITAL' && (
          <div className="space-y-3">
            <div>
              <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold font-mono uppercase">
                {itemData.traumaLevel.replace('_', ' ')} Trauma Center
              </span>
              <h3 className="font-bold text-base text-white mt-1">{itemData.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                {itemData.locationName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <span className="text-gray-400 text-[10px] block">AVAILABLE BEDS</span>
                <span className="text-lg font-bold text-emerald-400">{itemData.availableBeds}</span>
              </div>
              <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-700">
                <span className="text-gray-400 text-[10px] block">ICU CAPACITY</span>
                <span className="text-lg font-bold text-blue-400">{itemData.icuAvailable} Beds</span>
              </div>
            </div>

            <a
              href={`tel:${itemData.contactPhone}`}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Emergency Desk ({itemData.contactPhone})</span>
            </a>
          </div>
        )}

        {/* Type 4: ROADBLOCK / HAZARD */}
        {selectedMapItem.type === 'HAZARD' && (
          <div className="space-y-3">
            <div className="bg-red-950/40 border border-red-700 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs font-mono uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Roadway Closed / Blocked</span>
              </div>
              <h3 className="font-bold text-base text-white mt-1">{itemData.name}</h3>
              <p className="text-xs text-red-200 mt-1">{itemData.description}</p>
            </div>

            <div className="text-xs space-y-1.5 bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-400">Road Corridor:</span>
                <span className="font-bold text-white">{itemData.affectedRoadName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hazard Cause:</span>
                <span className="font-bold text-amber-400 font-mono">{itemData.reason}</span>
              </div>
            </div>
          </div>
        )}

        {/* Type 5: RESPONSE TEAM */}
        {selectedMapItem.type === 'TEAM' && (
          <div className="space-y-3">
            <div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                itemData.status === 'ON_SCENE' ? 'bg-amber-600 text-white' :
                itemData.status === 'EN_ROUTE' ? 'bg-blue-600 text-white' :
                'bg-emerald-600 text-white'
              }`}>
                {itemData.status.replace('_', ' ')}
              </span>
              <h3 className="font-bold text-base text-white mt-1">{itemData.name}</h3>
              <p className="text-xs text-gray-400">Lead: {itemData.contactLead} ({itemData.personnelCount} Personnel)</p>
            </div>

            <div className="bg-gray-800/60 p-2.5 rounded-lg text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">ETA to Scene:</span>
                <span className="font-bold text-white">{itemData.etaMinutes ? `${itemData.etaMinutes} mins` : 'On Scene'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Assigned Incident:</span>
                <span className="font-bold text-blue-400">{itemData.currentAssignmentIncidentId || 'Standby'}</span>
              </div>
            </div>

            <a
              href={`tel:${itemData.phone}`}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Comms ({itemData.phone})</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
