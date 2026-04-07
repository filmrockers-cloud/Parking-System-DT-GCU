import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Car, 
  Plus, 
  Edit2, 
  Trash2, 
  Star
} from 'lucide-react';
import { mockVehicles } from '@/data/mockData';
import { useAuth } from '@/contexts';
import type { Vehicle } from '@/types';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const Vehicles: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    mockVehicles.filter(v => v.userId === user?.id)
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    color: '',
    year: new Date().getFullYear(),
    isDefault: false,
  });

  const handleAdd = () => {
    const newVehicle: Vehicle = {
      id: String(Date.now()),
      userId: user?.id || '',
      plateNumber: formData.plateNumber,
      model: formData.model,
      color: formData.color,
      year: formData.year,
      isDefault: formData.isDefault,
    };

    if (formData.isDefault) {
      setVehicles(prev => prev.map(v => ({ ...v, isDefault: false })).concat(newVehicle));
    } else {
      setVehicles(prev => [...prev, newVehicle]);
    }

    setFormData({
      plateNumber: '',
      model: '',
      color: '',
      year: new Date().getFullYear(),
      isDefault: false,
    });
    setShowAddDialog(false);
  };

  const handleEdit = () => {
    if (!selectedVehicle) return;

    const updatedVehicle = { ...selectedVehicle, ...formData };
    
    if (formData.isDefault) {
      setVehicles(prev => prev.map(v => ({
        ...v,
        isDefault: v.id === selectedVehicle.id ? true : false,
        ...(v.id === selectedVehicle.id ? updatedVehicle : {})
      })));
    } else {
      setVehicles(prev => prev.map(v => 
        v.id === selectedVehicle.id ? updatedVehicle : v
      ));
    }

    setShowEditDialog(false);
    setSelectedVehicle(null);
  };

  const handleDelete = () => {
    if (!selectedVehicle) return;
    setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));
    setShowDeleteDialog(false);
    setSelectedVehicle(null);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      model: vehicle.model,
      color: vehicle.color,
      year: vehicle.year,
      isDefault: vehicle.isDefault,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteDialog(true);
  };

  const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
    <Card className={vehicle.isDefault ? 'border-primary/50' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              vehicle.isDefault ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <Car className={`w-7 h-7 ${vehicle.isDefault ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">{vehicle.model}</p>
                {vehicle.isDefault && (
                  <Badge variant="default" className="gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold tracking-wider mt-1">{vehicle.plateNumber}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{vehicle.color}</span>
                <span>{vehicle.year}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(vehicle)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDeleteDialog(vehicle)}
              disabled={vehicle.isDefault}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const VehicleForm: React.FC<{ onSubmit: () => void; submitLabel: string }> = ({ 
    onSubmit, 
    submitLabel 
  }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plateNumber">License Plate</Label>
        <Input
          id="plateNumber"
          placeholder="ABC-1234"
          value={formData.plateNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Vehicle Model</Label>
        <Input
          id="model"
          placeholder="Toyota Camry"
          value={formData.model}
          onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="Silver"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder="2020"
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isDefault" className="text-sm font-normal">
          Set as default vehicle
        </Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => {
          setShowAddDialog(false);
          setShowEditDialog(false);
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!formData.plateNumber || !formData.model}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Vehicles</h1>
          <p className="text-muted-foreground">
            Manage your registered vehicles
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No Vehicles</p>
            <p className="text-muted-foreground mb-4">
              You haven't registered any vehicles yet
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
            <VisuallyHidden.Root>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>Register a new vehicle for parking</DialogDescription>
            </VisuallyHidden.Root>
          <VehicleForm onSubmit={handleAdd} submitLabel="Add Vehicle" />
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          
            <VisuallyHidden.Root>
              <DialogTitle>Edit Vehicle</DialogTitle>
              <DialogDescription>Update your vehicle information</DialogDescription>
            </VisuallyHidden.Root>
          
          <VehicleForm onSubmit={handleEdit} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedVehicle?.model} ({selectedVehicle?.plateNumber})?
              This action cannot be undone.
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
    </div>
  );
};
