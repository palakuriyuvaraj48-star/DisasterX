import React, { useEffect, useRef, useState } from 'react';
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
  ShieldCheck, 
  Sparkles,
  AlertOctagon,
  Eye,
  Crosshair,
  Zap
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DISTRICT_CENTER } from '../../data/mockDisasterData';
import { TACTICAL_DARK_MAP_STYLE } from '../../services/googleMapsLoader';
import { ContextualPanel } from './ContextualPanel';
import { soundEffects } from '../../services/soundEffects';

interface GoogleDisasterMapProps {
  onFallbackToLeaflet?: () => void;
}

export const GoogleDisasterMap: React.FC<GoogleDisasterMapProps> = ({ onFallbackToLeaflet }) => {
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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  const [layers, setLayers] = useState({
    showIncidents: true,
    showShelters: true,
    showHospitals: true,
    showHazards: true,
    showTeams: true,
    showEvacuationRoute: true
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  // 1. Initialize Google Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;
    if (typeof window === 'undefined' || !(window as any).google?.maps) return;

    try {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: DISTRICT_CENTER.lat, lng: DISTRICT_CENTER.lng },
        zoom: 13,
        styles: TACTICAL_DARK_MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
    } catch (e) {
      console.warn('Google Maps initialization failed:', e);
    }
  }, []);

  // 2. Geolocation Request
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Locating ground position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('📍 Location acquired');
        soundEffects.playVerificationBlip();

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(15);
        }
      },
      (err) => {
        setLocationStatus('Location access denied. Using district command center.');
      },
      { timeout: 8000 }
    );
  };

  // 3. Render Markers & Polylines when Store updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(window as any).google?.maps) return;

    // Clear existing overlays
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    // --- Risk Zones (Circles) ---
    if (layers.showHazards) {
      const floodCircle = new google.maps.Circle({
        strokeColor: '#EF4444',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.25,
        map,
        center: { lat: 13.0760, lng: 80.2600 },
        radius: 1200, // 1.2km danger zone
      });
      circlesRef.current.push(floodCircle);
    }

    // --- 1. Incidents Markers ---
    if (layers.showIncidents) {
      incidents.forEach((inc) => {
        const isCritical = inc.severity === 'CRITICAL';
        const isVerified = inc.verificationStatus === 'VERIFIED';

        const marker = new google.maps.Marker({
          position: { lat: inc.coordinates.lat, lng: inc.coordinates.lng },
          map,
          title: inc.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isCritical ? 10 : 7,
            fillColor: isVerified ? (isCritical ? '#EF4444' : '#F59E0B') : '#6B7280',
            fillOpacity: 0.95,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          store.setSelectedMapItem({ type: 'INCIDENT', id: inc.id });
          soundEffects.playVerificationBlip();
        });

        markersRef.current.push(marker);
      });
    }

    // --- 2. Shelter Markers ---
    if (layers.showShelters) {
      shelters.forEach((shelter) => {
        const isHighCapacity = shelter.currentOccupancy / shelter.totalCapacity > 0.85;
        const marker = new google.maps.Marker({
          position: { lat: shelter.coordinates.lat, lng: shelter.coordinates.lng },
          map,
          title: shelter.name,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: isHighCapacity ? '#F59E0B' : '#10B981',
            fillOpacity: 1,
            strokeColor: '#000000',
            strokeWeight: 1.5,
          }
        });

        marker.addListener('click', () => {
          store.setSelectedMapItem({ type: 'SHELTER', id: shelter.id });
          soundEffects.playVerificationBlip();
        });

        markersRef.current.push(marker);
      });
    }

    // --- 3. Hospital Markers ---
    if (layers.showHospitals) {
      hospitals.forEach((hosp) => {
        const marker = new google.maps.Marker({
          position: { lat: hosp.coordinates.lat, lng: hosp.coordinates.lng },
          map,
          title: hosp.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          store.setSelectedMapItem({ type: 'HOSPITAL', id: hosp.id });
          soundEffects.playVerificationBlip();
        });

        markersRef.current.push(marker);
      });
    }

    // --- 4. Blocked Road Hazards ---
    if (layers.showHazards) {
      roadblocks.forEach((rb) => {
        const marker = new google.maps.Marker({
          position: { lat: rb.coordinates.lat, lng: rb.coordinates.lng },
          map,
          title: `BLOCKED: ${rb.name}`,
          icon: {
            path: 'M -4,-4 L 4,4 M 4,-4 L -4,4',
            strokeColor: '#DC2626',
            strokeWeight: 4,
            scale: 3,
          }
        });

        marker.addListener('click', () => {
          store.setSelectedMapItem({ type: 'HAZARD', id: rb.id });
          soundEffects.playEmergencyAlert();
        });

        markersRef.current.push(marker);
      });
    }

    // --- 5. Evacuation Route Polyline ---
    if (layers.showEvacuationRoute) {
      evacuationRoutes.forEach((route) => {
        const isActive = route.id === activeEvacuationRouteId;
        const isBlocked = route.status === 'BLOCKED' || (activeEvacuationRouteId === 'ROUTE-ADAPTIVE-01' && route.id === 'ROUTE-PRIMARY-01');

        const polyline = new google.maps.Polyline({
          path: route.waypoints.map(w => ({ lat: w.lat, lng: w.lng })),
          geodesic: true,
          strokeColor: isBlocked ? '#EF4444' : isActive ? '#10B981' : '#6B7280',
          strokeOpacity: isBlocked ? 0.6 : isActive ? 1.0 : 0.4,
          strokeWeight: isActive ? 6 : 3,
          map,
        });

        polylinesRef.current.push(polyline);
      });
    }

    // --- User Location Marker ---
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#06B6D4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        }
      });
      markersRef.current.push(userMarker);
    }

  }, [incidents, shelters, hospitals, roadblocks, teams, evacuationRoutes, activeEvacuationRouteId, layers, userLocation]);

  return (
    <div className="relative w-full h-full bg-[#0B0F19] overflow-hidden rounded-2xl border border-gray-800 shadow-2xl flex flex-col">
      
      {/* Top Map Tactical HUD */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left HUD: Title & Online Status */}
        <div className="pointer-events-auto bg-gray-950/90 backdrop-blur-md border border-gray-800 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wider">
                🗺️ GOOGLE MAPS PLATFORM
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

        {/* Right HUD: Controls & Provider Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-gray-950/90 backdrop-blur-md border border-gray-800 p-1 rounded-xl shadow-xl">
          <button
            onClick={handleLocateMe}
            className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800 rounded-lg transition"
            title="Use My Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {onFallbackToLeaflet && (
            <button
              onClick={onFallbackToLeaflet}
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-mono font-bold rounded-lg border border-gray-700 transition"
              title="Switch to Vector Leaflet Engine"
            >
              OpenStreetMap View
            </button>
          )}
        </div>
      </div>

      {/* Layer Filters Strip (Bottom Left Overlay) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-gray-950/90 backdrop-blur-md border border-gray-800 p-2.5 rounded-2xl shadow-2xl flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-[10px] uppercase text-gray-400 font-bold px-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Layers:</span>
        </span>

        <button
          onClick={() => setLayers(prev => ({ ...prev, showIncidents: !prev.showIncidents }))}
          className={`px-2 py-1 rounded-lg border transition ${
            layers.showIncidents ? 'bg-red-950/80 text-red-300 border-red-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          📍 Incidents ({incidents.length})
        </button>

        <button
          onClick={() => setLayers(prev => ({ ...prev, showShelters: !prev.showShelters }))}
          className={`px-2 py-1 rounded-lg border transition ${
            layers.showShelters ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🏠 Shelters ({shelters.length})
        </button>

        <button
          onClick={() => setLayers(prev => ({ ...prev, showHazards: !prev.showHazards }))}
          className={`px-2 py-1 rounded-lg border transition ${
            layers.showHazards ? 'bg-amber-950/80 text-amber-300 border-amber-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🚧 Hazards ({roadblocks.length})
        </button>

        <button
          onClick={() => setLayers(prev => ({ ...prev, showEvacuationRoute: !prev.showEvacuationRoute }))}
          className={`px-2 py-1 rounded-lg border transition ${
            layers.showEvacuationRoute ? 'bg-blue-950/80 text-blue-300 border-blue-800 font-bold' : 'bg-gray-900 text-gray-500 border-gray-800'
          }`}
        >
          🗺️ Routes
        </button>
      </div>

      {/* Geolocation Status feedback message */}
      {locationStatus && (
        <div className="absolute top-16 left-3 z-20 bg-gray-900/90 border border-gray-700 text-cyan-300 text-[11px] font-mono px-3 py-1.5 rounded-xl shadow-lg">
          {locationStatus}
        </div>
      )}

      {/* Google Maps Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Contextual Side Panel for Selected Marker */}
      <ContextualPanel />

    </div>
  );
};
