import {
  useState,
  useEffect,
  useRef,
  memo,
} from 'react';
import { MapPin, AlertCircle, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidUKCoordinates } from '@/lib/mapbox';
import mapboxgl from 'mapbox-gl';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
  title?: string;
  height?: string;
  zoom?: number;
  interactive?: boolean;
}

/**
 * PropertyMap Component
 * Renders an interactive Mapbox GL map with a marker at the property location
 * Supports lazy loading and mobile optimization
 */
export const PropertyMap = memo(function PropertyMap({
  latitude,
  longitude,
  address,
  title,
  height = 'aspect-video',
  zoom = 15,
  interactive = true,
}: PropertyMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Validate coordinates
  if (!isValidUKCoordinates(latitude, longitude)) {
    return <MapErrorFallback error="Invalid location coordinates" />;
  }

  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (!token) {
    return <MapErrorFallback error="Map service not configured" />;
  }

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !mapLoaded) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (mapContainer.current) {
      observer.observe(mapContainer.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [mapLoaded]);

  // Initialize map when visible
  useEffect(() => {
    if (!isVisible || !mapContainer.current || map.current) {
      return;
    }

    // Set Mapbox access token
    mapboxgl.accessToken = token;

    try {
      // Initialize map
      const instance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [longitude, latitude],
        zoom: Math.max(14, Math.min(16, zoom)),
        pitch: 0,
        bearing: 0,
        scrollZoom: false,
      });

      // Create marker element
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-[#0e2e50] rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform';
      el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

      // Add marker
      new mapboxgl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(instance);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      })
        .setLngLat([longitude, latitude])
        .setHTML(`<div class="p-3">${title ? `<p class="font-bold text-sm text-[#0e2e50] mb-1">${title}</p>` : ''}<p class="text-xs text-muted-foreground leading-relaxed">${address}</p></div>`);

      // Click handler for marker
      el.addEventListener('click', () => {
        popup.addTo(instance);
      });

      instance.on('load', () => {
        setMapLoaded(true);
      });

      instance.on('error', (e: any) => {
        console.error('Map error:', e);
        setMapError('Could not load map. Please try again.');
      });

      map.current = instance;
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Could not initialize map');
    }

    return () => {
      // Cleanup
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isVisible, token, longitude, latitude, zoom, interactive, title, address]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={mapContainer}
      className={cn(
        'relative w-full rounded-3xl border border-border overflow-hidden bg-muted',
        height
      )}
    >
      {/* Loading state */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/30 z-10">
          <div className="text-center">
            <Loader size={32} className="mx-auto mb-2 text-[#0e2e50] animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map error state */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-20">
          <MapErrorContent error={mapError} />
        </div>
      )}

      {/* Mobile-specific instructions */}
      {interactive && typeof window !== 'undefined' && window.innerWidth < 768 && mapLoaded && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-xs text-muted-foreground text-center pointer-events-none z-10">
          Pinch to zoom • Drag to pan
        </div>
      )}

      {/* Consistent border overlay (no layout shift) */}
      <div className="absolute inset-0 pointer-events-none border border-border rounded-3xl" />
    </div>
  );
});

PropertyMap.displayName = 'PropertyMap';

/**
 * Error Fallback Component
 */
function MapErrorFallback({ error }: { error: string }) {
  return (
    <div className="w-full aspect-video rounded-3xl bg-muted border border-border flex items-center justify-center">
      <MapErrorContent error={error} />
    </div>
  );
}

/**
 * Error Content
 */
function MapErrorContent({ error }: { error: string }) {
  return (
    <div className="text-center p-6">
      <AlertCircle size={40} className="mx-auto mb-3 text-amber-500" />
      <p className="text-sm text-muted-foreground font-medium">{error}</p>
    </div>
  );
}
