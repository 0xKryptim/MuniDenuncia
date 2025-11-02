import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Search, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

import type { Location } from '@/lib/types';
import { getCurrentPosition, searchAddress, reverseGeocode } from '@/lib/geocode';
import { Button } from '@/components/ui/button';

// Fix for default marker icons in react-leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface LocationPickerProps {
  value: Location | null;
  onChange: (location: Location) => void;
}

interface DraggableMarkerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

function DraggableMarker({ position, onPositionChange }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const pos = marker.getLatLng();
          onPositionChange(pos.lat, pos.lng);
        }
      },
    }),
    [onPositionChange]
  );

  return <Marker draggable position={position} eventHandlers={eventHandlers} ref={markerRef} />;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris
  const center: [number, number] = value ? [value.lat, value.lng] : defaultCenter;

  const handleUseMyLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentPosition();
      if (location) {
        onChange(location);
        toast.success('Location found successfully');
      } else {
        toast.error('Unable to get your location. Please check your browser permissions.');
      }
    } catch (error) {
      toast.error('Failed to get location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAddress(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      toast.error('Failed to search address');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: Location) => {
    onChange(result);
    setSearchQuery(result.address || '');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleMarkerDrag = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    onChange({ lat, lng, address });
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    onChange({ lat, lng, address });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUseMyLocation}
          disabled={isGettingLocation}
          className="shrink-0"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          Use My Location
        </Button>

        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search address..."
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover shadow-md">
              <div className="max-h-60 overflow-y-auto p-1">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2">{result.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative h-[400px] overflow-hidden rounded-lg border border-input">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {value && (
            <DraggableMarker position={[value.lat, value.lng]} onPositionChange={handleMarkerDrag} />
          )}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>

      {value && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <div className="space-y-1">
            <div className="flex gap-2">
              <span className="font-medium">Coordinates:</span>
              <span className="text-muted-foreground">
                {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
              </span>
            </div>
            {value.address && (
              <div className="flex gap-2">
                <span className="font-medium">Address:</span>
                <span className="text-muted-foreground">{value.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
