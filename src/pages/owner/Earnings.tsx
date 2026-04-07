import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Download,
  Calendar,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { mockSessions, mockParkingSpaces } from '@/data/mockData';
import { useAuth } from '@/contexts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Generate daily earnings data
const generateDailyData = () => {
  const days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });
  
  return days.map(day => ({
    date: format(day, 'MMM dd'),
    earnings: Math.floor(Math.random() * 300) + 100,
    sessions: Math.floor(Math.random() * 20) + 5,
  }));
};

const dailyData = generateDailyData();

const monthlyData = [
  { month: 'Jan', earnings: 4200 },
  { month: 'Feb', earnings: 3800 },
  { month: 'Mar', earnings: 5100 },
  { month: 'Apr', earnings: 4600 },
  { month: 'May', earnings: 5800 },
  { month: 'Jun', earnings: 6200 },
];

const spaceEarningsData = [
  { name: 'Downtown Plaza', earnings: 2450, percentage: 35 },
  { name: 'Central Mall', earnings: 1890, percentage: 27 },
  { name: 'Airport Express', earnings: 1680, percentage: 24 },
  { name: 'EV Station', earnings: 980, percentage: 14 },
];

const COLORS = ['hsl(var(--primary))', '#22c55e', '#f59e0b', '#ef4444'];

export const Earnings: React.FC = () => {
  const { user } = useAuth();
  const [, setPeriod] = useState('week');

  const ownerSpaces = mockParkingSpaces.filter(p => p.ownerId === user?.id);
  const ownerSessions = mockSessions.filter(s => 
    ownerSpaces.some(p => p.id === s.parkingSpaceId) && s.status === 'completed'
  );

  const totalEarnings = ownerSessions.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayEarnings = ownerSessions
    .filter(s => new Date(s.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.totalAmount, 0);
  const weeklyEarnings = ownerSessions
    .filter(s => new Date(s.startTime) > subDays(new Date(), 7))
    .reduce((sum, s) => sum + s.totalAmount, 0);
  const monthlyEarnings = ownerSessions
    .filter(s => new Date(s.startTime) > subDays(new Date(), 30))
    .reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">
            Track your parking revenue and transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayEarnings.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${weeklyEarnings.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyEarnings.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Earnings (Last 30 Days)</CardTitle>
              <CardDescription>Revenue trend over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `$${value}`}
                    labelStyle={{ color: 'black' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Revenue by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Location</CardTitle>
                <CardDescription>Revenue distribution across your parking spaces</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spaceEarningsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="earnings"
                    >
                      {spaceEarningsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {spaceEarningsData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">${item.earnings}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Earnings breakdown by parking space</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spaceEarningsData.map((space) => (
                    <div key={space.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{space.name}</span>
                        <Badge variant="outline">{space.percentage}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${space.earnings}</span>
                        <div className="flex items-center text-green-500 text-sm">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +5.2%
                        </div>
                      </div>
                      <Progress value={space.percentage} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest parking payments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ownerSessions.slice(0, 5).map((session) => {
              const parkingSpace = mockParkingSpaces.find(p => p.id === session.parkingSpaceId);
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{parkingSpace?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.startTime), 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+${session.totalAmount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {session.paymentStatus}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
