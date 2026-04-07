import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Navigation, 
  Star, 
  Clock,
  Car,
  Shield,
  Zap,
  Accessibility,
  Sun,
  Camera,
  Users,
  Calendar,
  X
} from 'lucide-react';
import { mockParkingSpaces, mockVehicles } from '@/data/mockData';
import { useAuth } from '@/contexts';
import type { ParkingSpace, ParkingFeature } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';

// Fix Leaflet default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons
const createCustomIcon = (price: number, available: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container ${available ? 'available' : 'full'}">
        <span class="marker-price">$${price}</span>
      </div>
    `,
    iconSize: [50, 30],
    iconAnchor: [25, 15],
  });
};

// Map center updater component
const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const featureIcons: Record<ParkingFeature, React.ElementType> = {
  covered: Car,
  security: Shield,
  cctv: Camera,
  lighting: Sun,
  ev_charging: Zap,
  handicap_accessible: Accessibility,
  '24_7': Clock,
  staffed: Users,
};

const featureLabels: Record<ParkingFeature, string> = {
  covered: 'Covered',
  security: 'Security',
  cctv: 'CCTV',
  lighting: 'Lighting',
  ev_charging: 'EV Charging',
  handicap_accessible: 'Accessible',
  '24_7': '24/7',
  staffed: 'Staffed',
};

export const ParkingSearch: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [maxPrice, setMaxPrice] = useState(20);
  const [selectedFeatures, setSelectedFeatures] = useState<ParkingFeature[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  
  // Reservation states
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [duration, setDuration] = useState(1);

  const vehicles = mockVehicles.filter(v => v.userId === user?.id);

  // Filter parking spaces
  const filteredSpaces = useMemo(() => {
    return mockParkingSpaces.filter(space => {
      if (space.status !== 'active') return false;
      if (space.hourlyRate > maxPrice) return false;
      if (availableOnly && space.availableSpots === 0) return false;
      if (selectedFeatures.length > 0) {
        return selectedFeatures.every(f => space.features.includes(f));
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          space.name.toLowerCase().includes(query) ||
          space.address.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [maxPrice, selectedFeatures, availableOnly, searchQuery]);

  const handleFeatureToggle = (feature: ParkingFeature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleReserve = () => {
    // Handle reservation logic
    setShowReservationDialog(false);
    setSelectedSpace(null);
  };

  const handleGetDirections = (space: ParkingSpace) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${space.coordinates.lat},${space.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Parking</h1>
          <p className="text-muted-foreground">
            Search and reserve parking spaces near you
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                Filters
              </Button>
              <Button variant="outline" onClick={detectLocation}>
                <Navigation className="w-4 h-4 mr-2" />
                Near Me
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div>
                <Label>Max Price: ${maxPrice}/hour</Label>
                <Slider
                  value={[maxPrice]}
                  onValueChange={(value) => setMaxPrice(value[0])}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="mb-2 block">Features</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(featureIcons) as ParkingFeature[]).map((feature) => {
                    const Icon = featureIcons[feature];
                    return (
                      <Button
                        key={feature}
                        type="button"
                        variant={selectedFeatures.includes(feature) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFeatureToggle(feature)}
                        className="gap-1"
                      >
                        <Icon className="w-3 h-3" />
                        {featureLabels[feature]}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={availableOnly}
                  onCheckedChange={(checked) => setAvailableOnly(checked as boolean)}
                />
                <Label htmlFor="available">Show available spots only</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map and List */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map */}
        <Card className="lg:col-span-2 min-h-[500px]">
          <CardContent className="p-0 h-full">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapCenterUpdater center={mapCenter} />
              {filteredSpaces.map((space) => (
                <Marker
                  key={space.id}
                  position={[space.coordinates.lat, space.coordinates.lng]}
                  icon={createCustomIcon(space.hourlyRate, space.availableSpots > 0)}
                  eventHandlers={{
                    click: () => setSelectedSpace(space),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-medium">{space.name}</p>
                      <p className="text-sm text-muted-foreground">${space.hourlyRate}/hr</p>
                      <p className="text-sm">{space.availableSpots} spots available</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        {/* Results List */}
        <Card>
          <CardHeader>
            <CardTitle>Results ({filteredSpaces.length})</CardTitle>
            <CardDescription>Available parking spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredSpaces.map((space) => (
                  <div
                    key={space.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSpace?.id === space.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedSpace(space)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{space.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {space.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${space.hourlyRate}</p>
                        <p className="text-xs text-muted-foreground">/hour</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={space.availableSpots > 0 ? 'default' : 'secondary'}>
                        {space.availableSpots} available
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{space.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {space.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-0.5 bg-muted rounded-full"
                        >
                          {featureLabels[feature]}
                        </span>
                      ))}
                      {space.features.length > 3 && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                          +{space.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Selected Space Details */}
      {selectedSpace && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedSpace.name}</CardTitle>
                <CardDescription>{selectedSpace.address}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSpace(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedSpace.description}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedSpace.rating}</span>
                    <span className="text-muted-foreground">
                      ({selectedSpace.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${selectedSpace.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hour</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpace.features.map((feature) => {
                      const Icon = featureIcons[feature];
                      return (
                        <div
                          key={feature}
                          className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                        >
                          <Icon className="w-3 h-3" />
                          {featureLabels[feature]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{selectedSpace.totalSpots}</p>
                    <p className="text-sm text-muted-foreground">Total Spots</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedSpace.availableSpots}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGetDirections(selectedSpace)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setShowReservationDialog(true)}
                    disabled={selectedSpace.availableSpots === 0}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservation Dialog */}
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent className="sm:max-w-md">
          
            <VisuallyHidden.Root>
              <DialogTitle>Make a Reservation</DialogTitle>
              <DialogDescription>Reserve your spot at {selectedSpace?.name}</DialogDescription>
            </VisuallyHidden.Root>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} ({vehicle.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (hours)</Label>
              <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h} hour{h > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSpace && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Estimated Total:</span>
                  <span className="text-xl font-bold">
                    ${(selectedSpace.hourlyRate * duration).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReservationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReserve} disabled={!selectedVehicle}>
              Confirm Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
