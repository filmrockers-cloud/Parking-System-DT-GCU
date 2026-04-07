import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Star,
  Search,
  Eye,
  Upload
} from 'lucide-react';
import { mockParkingSpaces } from '@/data/mockData';
import { useAuth } from '@/contexts';
import type { ParkingSpace, ParkingFeature } from '@/types';
import { cn } from '@/lib/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

const featureOptions: { value: ParkingFeature; label: string }[] = [
  { value: 'covered', label: 'Covered' },
  { value: 'security', label: 'Security' },
  { value: 'cctv', label: 'CCTV' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'ev_charging', label: 'EV Charging' },
  { value: 'handicap_accessible', label: 'Accessible' },
  { value: '24_7', label: '24/7' },
  { value: 'staffed', label: 'Staffed' },
];

export const ParkingSpaces: React.FC = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<ParkingSpace[]>(
    mockParkingSpaces.filter(p => p.ownerId === user?.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    hourlyRate: 5,
    totalSpots: 10,
    features: [] as ParkingFeature[],
  });

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const newSpace: ParkingSpace = {
      id: String(Date.now()),
      ownerId: user?.id || '',
      name: formData.name,
      description: formData.description,
      address: formData.address,
      coordinates: { lat: 40.7128, lng: -74.0060 }, // Default coordinates
      images: [],
      hourlyRate: formData.hourlyRate,
      totalSpots: formData.totalSpots,
      availableSpots: formData.totalSpots,
      status: 'pending_approval',
      features: formData.features,
      openingHours: {
        monday: { open: '00:00', close: '23:59', isOpen: true },
        tuesday: { open: '00:00', close: '23:59', isOpen: true },
        wednesday: { open: '00:00', close: '23:59', isOpen: true },
        thursday: { open: '00:00', close: '23:59', isOpen: true },
        friday: { open: '00:00', close: '23:59', isOpen: true },
        saturday: { open: '00:00', close: '23:59', isOpen: true },
        sunday: { open: '00:00', close: '23:59', isOpen: true },
      },
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      reviewCount: 0,
    };

    setSpaces(prev => [...prev, newSpace]);
    mockParkingSpaces.push(newSpace);
    resetForm();
    setShowAddDialog(false);
  };

  const handleEdit = () => {
    if (!selectedSpace) return;

    const updatedSpace = { 
      ...selectedSpace, 
      ...formData,
      updatedAt: new Date()
    };

    setSpaces(prev => prev.map(s => s.id === selectedSpace.id ? updatedSpace : s));
    const index = mockParkingSpaces.findIndex(p => p.id === selectedSpace.id);
    if (index !== -1) {
      mockParkingSpaces[index] = updatedSpace;
    }

    setShowEditDialog(false);
    setSelectedSpace(null);
  };

  const handleDelete = () => {
    if (!selectedSpace) return;
    setSpaces(prev => prev.filter(s => s.id !== selectedSpace.id));
    const index = mockParkingSpaces.findIndex(p => p.id === selectedSpace.id);
    if (index !== -1) {
      mockParkingSpaces.splice(index, 1);
    }
    setShowDeleteDialog(false);
    setSelectedSpace(null);
  };

  const toggleStatus = (space: ParkingSpace) => {
    const newStatus: 'active' | 'inactive' = space.status === 'active' ? 'inactive' : 'active';
    const updatedSpace = { ...space, status: newStatus, updatedAt: new Date() };
    setSpaces(prev => prev.map(s => s.id === space.id ? updatedSpace : s));
    const index = mockParkingSpaces.findIndex(p => p.id === space.id);
    if (index !== -1) {
      mockParkingSpaces[index] = updatedSpace;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      hourlyRate: 5,
      totalSpots: 10,
      features: [],
    });
  };

  const openEditDialog = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setFormData({
      name: space.name,
      description: space.description,
      address: space.address,
      hourlyRate: space.hourlyRate,
      totalSpots: space.totalSpots,
      features: space.features,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setShowDeleteDialog(true);
  };

  const openDetailsDialog = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setShowDetailsDialog(true);
  };

  const toggleFeature = (feature: ParkingFeature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      pending_approval: 'bg-yellow-500',
      rejected: 'bg-red-500',
    };
    return <Badge className={variants[status] || 'bg-gray-500'}>{status.replace('_', ' ')}</Badge>;
  };

  const SpaceForm: React.FC<{ onSubmit: () => void; submitLabel: string }> = ({ 
    onSubmit, 
    submitLabel 
  }) => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="name">Parking Space Name</Label>
        <Input
          id="name"
          placeholder="e.g., Downtown Parking Plaza"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your parking space..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Full address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min={1}
            step={0.5}
            value={formData.hourlyRate}
            onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalSpots">Total Spots</Label>
          <Input
            id="totalSpots"
            type="number"
            min={1}
            value={formData.totalSpots}
            onChange={(e) => setFormData(prev => ({ ...prev, totalSpots: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((feature) => (
            <Button
              key={feature.value}
              type="button"
              variant={formData.features.includes(feature.value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFeature(feature.value)}
            >
              {feature.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag and drop images here, or click to browse
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!formData.name || !formData.address}
        >
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Parking Spaces</h1>
          <p className="text-muted-foreground">
            Manage your parking locations
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Space
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search parking spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Spaces Grid */}
      {filteredSpaces.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No Parking Spaces</p>
            <p className="text-muted-foreground mb-4">
              You haven't added any parking spaces yet
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Space
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => (
            <Card key={space.id} className={cn(
              space.status === 'inactive' && 'opacity-75'
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{space.name}</p>
                      {getStatusBadge(space.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {space.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 bg-muted rounded-lg text-center">
                    <p className="text-xl font-bold">{space.availableSpots}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="p-2 bg-muted rounded-lg text-center">
                    <p className="text-xl font-bold">{space.totalSpots}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{space.rating || 'N/A'}</span>
                  </div>
                  <p className="font-bold text-primary">
                    ${space.hourlyRate}<span className="text-xs text-muted-foreground">/hr</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {space.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                      {feature.replace('_', ' ')}
                    </span>
                  ))}
                  {space.features.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                      +{space.features.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={space.status === 'active'}
                      onCheckedChange={() => toggleStatus(space)}
                      disabled={space.status === 'pending_approval'}
                    />
                    <span className="text-sm">
                      {space.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDetailsDialog(space)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(space)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(space)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          
            <VisuallyHidden.Root>
              <DialogTitle>Add Parking Space</DialogTitle>
              <DialogDescription>Add a new parking space to your portfolio</DialogDescription>
            </VisuallyHidden.Root>
          
          <SpaceForm onSubmit={handleAdd} submitLabel="Add Space" />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          
            <VisuallyHidden.Root>
              <DialogTitle>Edit Parking Space</DialogTitle>
              <DialogDescription>Update your parking space information</DialogDescription>
            </VisuallyHidden.Root>
          
          <SpaceForm onSubmit={handleEdit} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Parking Space</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedSpace?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          
            <VisuallyHidden.Root>
              <DialogTitle>{selectedSpace?.name}</DialogTitle>
              <DialogDescription>{selectedSpace?.address}</DialogDescription>
            </VisuallyHidden.Root>
          
          <div className="space-y-4">
            <p className="text-sm">{selectedSpace?.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-lg font-bold">${selectedSpace?.hourlyRate}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Spots</p>
                <p className="text-lg font-bold">{selectedSpace?.totalSpots}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {selectedSpace?.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {selectedSpace && getStatusBadge(selectedSpace.status)}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedSpace?.rating || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
