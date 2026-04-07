import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Calendar, 
  Clock, 
  Car, 
  DollarSign, 
  MapPin,
  Search,
  MoreHorizontal,
  X,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockReservations, mockParkingSpaces, mockVehicles } from '@/data/mockData';
import { useAuth } from '@/contexts';
import { format, isPast, isFuture, isToday } from 'date-fns';
import type { Reservation } from '@/types';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const Reservations: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);

  const userReservations = mockReservations.filter(r => r.userId === user?.id);

  const filteredReservations = userReservations.filter(reservation => {
    const parkingSpace = mockParkingSpaces.find(p => p.id === reservation.parkingSpaceId);
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      parkingSpace?.name.toLowerCase().includes(query) ||
      parkingSpace?.address.toLowerCase().includes(query)
    );
  });

  const upcomingReservations = filteredReservations.filter(r => 
    r.status === 'confirmed' && isFuture(new Date(r.startTime))
  );
  
  const pastReservations = filteredReservations.filter(r => 
    r.status === 'completed' || isPast(new Date(r.endTime))
  );
  
  const cancelledReservations = filteredReservations.filter(r => 
    r.status === 'cancelled'
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      cancelled: 'bg-red-500',
      completed: 'bg-blue-500',
      expired: 'bg-gray-500',
    };
    return <Badge className={variants[status] || 'bg-gray-500'}>{status}</Badge>;
  };

  const handleCancel = () => {
    // Handle cancellation logic
    setShowCancelDialog(false);
    setSelectedReservation(null);
  };

  const handleStartSession = () => {
    // Handle start session logic
    setShowStartDialog(false);
    setSelectedReservation(null);
  };

  const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
    const parkingSpace = mockParkingSpaces.find(p => p.id === reservation.parkingSpaceId);
    const vehicle = mockVehicles.find(v => v.id === reservation.vehicleId);
    const isUpcoming = isFuture(new Date(reservation.startTime)) && reservation.status === 'confirmed';
    const canStart = isToday(new Date(reservation.startTime)) && reservation.status === 'confirmed';

    return (
      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{parkingSpace?.name}</p>
              <p className="text-sm text-muted-foreground">{parkingSpace?.address}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(reservation.startTime), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {format(new Date(reservation.startTime), 'h:mm a')} - {' '}
                  {format(new Date(reservation.endTime), 'h:mm a')}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  {vehicle?.model} ({vehicle?.plateNumber})
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${reservation.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(reservation.status)}
            {(isUpcoming || canStart) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canStart && (
                    <DropdownMenuItem onClick={() => {
                      setSelectedReservation(reservation);
                      setShowStartDialog(true);
                    }}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Start Session
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => {
                    setSelectedReservation(reservation);
                    setShowDetailsDialog(true);
                  }}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowCancelDialog(true);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reservations</h1>
          <p className="text-muted-foreground">
            Manage your parking reservations
          </p>
        </div>
        <Button asChild>
          <a href="/driver/search">
            <Calendar className="w-4 h-4 mr-2" />
            New Reservation
          </a>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reservations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reservations Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingReservations.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>Your scheduled parking sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming reservations</p>
                  <Button className="mt-4" asChild>
                    <a href="/driver/search">Make a Reservation</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Reservations</CardTitle>
              <CardDescription>Your completed parking sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {pastReservations.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No past reservations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Reservations</CardTitle>
              <CardDescription>Reservations you have cancelled</CardDescription>
            </CardHeader>
            <CardContent>
              {cancelledReservations.length === 0 ? (
                <div className="text-center py-8">
                  <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No cancelled reservations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cancelledReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Keep Reservation
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600">
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Session Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          
            <VisuallyHidden.Root>
              <DialogTitle>Start Parking Session</DialogTitle>
              <DialogDescription>Confirm to start your parking session now.</DialogDescription>
            </VisuallyHidden.Root>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Starting your session will begin charging at the hourly rate. 
              Make sure you are at the parking location.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartSession}>
              Start Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
