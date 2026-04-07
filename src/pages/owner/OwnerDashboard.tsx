import React from 'react';
import { useAuth } from '@/contexts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  DollarSign,
  Users,
  Clock,
  Star, 
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { 
  mockOwnerDashboardStats, 
  mockParkingSpaces, 
  mockSessions, 
  mockReservations 
} from '@/data/mockData';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Mock earnings data for charts
const earningsData = [
  { day: 'Mon', earnings: 145 },
  { day: 'Tue', earnings: 230 },
  { day: 'Wed', earnings: 189 },
  { day: 'Thu', earnings: 267 },
  { day: 'Fri', earnings: 345 },
  { day: 'Sat', earnings: 420 },
  { day: 'Sun', earnings: 310 },
];

const occupancyData = [
  { hour: '6AM', occupancy: 20 },
  { hour: '8AM', occupancy: 65 },
  { hour: '10AM', occupancy: 80 },
  { hour: '12PM', occupancy: 90 },
  { hour: '2PM', occupancy: 85 },
  { hour: '4PM', occupancy: 75 },
  { hour: '6PM', occupancy: 60 },
  { hour: '8PM', occupancy: 40 },
  { hour: '10PM', occupancy: 25 },
];

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = mockOwnerDashboardStats;
  
  const ownerSpaces = mockParkingSpaces.filter(p => p.ownerId === user?.id);
  const activeSessions = mockSessions.filter(s => 
    ownerSpaces.some(p => p.id === s.parkingSpaceId) && s.status === 'active'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's how your parking business is performing today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/owner/spaces">
              <Building2 className="w-4 h-4 mr-2" />
              Manage Spaces
            </Link>
          </Button>
          <Button asChild>
            <Link to="/owner/earnings">
              <DollarSign className="w-4 h-4 mr-2" />
              View Earnings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayEarnings.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Currently parked vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <Progress value={stats.occupancyRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Earnings</CardTitle>
            <CardDescription>Revenue over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Occupancy</CardTitle>
            <CardDescription>Space utilization by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="occupancy" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
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
                <CardDescription>Currently active parking sessions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/owner/sessions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSessions.slice(0, 5).map((session) => {
                  const parkingSpace = mockParkingSpaces.find(p => p.id === session.parkingSpaceId);
                  const duration = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 60000);
                  const cost = (duration / 60) * session.hourlyRate;
                  
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">{parkingSpace?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Started {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${cost.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{duration} mins</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span>Total Spaces</span>
              </div>
              <span className="font-bold">{stats.totalSpaces}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-green-500" />
                <span>Active Spaces</span>
              </div>
              <span className="font-bold text-green-500">{stats.activeSpaces}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <span>Monthly Earnings</span>
              </div>
              <span className="font-bold">${stats.monthlyEarnings.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Total Reservations</span>
              </div>
              <span className="font-bold">{stats.totalReservations}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Parking Spaces */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Parking Spaces</CardTitle>
              <CardDescription>Your registered parking locations</CardDescription>
            </div>
            <Button asChild>
              <Link to="/owner/spaces">
                <Building2 className="w-4 h-4 mr-2" />
                Manage Spaces
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ownerSpaces.map((space) => (
              <div
                key={space.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{space.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {space.address}
                    </p>
                  </div>
                  <Badge variant={space.status === 'active' ? 'default' : 'secondary'}>
                    {space.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="text-lg font-bold">{space.availableSpots}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <p className="text-lg font-bold">{space.totalSpots}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{space.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({space.reviewCount})
                    </span>
                  </div>
                  <p className="font-bold text-primary">
                    ${space.hourlyRate}<span className="text-xs text-muted-foreground">/hr</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
