import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapConfig } from '../../types/map';

interface MapContainerProps {
  config: MapConfig;
  onMapReady?: (map: L.Map) => void;
  className?: string;
}

export function MapContainer({ config, onMapReady, className = '' }: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [config.center.lat, config.center.lng],
      zoom: config.zoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      zoomControl: true,
    });

    mapRef.current = map;

    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} data-testid="map-container" />;
}
