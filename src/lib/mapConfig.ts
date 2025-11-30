import { MapConfig, WMSLayerConfig } from '../types/map';

export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: { lat: 50.935, lng: 6.96 },
  zoom: 12,
  minZoom: 3,
  maxZoom: 18,
};

export const WMS_LAYERS: Record<string, WMSLayerConfig> = {
  openstreetmap: {
    url: 'https://ows.terrestris.de/osm/service',
    layers: 'OSM-WMS',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  sentinel: {
    url: 'https://services.sentinel-hub.com/ogc/wms',
    layers: 'TRUE_COLOR',
    format: 'image/png',
    transparent: false,
    version: '1.3.0',
    attribution: '&copy; <a href="https://sentinel-hub.com/">Sentinel Hub</a>',
  },
};
