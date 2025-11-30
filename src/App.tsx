import { useState, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer } from './components/Map/MapContainer';
import { WMSLayer } from './components/Map/WMSLayer';
import { DrawingTools } from './components/Map/DrawingTools';
import { Sidebar } from './components/Sidebar/Sidebar';
import { DEFAULT_MAP_CONFIG, WMS_LAYERS } from './lib/mapConfig';
import { searchLocation } from './services/geocoding';
import { DrawnArea } from './types/map';
import { Menu } from 'lucide-react';

function App() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawMode, setDrawMode] = useState<'none' | 'polygon' | 'rectangle'>('none');
  const [drawnAreas, setDrawnAreas] = useState<DrawnArea[]>([]);

  const handleMapReady = useCallback((mapInstance: L.Map) => {
    setMap(mapInstance);
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    if (!map || !searchQuery.trim()) return;

    const results = await searchLocation(searchQuery);
    if (results.length > 0) {
      const result = results[0];
      map.setView([result.coordinates.lat, result.coordinates.lng], 13);

      if (result.boundingBox) {
        map.fitBounds([
          [result.boundingBox.south, result.boundingBox.west],
          [result.boundingBox.north, result.boundingBox.east],
        ]);
      }
    }
  }, [map, searchQuery]);

  const handleAreaDrawn = useCallback((area: DrawnArea) => {
    setDrawnAreas((prev) => [...prev, area]);
    setDrawMode('none');
  }, []);

  const handleClearAreas = useCallback(() => {
    setDrawnAreas([]);
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          map.removeLayer(layer);
        }
      });
    }
  }, [map]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        drawMode={drawMode}
        onDrawModeChange={setDrawMode}
        drawnAreas={drawnAreas}
        onClearAreas={handleClearAreas}
      />

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute left-4 top-4 z-[1000] p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open sidebar"
          data-testid="open-sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <MapContainer config={DEFAULT_MAP_CONFIG} onMapReady={handleMapReady} />
      <WMSLayer map={map} config={WMS_LAYERS.openstreetmap} />
      <DrawingTools map={map} mode={drawMode} onAreaDrawn={handleAreaDrawn} />
    </div>
  );
}

export default App;
