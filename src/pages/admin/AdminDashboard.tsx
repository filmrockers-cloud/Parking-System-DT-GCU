import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  DollarSign,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle,
  UserCheck,
  FileCheck,
} from 'lucide-react';
import { mockDashboardStats, mockUsers, mockParkingSpaces, mockActivityLogs } from '@/data/mockData';
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
  AreaChart,
  Area,
} from 'recharts';

// Mock system activity data
const activityData = [
  { hour: '00:00', users: 12, sessions: 8 },
  { hour: '04:00', users: 5, sessions: 3 },
  { hour: '08:00', users: 45, sessions: 32 },
  { hour: '12:00', users: 78, sessions: 56 },
  { hour: '16:00', users: 65, sessions: 48 },
  { hour: '20:00', users: 42, sessions: 28 },
  { hour: '23:59', users: 18, sessions: 12 },
];

const userGrowthData = [
  { month: 'Jan', drivers: 45, owners: 12 },
  { month: 'Feb', drivers: 52, owners: 15 },
  { month: 'Mar', drivers: 68, owners: 18 },
  { month: 'Apr', drivers: 85, owners: 22 },
  { month: 'May', drivers: 102, owners: 28 },
  { month: 'Jun', drivers: 120, owners: 34 },
];

export const AdminDashboard: React.FC = () => {
  const stats = mockDashboardStats;
  
  const recentActivity = mockActivityLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System overview and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/users">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/approvals">
              <Shield className="w-4 h-4 mr-2" />
              Approvals
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {stats.totalDrivers} drivers
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {stats.totalOwners} owners
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parking Spaces</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParkingSpaces}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-500">
                {stats.activeParkingSpaces} active
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-yellow-500">
                {stats.totalParkingSpaces - stats.activeParkingSpaces} pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% from yesterday
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
              Currently parking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alert */}
      {(stats.pendingApprovals > 0 || stats.pendingDocuments > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.pendingApprovals > 0 && (
            <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Pending User Approvals</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.pendingApprovals} users awaiting approval
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to="/admin/approvals">Review</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {stats.pendingDocuments > 0 && (
            <Card className="border-orange-500/50 bg-orange-50/50 dark:bg-orange-900/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Pending Documents</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.pendingDocuments} documents to verify
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/admin/documents">Review</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Activity (24h)</CardTitle>
            <CardDescription>User logins and parking sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="sessions" 
                  stackId="1" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="drivers" fill="hsl(var(--primary))" />
                <Bar dataKey="owners" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/activity">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.entityType} • {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {log.entityId.slice(0, 8)}...
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/users">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/spaces">
                <Building2 className="w-4 h-4 mr-2" />
                Manage Spaces
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/approvals">
                <CheckCircle className="w-4 h-4 mr-2" />
                Pending Approvals
                {stats.pendingApprovals > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {stats.pendingApprovals}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/documents">
                <FileCheck className="w-4 h-4 mr-2" />
                Verify Documents
                {stats.pendingDocuments > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {stats.pendingDocuments}
                  </Badge>
                )}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
