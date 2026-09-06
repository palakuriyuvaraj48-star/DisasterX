import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Home, 
  HeartPulse, 
  AlertTriangle, 
  Navigation, 
  Users, 
  Compass, 
  RefreshCw, 
  Shield, 
  Maximize2,
  Crosshair,
  Sparkles,
  Globe
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { ContextualPanel } from './ContextualPanel';
import { DISTRICT_CENTER, INITIAL_RISK_ZONES } from '../../data/mockDisasterData';
import { GoogleDisasterMap } from './GoogleDisasterMap';
import { isGoogleMapsLoaded, loadGoogleMapsScript, getGoogleMapsApiKey } from '../../services/googleMapsLoader';
import { soundEffects } from '../../services/soundEffects';

// Fix for default Leaflet icon assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const DisasterMap: React.FC = () => {
  const { 
    incidents, 
    shelters, 
    hospitals, 
    roadblocks, 
    teams, 
    evacuationRoutes,
    activeEvacuationRouteId,
    riskZones,
    store 
  } = useDisasterStore();

  const [useGoogleMaps, setUseGoogleMaps] = useState<boolean>(false);
  const [googleMapsReady, setGoogleMapsReady] = useState<boolean>(false);
  const [isCheckingGoogle, setIsCheckingGoogle] = useState<boolean>(true);

  // Check Google Maps availability on mount
  useEffect(() => {
    const checkGoogle = async () => {
      const hasKey = !!getGoogleMapsApiKey();
      if (hasKey) {
        const loaded = await loadGoogleMapsScript();
        if (loaded && isGoogleMapsLoaded()) {
          setGoogleMapsReady(true);
          setUseGoogleMaps(true);
        }
      }
      setIsCheckingGoogle(false);
    };

    checkGoogle();
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [filters, setFilters] = useState({
    showIncidents: true,
    showShelters: true,
    showHospitals: true,
    showHazards: true,
    showTeams: true,
    showEvacuationRoute: true,
    showRiskZones: true
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (useGoogleMaps && googleMapsReady) return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [DISTRICT_CENTER.lat, DISTRICT_CENTER.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

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
  }, [useGoogleMaps, googleMapsReady]);

  // Handle Geolocation in Leaflet
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported.');
      return;
    }

    setLocationStatus('Locating position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('📍 Location acquired');
        soundEffects.playVerificationBlip();

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 15);
        }
      },
      (err) => {
        setLocationStatus('Location access denied. Manual mode active.');
      },
      { timeout: 8000 }
    );
  };

  // Render Leaflet Markers
  useEffect(() => {
    if (useGoogleMaps && googleMapsReady) return;
    const map = mapInstanceRef.current;
    const group = markersLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Incidents
    if (filters.showIncidents) {
      incidents.forEach((inc) => {
        const isCritical = inc.severity === 'CRITICAL';
        const isVerified = inc.verificationStatus === 'VERIFIED';
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transform hover:scale-125 transition">
            <span class="absolute w-7 h-7 rounded-full ${isCritical ? 'bg-red-500/40 animate-ping' : 'bg-amber-500/30'}"></span>
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white ${
              isVerified ? (isCritical ? 'bg-red-600' : 'bg-amber-500') : 'bg-gray-600'
            }">
              !
            </div>
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: 'custom-incident-marker', iconSize: [28, 28], iconAnchor: [14, 14] });
        const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon }).addTo(group);
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'INCIDENT', id: inc.id });
          soundEffects.playVerificationBlip();
        });
      });
    }

    // 2. Shelters
    if (filters.showShelters) {
      shelters.forEach((shelter) => {
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transform hover:scale-110 transition">
            <div class="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md border border-emerald-400">
              🏠
            </div>
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: 'custom-shelter-marker', iconSize: [28, 28], iconAnchor: [14, 14] });
        const marker = L.marker([shelter.coordinates.lat, shelter.coordinates.lng], { icon }).addTo(group);
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'SHELTER', id: shelter.id });
          soundEffects.playVerificationBlip();
        });
      });
    }

    // 3. Hazards / Roadblocks
    if (filters.showHazards) {
      roadblocks.forEach((rb) => {
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer animate-bounce">
            <div class="w-7 h-7 rounded-lg bg-red-700 flex items-center justify-center text-white shadow-xl border border-red-500 font-black text-xs">
              ⛔
            </div>
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: 'custom-hazard-marker', iconSize: [28, 28], iconAnchor: [14, 14] });
        const marker = L.marker([rb.coordinates.lat, rb.coordinates.lng], { icon }).addTo(group);
        marker.on('click', () => {
          store.setSelectedMapItem({ type: 'HAZARD', id: rb.id });
          soundEffects.playEmergencyAlert();
        });
      });
    }

    // 4. Evacuation Polyline
    if (filters.showEvacuationRoute) {
      evacuationRoutes.forEach((route) => {
        const isActive = route.id === activeEvacuationRouteId;
        const isBlocked = route.status === 'BLOCKED' || (activeEvacuationRouteId === 'ROUTE-ADAPTIVE-01' && route.id === 'ROUTE-PRIMARY-01');
        const latLngs = route.waypoints.map(w => [w.lat, w.lng] as [number, number]);

        L.polyline(latLngs, {
          color: isBlocked ? '#EF4444' : isActive ? '#10B981' : '#6B7280',
          weight: isActive ? 6 : 3,
          opacity: isBlocked ? 0.6 : isActive ? 1.0 : 0.4,
          dashArray: isBlocked ? '8, 8' : undefined
        }).addTo(group);
      });
    }

    // 5. Risk Zones Polygons
    if (filters.showRiskZones) {
      riskZones.forEach((zone) => {
        const latLngs = zone.coordinates.map(c => [c.lat, c.lng] as [number, number]);
        const color = zone.riskLevel === 'CRITICAL' ? '#EF4444' : zone.riskLevel === 'HIGH' ? '#F97316' : zone.riskLevel === 'MEDIUM' ? '#EAB308' : '#22C55E';
        
        L.polygon(latLngs, {
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '5, 5'
        }).addTo(group).bindPopup(`<b>${zone.name}</b><br>${zone.description}<br><span style="color:${color}">Risk: ${zone.riskLevel}</span>`);
      });
    }

    // 6. User Location marker
    if (userLocation) {
      const iconHtml = `
        <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg animate-ping"></div>
      `;
      const icon = L.divIcon({ html: iconHtml, className: 'user-loc-marker', iconSize: [16, 16], iconAnchor: [8, 8] });
      L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(group);
    }

  }, [incidents, shelters, hospitals, roadblocks, teams, evacuationRoutes, activeEvacuationRouteId, riskZones, filters, userLocation, useGoogleMaps, googleMapsReady]);

  // If user selected Google Maps and script is loaded:
  if (useGoogleMaps && googleMapsReady) {
    return <GoogleDisasterMap onFallbackToLeaflet={() => setUseGoogleMaps(false)} />;
  }

  // Fallback to Leaflet Map Engine
  return (
    <div className="relative w-full h-full bg-[#0B0F19] overflow-hidden rounded-2xl border border-gray-800 shadow-2xl flex flex-col">
      
      {/* Top Map Tactical HUD */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left HUD */}
        <div className="pointer-events-auto bg-gray-950/90 backdrop-blur-md border border-gray-800 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wider">
                🗺️ DISASTER RESPONSE MAP
              </span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                TACTICAL GIS ONLINE
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans block">
              Constraint-Aware Evacuation Intelligence Layer
            </span>
          </div>
        </div>

        {/* Right HUD */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-gray-950/90 backdrop-blur-md border border-gray-800 p-1 rounded-xl shadow-xl">
          <button
            onClick={handleLocateMe}
            className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800 rounded-lg transition"
            title="Use My Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {googleMapsReady && (
            <button
              onClick={() => setUseGoogleMaps(true)}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded-lg transition shadow flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Maps View</span>
            </button>
          )}
        </div>
      </div>

      {/* Layer Filters Strip */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto bg-gray-950/90 backdrop-blur-md border border-gray-800 p-2.5 rounded-2xl shadow-2xl flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-[10px] uppercase text-gray-400 font-bold px-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Layers:</span>
        </span>

        <button
          onClick={() => setFilters(prev => ({ ...prev, showIncidents: !prev.showIncidents }))}
          className={`px-2 py-1 rounded-lg border transition ${
            filters.showIncidents ? 'bg-red-950/80 text-red-300 border-red-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          📍 Incidents ({incidents.length})
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, showShelters: !prev.showShelters }))}
          className={`px-2 py-1 rounded-lg border transition ${
            filters.showShelters ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🏠 Shelters ({shelters.length})
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, showHazards: !prev.showHazards }))}
          className={`px-2 py-1 rounded-lg border transition ${
            filters.showHazards ? 'bg-amber-950/80 text-amber-300 border-amber-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🚧 Hazards ({roadblocks.length})
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, showRiskZones: !prev.showRiskZones }))}
          className={`px-2 py-1 rounded-lg border transition ${
            filters.showRiskZones ? 'bg-purple-950/80 text-purple-300 border-purple-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🎯 Risk Zones ({riskZones.length})
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, showEvacuationRoute: !prev.showEvacuationRoute }))}
          className={`px-2 py-1 rounded-lg border transition ${
            filters.showEvacuationRoute ? 'bg-blue-950/80 text-blue-300 border-blue-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🗺️ Routes
        </button>
      </div>

      {locationStatus && (
        <div className="absolute top-16 left-3 z-[1000] bg-gray-900/90 border border-gray-700 text-cyan-300 text-[11px] font-mono px-3 py-1.5 rounded-xl shadow-lg">
          {locationStatus}
        </div>
      )}

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Contextual Side Panel for Selected Marker */}
      <ContextualPanel />

    </div>
  );
};
