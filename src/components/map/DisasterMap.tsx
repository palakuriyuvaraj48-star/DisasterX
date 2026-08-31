import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Home, 
  Cross, 
  AlertTriangle, 
  Navigation, 
  Users, 
  Compass, 
  RefreshCw,
  Shield,
  Maximize2
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { ContextualPanel } from './ContextualPanel';
import { DISTRICT_CENTER } from '../../data/mockDisasterData';

// Fix for default Leaflet icon assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapFilterState {
  showIncidents: boolean;
  showShelters: boolean;
  showHospitals: boolean;
  showHazards: boolean;
  showTeams: boolean;
  showEvacuationRoute: boolean;
}

export const DisasterMap: React.FC = () => {
  const { 
    incidents, 
    shelters, 
    hospitals, 
    roadblocks, 
    teams, 
    evacuationRoutes,
    activeEvacuationRouteId,
    store 
  } = useDisasterStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [filters, setFilters] = useState<MapFilterState>({
    showIncidents: true,
    showShelters: true,
    showHospitals: true,
    showHazards: true,
    showTeams: true,
    showEvacuationRoute: true
  });

  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CRITICAL' | 'VERIFIED' | 'PENDING'>('ALL');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [DISTRICT_CENTER.lat, DISTRICT_CENTER.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Dark tactical tiles from OpenStreetMap CartoDB DarkMatter
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    } catch (e) {
      console.warn('Leaflet map init warning:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polylines when state or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Incidents
    if (filters.showIncidents) {
      incidents.forEach((inc) => {
        if (selectedCategory === 'CRITICAL' && inc.severity !== 'CRITICAL') return;
        if (selectedCategory === 'VERIFIED' && inc.verificationStatus !== 'VERIFIED') return;
        if (selectedCategory === 'PENDING' && inc.verificationStatus !== 'PENDING') return;

        const isCritical = inc.severity === 'CRITICAL';
        const isVerified = inc.verificationStatus === 'VERIFIED';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group" style="width:36px;height:36px;">
              <div class="${isCritical ? 'pulse-marker-danger' : 'pulse-marker-warning'} flex items-center justify-center text-white font-bold text-[10px]">
                ${inc.type === 'FLOOD' ? '🌊' : inc.type === 'FIRE' ? '🔥' : inc.type === 'EARTHQUAKE' ? '🌎' : '⚠️'}
              </div>
              <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'} border border-white flex items-center justify-center text-[8px] font-bold text-white">
                ${isVerified ? '✓' : '?'}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon: customIcon });
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'INCIDENT', id: inc.id });
        });
        marker.addTo(layerGroup);
      });
    }

    // 2. Render Shelters
    if (filters.showShelters) {
      shelters.forEach((shelter) => {
        const isOpen = shelter.status === 'OPEN';
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer" style="width:34px;height:34px;">
              <div class="${isOpen ? 'pulse-marker-safe' : 'pulse-marker-danger'} flex items-center justify-center text-white text-[12px] font-bold">
                🏠
              </div>
              <div class="absolute -top-3 bg-gray-900/90 text-white text-[9px] font-mono px-1 rounded border border-gray-700 whitespace-nowrap">
                ${shelter.currentOccupancy}/${shelter.totalCapacity}
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([shelter.coordinates.lat, shelter.coordinates.lng], { icon: customIcon });
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'SHELTER', id: shelter.id });
        });
        marker.addTo(layerGroup);
      });
    }

    // 3. Render Hospitals
    if (filters.showHospitals) {
      hospitals.forEach((hosp) => {
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="flex items-center justify-center cursor-pointer bg-red-700 border-2 border-white rounded-md shadow-md text-white font-bold text-xs" style="width:28px;height:28px;">
              🏥
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([hosp.coordinates.lat, hosp.coordinates.lng], { icon: customIcon });
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'HOSPITAL', id: hosp.id });
        });
        marker.addTo(layerGroup);
      });
    }

    // 4. Render Roadblocks / Hazards
    if (filters.showHazards) {
      roadblocks.forEach((hazard) => {
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="flex items-center justify-center bg-black border-2 border-red-500 rounded-full shadow-lg text-white font-bold text-[12px] animate-pulse" style="width:30px;height:30px;">
              🚧
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([hazard.coordinates.lat, hazard.coordinates.lng], { icon: customIcon });
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'HAZARD', id: hazard.id });
        });
        marker.addTo(layerGroup);
      });
    }

    // 5. Render Response Teams
    if (filters.showTeams) {
      teams.forEach((team) => {
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="pulse-marker-unit flex items-center justify-center cursor-pointer text-white font-bold text-[10px]" style="width:32px;height:32px;">
              ${team.category === 'FIRE_RESCUE' ? '🚒' : team.category === 'AMBULANCE' ? '🚑' : '🚤'}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([team.coordinates.lat, team.coordinates.lng], { icon: customIcon });
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'TEAM', id: team.id });
        });
        marker.addTo(layerGroup);
      });
    }

    // 6. Render Evacuation Routes Polylines
    if (filters.showEvacuationRoute) {
      evacuationRoutes.forEach((route) => {
        const isSelected = route.id === activeEvacuationRouteId;
        const isSafe = route.status === 'VERIFIED_SAFE';

        const latLngs = route.waypoints.map(w => [w.lat, w.lng] as [number, number]);

        // Draw polyline
        const polyline = L.polyline(latLngs, {
          color: isSafe ? '#10B981' : '#EF4444',
          weight: isSelected ? 6 : 4,
          dashArray: isSafe ? undefined : '8, 8',
          opacity: isSelected ? 0.95 : 0.65
        });

        polyline.on('click', () => {
          store.setActiveEvacuationRoute(route.id);
        });

        polyline.addTo(layerGroup);
      });
    }

  }, [filters, selectedCategory, incidents, shelters, hospitals, roadblocks, teams, evacuationRoutes, activeEvacuationRouteId]);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-gray-800 bg-[#0F172A]">
      
      {/* Top Map Tactical Control Header */}
      <div className="absolute top-3 left-3 z-[900] flex flex-wrap items-center gap-2 max-w-[calc(100%-1rem)]">
        
        {/* Layer Filter Menu */}
        <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg p-1.5 flex items-center gap-1 shadow-xl">
          <button
            onClick={() => setFilters(f => ({ ...f, showIncidents: !f.showIncidents }))}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
              filters.showIncidents ? 'bg-red-600/90 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Incidents ({incidents.length})</span>
          </button>

          <button
            onClick={() => setFilters(f => ({ ...f, showShelters: !f.showShelters }))}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
              filters.showShelters ? 'bg-emerald-600/90 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Shelters ({shelters.length})</span>
          </button>

          <button
            onClick={() => setFilters(f => ({ ...f, showHospitals: !f.showHospitals }))}
            className={`hidden sm:flex px-2.5 py-1 rounded text-xs font-semibold items-center gap-1 transition ${
              filters.showHospitals ? 'bg-blue-600/90 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Cross className="w-3.5 h-3.5" />
            <span>Hospitals ({hospitals.length})</span>
          </button>

          <button
            onClick={() => setFilters(f => ({ ...f, showTeams: !f.showTeams }))}
            className={`hidden md:flex px-2.5 py-1 rounded text-xs font-semibold items-center gap-1 transition ${
              filters.showTeams ? 'bg-indigo-600/90 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Units ({teams.length})</span>
          </button>

          <button
            onClick={() => setFilters(f => ({ ...f, showEvacuationRoute: !f.showEvacuationRoute }))}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
              filters.showEvacuationRoute ? 'bg-teal-600/90 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Routes</span>
          </button>
        </div>

        {/* Severity Filter */}
        <div className="hidden lg:flex bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg p-1.5 items-center gap-1 shadow-xl">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${selectedCategory === 'ALL' ? 'bg-gray-700 text-white font-bold' : 'text-gray-400'}`}
          >
            ALL
          </button>
          <button
            onClick={() => setSelectedCategory('CRITICAL')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${selectedCategory === 'CRITICAL' ? 'bg-red-700 text-white font-bold' : 'text-gray-400'}`}
          >
            CRITICAL
          </button>
          <button
            onClick={() => setSelectedCategory('VERIFIED')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${selectedCategory === 'VERIFIED' ? 'bg-emerald-700 text-white font-bold' : 'text-gray-400'}`}
          >
            VERIFIED
          </button>
          <button
            onClick={() => setSelectedCategory('PENDING')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${selectedCategory === 'PENDING' ? 'bg-amber-700 text-white font-bold' : 'text-gray-400'}`}
          >
            PENDING
          </button>
        </div>
      </div>

      {/* Recenter & Compass Control */}
      <div className="absolute bottom-3 left-3 z-[900] flex items-center gap-2">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([DISTRICT_CENTER.lat, DISTRICT_CENTER.lng], 13);
            }
          }}
          className="bg-gray-900/90 hover:bg-gray-800 text-gray-300 p-2 rounded-lg border border-gray-700 text-xs flex items-center gap-1.5 shadow-lg transition"
          title="Reset map view to command center centerpoint"
        >
          <Compass className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-xs font-semibold">Center Sector</span>
        </button>
      </div>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Slide-out Contextual Panel on Marker Click */}
      <ContextualPanel />
    </div>
  );
};
