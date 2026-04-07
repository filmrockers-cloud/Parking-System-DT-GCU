import React from 'react';
import { useAuth, useNotifications } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { mockDriverDashboardStats, mockSessions, mockReservations, mockParkingSpaces } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const stats = mockDriverDashboardStats;
  const activeSessions = mockSessions.filter(s => s.status === 'active');
  const upcomingReservations = mockReservations.filter(r => r.status === 'confirmed');
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your parking today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/driver/search">
              <MapPin className="w-4 h-4 mr-2" />
              Find Parking
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Currently parking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingReservations}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Parking sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Your current parking sessions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/driver/sessions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active sessions</p>
                <Button className="mt-4" asChild>
                  <Link to="/driver/search">Find Parking</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSessions.map((session) => {
                  const parkingSpace = mockParkingSpaces.find(p => p.id === session.parkingSpaceId);
                  const duration = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 60000);
                  const cost = (duration / 60) * session.hourlyRate;
                  
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{parkingSpace?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Started {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {duration} mins • ${cost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                        <Button size="sm" variant="outline">End</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/driver/search">
                <MapPin className="w-4 h-4 mr-2" />
                Find Parking Near Me
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/driver/reservations">
                <Calendar className="w-4 h-4 mr-2" />
                Make a Reservation
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/driver/vehicles">
                <Car className="w-4 h-4 mr-2" />
                Manage Vehicles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reservations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>Your scheduled parking reservations</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/driver/reservations">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming reservations</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingReservations.map((reservation) => {
                const parkingSpace = mockParkingSpaces.find(p => p.id === reservation.parkingSpaceId);
                
                return (
                  <div
                    key={reservation.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{parkingSpace?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {parkingSpace?.address}
                        </p>
                      </div>
                      <Badge variant="outline">{reservation.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Date:</span>{' '}
                        {format(new Date(reservation.startTime), 'MMM dd, yyyy')}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Time:</span>{' '}
                        {format(new Date(reservation.startTime), 'h:mm a')} - {' '}
                        {format(new Date(reservation.endTime), 'h:mm a')}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Total:</span>{' '}
                        ${reservation.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1">
                        Start
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates and alerts</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/notifications">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
