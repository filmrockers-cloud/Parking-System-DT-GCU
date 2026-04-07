import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Ban,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import type { User, UserRole, UserStatus } from '@/types';
import { format } from 'date-fns';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const drivers = filteredUsers.filter(u => u.role === 'driver');
  const owners = filteredUsers.filter(u => u.role === 'owner');
  const pendingUsers = filteredUsers.filter(u => u.status === 'pending');

  const handleApprove = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'approved' as UserStatus } : u
    ));
  };

  const handleReject = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'rejected' as UserStatus } : u
    ));
  };

  const handleSuspend = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, status: 'suspended' as UserStatus } : u
    ));
    setShowSuspendDialog(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<string, string> = {
      approved: 'bg-green-500',
      pending: 'bg-yellow-500',
      rejected: 'bg-red-500',
      suspended: 'bg-gray-500',
    };
    return <Badge className={variants[status] || 'bg-gray-500'}>{status}</Badge>;
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<string, string> = {
      driver: 'bg-blue-500',
      owner: 'bg-purple-500',
      admin: 'bg-red-500',
    };
    return <Badge className={variants[role] || 'bg-gray-500'}>{role}</Badge>;
  };

  const UserTable: React.FC<{ users: User[] }> = ({ users }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedUser(user);
                      setShowDetailsDialog(true);
                    }}>
                      View Details
                    </DropdownMenuItem>
                    {user.status === 'pending' && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(user.id)}>
                          <XCircle className="w-4 h-4 mr-2 text-red-500" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.status !== 'suspended' && user.status !== 'pending' && (
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowSuspendDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="drivers">
            Drivers ({drivers.length})
          </TabsTrigger>
          <TabsTrigger value="owners">
            Owners ({owners.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Complete list of system users</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={filteredUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Drivers</CardTitle>
              <CardDescription>Registered drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={drivers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owners">
          <Card>
            <CardHeader>
              <CardTitle>Parking Owners</CardTitle>
              <CardDescription>Registered parking space owners</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={owners} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Users awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={pendingUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          
            <VisuallyHidden.Root>
              <DialogTitle>User Details</DialogTitle>
            </VisuallyHidden.Root>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.email}`}
                  alt={selectedUser.firstName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {format(new Date(selectedUser.createdAt), 'MMMM dd, yyyy')}</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {selectedUser?.firstName} {selectedUser?.lastName}?
              They will not be able to access the system until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSuspendDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend} className="bg-red-600">
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
