export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface WMSLayerConfig {
  url: string;
  layers: string;
  format?: string;
  transparent?: boolean;
  version?: string;
  attribution?: string;
}

export interface DrawnArea {
  id: string;
  type: 'polygon' | 'rectangle' | 'circle';
  coordinates: Coordinates[];
  bounds?: BoundingBox;
  radius?: number;
  center?: Coordinates;
  createdAt: Date;
}

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface SearchResult {
  name: string;
  coordinates: Coordinates;
  boundingBox?: BoundingBox;
  type: string;
}
