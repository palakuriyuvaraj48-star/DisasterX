import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Navigation, 
  Filter, 
  Users, 
  ShieldCheck
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { Shelter } from '../../types/disaster';

interface ShelterFinderProps {
  onSelectShelterOnMap?: (shelter: Shelter) => void;
}

export const ShelterFinder: React.FC<ShelterFinderProps> = ({ onSelectShelterOnMap }) => {
  const { shelters, store } = useDisasterStore();
  const [filterOnlyOpen, setFilterOnlyOpen] = useState(false);
  const [filterMedical, setFilterMedical] = useState(false);

  const filteredShelters = shelters.filter(s => {
    if (filterOnlyOpen && s.status !== 'OPEN') return false;
    if (filterMedical && !s.amenities.hasMedical) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 p-4 rounded-xl border border-gray-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-400" />
            <span>Verified Emergency Shelters & Safe Havens</span>
          </h3>
          <p className="text-xs text-gray-400">
            Real-time occupancy, accessibility facilities, and direct relief coordinator lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOnlyOpen(!filterOnlyOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filterOnlyOpen
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            {filterOnlyOpen ? '✓ Open Only' : 'Show All Status'}
          </button>

          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filterMedical
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            {filterMedical ? '✓ Medical Unit Active' : 'Filter Medical'}
          </button>
        </div>
      </div>

      {/* Shelter Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShelters.map((shelter) => {
          const occupancyRate = (shelter.currentOccupancy / shelter.totalCapacity) * 100;
          const isFull = shelter.status === 'FULL' || occupancyRate >= 100;

          return (
            <div
              key={shelter.id}
              className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-5 shadow-lg space-y-3 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold font-mono ${
                    isFull ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {isFull ? '🔴 AT FULL CAPACITY' : '🟢 OPEN & ADMITTING'}
                  </span>

                  <span className="text-xs font-mono text-gray-400">
                    ~{shelter.distanceKm} km away
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{shelter.name}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{shelter.locationName}</span>
                </p>
              </div>

              {/* Occupancy Indicator */}
              <div className="space-y-1 bg-gray-950/60 p-3 rounded-lg border border-gray-800/80">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Bed Occupancy:</span>
                  <span className="font-bold text-white">
                    {shelter.currentOccupancy} / {shelter.totalCapacity} ({Math.round(occupancyRate)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      occupancyRate > 90 ? 'bg-red-500' : occupancyRate > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyRate)}%` }}
                  />
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-300">
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3 h-3 ${shelter.amenities.hasMedical ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Medical Ward</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3 h-3 ${shelter.amenities.hasFood ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Meals & Rations</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3 h-3 ${shelter.amenities.hasWater ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Purified Water</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/40 px-2 py-1 rounded">
                  <CheckCircle2 className={`w-3 h-3 ${shelter.amenities.wheelchairAccessible ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span>Ramp Accessible</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${shelter.contactPhone}`}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-gray-700 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Shelter</span>
                </a>

                <button
                  onClick={() => {
                    store.setSelectedMapItem({ type: 'SHELTER', id: shelter.id });
                    onSelectShelterOnMap?.(shelter);
                  }}
                  className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
