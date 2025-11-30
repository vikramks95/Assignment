import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DrawnArea } from '../../types/map';

interface DrawingToolsProps {
  map: L.Map | null;
  mode: 'none' | 'polygon' | 'rectangle';
  onAreaDrawn?: (area: DrawnArea) => void;
}

export function DrawingTools({ map, mode, onAreaDrawn }: DrawingToolsProps) {
  const drawingLayerRef = useRef<L.FeatureGroup | null>(null);
  const isDrawingRef = useRef(false);
  const polygonPointsRef = useRef<L.LatLng[]>([]);
  const tempMarkersRef = useRef<L.Marker[]>([]);
  const tempLinesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    if (!drawingLayerRef.current) {
      drawingLayerRef.current = L.featureGroup().addTo(map);
    }

    const cleanup = () => {
      tempMarkersRef.current.forEach(marker => marker.remove());
      tempLinesRef.current.forEach(line => line.remove());
      tempMarkersRef.current = [];
      tempLinesRef.current = [];
      polygonPointsRef.current = [];
      isDrawingRef.current = false;
    };

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (mode === 'none') return;

      if (mode === 'polygon') {
        if (!isDrawingRef.current) {
          isDrawingRef.current = true;
          polygonPointsRef.current = [];
        }

        polygonPointsRef.current.push(e.latlng);

        const marker = L.circleMarker(e.latlng, {
          radius: 5,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          color: '#1E40AF',
          weight: 2,
        }).addTo(map);
        tempMarkersRef.current.push(marker);

        if (polygonPointsRef.current.length > 1) {
          const line = L.polyline([
            polygonPointsRef.current[polygonPointsRef.current.length - 2],
            polygonPointsRef.current[polygonPointsRef.current.length - 1],
          ], {
            color: '#3B82F6',
            weight: 2,
            dashArray: '5, 5',
          }).addTo(map);
          tempLinesRef.current.push(line);
        }
      }
    };

    const handleMapDblClick = () => {
      if (mode === 'polygon' && polygonPointsRef.current.length >= 3) {
        const polygon = L.polygon(polygonPointsRef.current, {
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.2,
          weight: 2,
        });

        drawingLayerRef.current?.addLayer(polygon);

        const bounds = polygon.getBounds();
        const area: DrawnArea = {
          id: Date.now().toString(),
          type: 'polygon',
          coordinates: polygonPointsRef.current.map(latlng => ({
            lat: latlng.lat,
            lng: latlng.lng,
          })),
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          createdAt: new Date(),
        };

        if (onAreaDrawn) {
          onAreaDrawn(area);
        }

        cleanup();
      }
    };

    map.on('click', handleMapClick);
    map.on('dblclick', handleMapDblClick);

    if (mode === 'rectangle') {
      let startLatLng: L.LatLng | null = null;
      let rectangle: L.Rectangle | null = null;

      const handleRectangleMouseDown = (e: L.LeafletMouseEvent) => {
        startLatLng = e.latlng;
        rectangle = L.rectangle([startLatLng, startLatLng], {
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(map);
      };

      const handleRectangleMouseMove = (e: L.LeafletMouseEvent) => {
        if (startLatLng && rectangle) {
          rectangle.setBounds([startLatLng, e.latlng]);
        }
      };

      const handleRectangleMouseUp = (e: L.LeafletMouseEvent) => {
        if (startLatLng && rectangle) {
          const bounds = rectangle.getBounds();
          drawingLayerRef.current?.addLayer(rectangle);

          const area: DrawnArea = {
            id: Date.now().toString(),
            type: 'rectangle',
            coordinates: [
              { lat: bounds.getNorthWest().lat, lng: bounds.getNorthWest().lng },
              { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
              { lat: bounds.getSouthEast().lat, lng: bounds.getSouthEast().lng },
              { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
            ],
            bounds: {
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            },
            createdAt: new Date(),
          };

          if (onAreaDrawn) {
            onAreaDrawn(area);
          }

          startLatLng = null;
          rectangle = null;
        }
      };

      map.on('mousedown', handleRectangleMouseDown);
      map.on('mousemove', handleRectangleMouseMove);
      map.on('mouseup', handleRectangleMouseUp);

      return () => {
        map.off('click', handleMapClick);
        map.off('dblclick', handleMapDblClick);
        map.off('mousedown', handleRectangleMouseDown);
        map.off('mousemove', handleRectangleMouseMove);
        map.off('mouseup', handleRectangleMouseUp);
        cleanup();
      };
    }

    return () => {
      map.off('click', handleMapClick);
      map.off('dblclick', handleMapDblClick);
      cleanup();
    };
  }, [map, mode, onAreaDrawn]);

  return null;
}
