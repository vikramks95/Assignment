import { ChevronLeft, Search, Upload } from 'lucide-react';
import { DrawnArea } from '../../types/map';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  drawMode: 'none' | 'polygon' | 'rectangle';
  onDrawModeChange: (mode: 'none' | 'polygon' | 'rectangle') => void;
  drawnAreas: DrawnArea[];
  onClearAreas: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  drawMode,
  onDrawModeChange,
  drawnAreas,
  onClearAreas,
}: SidebarProps) {
  return (
    <div
      className={`absolute left-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 z-[1000] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '380px' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Define Area of Interest</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-gray-600 mb-6">
            Define the area(s) where you will apply your object count & detection model
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Options:</h3>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Search</p>
                      <p className="text-xs text-gray-500">for a city, town... or draw area on map</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                        placeholder="Search location..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        data-testid="location-search"
                      />
                      <button
                        onClick={onSearchSubmit}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Uploading a shape file</p>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Drawing Tools:</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onDrawModeChange(drawMode === 'polygon' ? 'none' : 'polygon')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    drawMode === 'polygon'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid="polygon-tool"
                >
                  Polygon
                </button>
                <button
                  onClick={() => onDrawModeChange(drawMode === 'rectangle' ? 'none' : 'rectangle')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    drawMode === 'rectangle'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid="rectangle-tool"
                >
                  Rectangle
                </button>
              </div>
              {drawMode === 'polygon' && (
                <p className="mt-2 text-xs text-gray-500">
                  Click on the map to add points. Double-click to finish.
                </p>
              )}
              {drawMode === 'rectangle' && (
                <p className="mt-2 text-xs text-gray-500">
                  Click and drag on the map to draw a rectangle.
                </p>
              )}
            </div>

            {drawnAreas.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Drawn Areas ({drawnAreas.length})
                  </h3>
                  <button
                    onClick={onClearAreas}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                    data-testid="clear-areas"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {drawnAreas.map((area) => (
                    <div
                      key={area.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {area.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {area.coordinates.length} points
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
