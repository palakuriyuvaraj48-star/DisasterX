import React, { useState } from 'react';
import { 
  Package, 
  Droplet, 
  Utensils, 
  HeartPulse, 
  Home, 
  Truck, 
  LifeBuoy, 
  Send, 
  Check, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { soundEffects } from '../../services/soundEffects';

export const ResourceMatrix: React.FC = () => {
  const { resources, shelters, store } = useDisasterStore();
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [dispatchAmount, setDispatchAmount] = useState<number>(500);
  const [targetDestination, setTargetDestination] = useState<string>('District Community Hall (Shelter 01)');

  const handleDispatch = (resId: string) => {
    store.allocateResource(resId, Number(dispatchAmount), targetDestination, 'District Logistics Commander');
    soundEffects.playVerificationBlip();
    setSelectedResourceId(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'WATER': return <Droplet className="w-5 h-5 text-blue-400" />;
      case 'FOOD': return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'MEDICAL': return <HeartPulse className="w-5 h-5 text-red-400" />;
      case 'SHELTER_KIT': return <Home className="w-5 h-5 text-emerald-400" />;
      case 'TRANSPORT': return <Truck className="w-5 h-5 text-indigo-400" />;
      case 'RESCUE_EQUIPMENT': return <LifeBuoy className="w-5 h-5 text-cyan-400" />;
      default: return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-900/90 p-4 rounded-xl border border-gray-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Emergency Resource Stockpile & Logistics Matrix</span>
          </h3>
          <p className="text-xs text-gray-400">
            Real-time supply levels, critical depot allocation, and field dispatch tracking.
          </p>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((res) => {
          const isCritical = res.priority === 'CRITICAL';

          return (
            <div
              key={res.id}
              className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-gray-800 rounded-xl border border-gray-700">
                    {getCategoryIcon(res.category)}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isCritical ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {res.priority} PRIORITY
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-white">{res.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{res.locationName}</p>
                </div>
              </div>

              {/* Quantity Metric */}
              <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Available Stock</span>
                  <span className="text-2xl font-black text-white font-mono">{res.quantity.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-1 font-mono">{res.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Assigned Sector</span>
                  <span className="text-xs font-bold text-blue-300">{res.assignedToSector}</span>
                </div>
              </div>

              {/* Dispatch Action */}
              <div>
                {selectedResourceId === res.id ? (
                  <div className="p-3 bg-gray-950 border border-blue-500/50 rounded-xl space-y-2.5 animate-in fade-in">
                    <label className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
                      Dispatch To Destination:
                    </label>

                    <input
                      type="number"
                      min={10}
                      max={res.quantity}
                      value={dispatchAmount}
                      onChange={(e) => setDispatchAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-white focus:outline-none"
                    />

                    <select
                      value={targetDestination}
                      onChange={(e) => setTargetDestination(e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-white focus:outline-none"
                    >
                      {shelters.map(s => (
                        <option key={s.id} value={`${s.name} (${s.id})`}>
                          {s.name}
                        </option>
                      ))}
                      <option value="Sector 4 Field Rescue Base">Sector 4 Field Rescue Base</option>
                      <option value="District General Hospital">District General Hospital</option>
                    </select>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedResourceId(null)}
                        className="flex-1 py-1.5 bg-gray-800 text-gray-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDispatch(res.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow"
                      >
                        Confirm Dispatch
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedResourceId(res.id);
                      setDispatchAmount(Math.min(res.quantity, 500));
                    }}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg border border-gray-700 flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>Allocate & Dispatch Supplies</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
