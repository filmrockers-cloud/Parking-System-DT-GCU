import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Clock, 
  Car, 
  DollarSign, 
  StopCircle,
  History,
  Navigation,
  Calendar
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSessions, mockParkingSpaces, mockVehicles } from '@/data/mockData';
import { useAuth } from '@/contexts';
import { format, differenceInMinutes } from 'date-fns';
import type { ParkingSession } from '@/types';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const Sessions: React.FC = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({});

  const userSessions = mockSessions.filter(s => s.userId === user?.id);
  const activeSessions = userSessions.filter(s => s.status === 'active');
  const completedSessions = userSessions.filter(s => s.status === 'completed');

  // Update elapsed times every minute
  useEffect(() => {
    const updateElapsedTimes = () => {
      const times: Record<string, number> = {};
      activeSessions.forEach(session => {
        times[session.id] = differenceInMinutes(new Date(), new Date(session.startTime));
      });
      setElapsedTimes(times);
    };
  
    updateElapsedTimes();
    const interval = setInterval(updateElapsedTimes, 60000);
    return () => clearInterval(interval);
  }, []); // Empty array stops the infinite loop


  const calculateCurrentCost = (session: ParkingSession) => {
    const elapsedMinutes = elapsedTimes[session.id] || 0;
    const hours = elapsedMinutes / 60;
    return hours * session.hourlyRate;
  };

  const handleEndSession = () => {
    // Handle end session logic
    setShowEndDialog(false);
    setSelectedSession(null);
  };

  const handleGetDirections = (session: ParkingSession) => {
    const parkingSpace = mockParkingSpaces.find(p => p.id === session.parkingSpaceId);
    if (parkingSpace) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${parkingSpace.coordinates.lat},${parkingSpace.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  const ActiveSessionCard: React.FC<{ session: ParkingSession }> = ({ session }) => {
    const parkingSpace = mockParkingSpaces.find(p => p.id === session.parkingSpaceId);
    const vehicle = mockVehicles.find(v => v.id === session.vehicleId);
    const elapsedMinutes = elapsedTimes[session.id] || 0;
    const currentCost = calculateCurrentCost(session);
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;

    return (
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{parkingSpace?.name}</p>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{parkingSpace?.address}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    {vehicle?.model} ({vehicle?.plateNumber})
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${session.hourlyRate}/hour
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">${currentCost.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Current cost</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Session Duration</span>
              <span className="font-medium">
                {hours > 0 && `${hours}h `}{minutes}m
              </span>
            </div>
            <Progress value={Math.min((elapsedMinutes / 120) * 100, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Started {format(new Date(session.startTime), 'MMM dd, h:mm a')}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleGetDirections(session)}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setSelectedSession(session);
                setShowEndDialog(true);
              }}
            >
              <StopCircle className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CompletedSessionCard: React.FC<{ session: ParkingSession }> = ({ session }) => {
    const parkingSpace = mockParkingSpaces.find(p => p.id === session.parkingSpaceId);
    const vehicle = mockVehicles.find(v => v.id === session.vehicleId);
    const duration = session.endTime 
      ? differenceInMinutes(new Date(session.endTime), new Date(session.startTime))
      : 0;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <History className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{parkingSpace?.name}</p>
              <p className="text-sm text-muted-foreground">{parkingSpace?.address}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(session.startTime), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {hours > 0 && `${hours}h `}{minutes}m
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  {vehicle?.model}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${session.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={session.paymentStatus === 'paid' ? 'default' : 'secondary'}>
            {session.paymentStatus}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parking Sessions</h1>
          <p className="text-muted-foreground">
            View and manage your parking sessions
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeSessions.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({completedSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No Active Sessions</p>
                <p className="text-muted-foreground mb-4">
                  You don't have any active parking sessions
                </p>
                <Button asChild>
                  <a href="/driver/search">Find Parking</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <ActiveSessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Your completed parking sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {completedSessions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No session history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedSessions.map((session) => (
                    <CompletedSessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          
            <VisuallyHidden.Root>
              <DialogTitle>End Parking Session</DialogTitle>
              <DialogDescription>Are you sure you want to end this parking session?</DialogDescription>
            </VisuallyHidden.Root>
          
          {selectedSession && (
            <div className="py-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Session Duration:</span>
                  <span className="font-medium">
                    {Math.floor((elapsedTimes[selectedSession.id] || 0) / 60)}h {' '}
                    {(elapsedTimes[selectedSession.id] || 0) % 60}m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Cost:</span>
                  <span className="text-xl font-bold text-primary">
                    ${calculateCurrentCost(selectedSession).toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                You will be charged for the total duration of your session.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEndSession}>
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
