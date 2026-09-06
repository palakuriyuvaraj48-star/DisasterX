/**
 * Google Maps Platform Dynamic Loader & Tactical Styling Engine
 */

export const TACTICAL_DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#111827" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B0F19" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9CA3AF" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#D1D5DB" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#60A5FA" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1E293B" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1F2937" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9CA3AF" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4B5563" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1F2937" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F3F4F6" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1F2937" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0F172A" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38BDF8" }],
  },
];

let loadPromise: Promise<boolean> | null = null;

export const getGoogleMapsApiKey = (): string => {
  return (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
};

export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).google && !!(window as any).google.maps;
};

export const loadGoogleMapsScript = (customKey?: string): Promise<boolean> => {
  if (isGoogleMapsLoaded()) {
    return Promise.resolve(true);
  }

  if (loadPromise) {
    return loadPromise;
  }

  const apiKey = customKey || getGoogleMapsApiKey();

  // If no API key is configured or offline, return false gracefully
  if (!apiKey || typeof window === 'undefined' || !navigator.onLine) {
    return Promise.resolve(false);
  }

  loadPromise = new Promise<boolean>((resolve) => {
    try {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = (err) => {
        console.warn('Google Maps Platform script load failed (network/key error):', err);
        resolve(false);
      };

      document.head.appendChild(script);
    } catch (e) {
      console.warn('Error appending Google Maps script:', e);
      resolve(false);
    }
  });

  return loadPromise;
};
