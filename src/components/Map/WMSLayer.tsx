import { useEffect } from 'react';
import L from 'leaflet';
import { WMSLayerConfig } from '../../types/map';

interface WMSLayerProps {
  map: L.Map | null;
  config: WMSLayerConfig;
  opacity?: number;
}

export function WMSLayer({ map, config, opacity = 1 }: WMSLayerProps) {
  useEffect(() => {
    if (!map) return;

    const wmsLayer = L.tileLayer.wms(config.url, {
      layers: config.layers,
      format: config.format || 'image/png',
      transparent: config.transparent ?? true,
      version: config.version || '1.1.1',
      attribution: config.attribution || '',
      opacity,
    });

    wmsLayer.addTo(map);

    return () => {
      map.removeLayer(wmsLayer);
    };
  }, [map, config, opacity]);

  return null;
}
