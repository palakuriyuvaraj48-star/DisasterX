import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDisasterStore } from '../../services/useDisasterStore';
import { MapPin, ArrowLeft, HeartPulse } from 'lucide-react';

export const ShelterDetail: React.FC = () => {
  const { shelterId } = useParams<{ shelterId: string }>();
  const { shelters } = useDisasterStore();
  const shelter = shelters.find(s => s.id === shelterId);

  if (!shelter) {
    return (
      <div className="space-y-4">
        <Link to="/shelters" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shelters
        </Link>
        <div className="p-8 bg-gray-900/80 border border-gray-800 rounded-2xl text-center text-sm text-gray-400">
          Shelter not found.
        </div>
      </div>
    );
  }

  const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);

  return (
    <div className="space-y-6">
      <Link to="/shelters" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Shelters
      </Link>

      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${
            shelter.status === 'OPEN' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
            shelter.status === 'FULL' ? 'bg-red-950 text-red-300 border-red-700' :
            'bg-gray-800 text-gray-300 border-gray-700'
          }`}>
            {shelter.status}
          </span>
          <span className="text-xs text-gray-400 font-mono">{shelter.id}</span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white">{shelter.name}</h1>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            {shelter.coordinates.lat.toFixed(4)}, {shelter.coordinates.lng.toFixed(4)}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">CAPACITY</span>
            <span className="text-sm font-bold text-white">{shelter.totalCapacity} beds</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">OCCUPANCY</span>
            <span className="text-sm font-bold text-white">{shelter.currentOccupancy} ({occupancyPercent}%)</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">AVAILABLE</span>
            <span className="text-sm font-bold text-white">{shelter.totalCapacity - shelter.currentOccupancy}</span>
          </div>
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block">MANAGER</span>
            <span className="text-sm font-bold text-white">N/A</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {shelter.amenities.hasMedical && (
            <span className="px-2 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-800 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" /> Medical
            </span>
          )}
          {shelter.amenities.hasFood && (
            <span className="px-2 py-1 bg-blue-950/80 text-blue-300 rounded-lg text-xs font-bold border border-blue-800 flex items-center gap-1">
              🍽️ Food
            </span>
          )}
          {shelter.amenities.hasWater && (
            <span className="px-2 py-1 bg-cyan-950/80 text-cyan-300 rounded-lg text-xs font-bold border border-cyan-800 flex items-center gap-1">
              💧 Water
            </span>
          )}
          {shelter.amenities.wheelchairAccessible && (
            <span className="px-2 py-1 bg-purple-950/80 text-purple-300 rounded-lg text-xs font-bold border border-purple-800 flex items-center gap-1">
              ♿ Accessible
            </span>
          )}
          {shelter.amenities.hasPower && (
            <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs font-bold border border-gray-700 flex items-center gap-1">
              ⚡ Power
            </span>
          )}
        </div>

        {shelter.contactPhone && (
          <div className="text-xs text-gray-300">
            <span className="text-gray-400">Contact:</span> {shelter.contactPhone}
          </div>
        )}
      </div>
    </div>
  );
};
