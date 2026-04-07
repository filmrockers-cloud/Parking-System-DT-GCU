import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  UserCheck,
  Building2,
  FileText,
  Eye,
  Download,
  MapPin,
  DollarSign
} from 'lucide-react';
import { mockUsers, mockParkingSpaces, mockDocuments } from '@/data/mockData';
import type { User, ParkingSpace, Document } from '@/types';
import { format } from 'date-fns';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const Approvals: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [spaces, setSpaces] = useState<ParkingSpace[]>(mockParkingSpaces);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  
  const [selectedItem, setSelectedItem] = useState<User | ParkingSpace | Document | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [approvalType, setApprovalType] = useState<'user' | 'space' | 'document'>('user');

  const pendingUsers = users.filter(u => u.status === 'pending');
  const pendingSpaces = spaces.filter(s => s.status === 'pending_approval');
  const pendingDocuments = documents.filter(d => d.status === 'pending');

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'approved' as const } : u
    ));
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'rejected' as const } : u
    ));
  };

  const handleApproveSpace = (spaceId: string) => {
    setSpaces(prev => prev.map(s => 
      s.id === spaceId ? { ...s, status: 'active' as const } : s
    ));
  };

  const handleRejectSpace = (spaceId: string) => {
    setSpaces(prev => prev.map(s => 
      s.id === spaceId ? { ...s, status: 'rejected' as const } : s
    ));
  };

  const handleApproveDocument = (docId: string) => {
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, status: 'approved' as const } : d
    ));
  };

  const handleRejectDocument = (docId: string) => {
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, status: 'rejected' as const } : d
    ));
  };

  const openDetails = (item: User | ParkingSpace | Document, type: 'user' | 'space' | 'document') => {
    setSelectedItem(item);
    setApprovalType(type);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve user registrations, parking spaces, and documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Users
            {pendingUsers.length > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingUsers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="spaces" className="gap-2">
            <Building2 className="w-4 h-4" />
            Spaces
            {pendingSpaces.length > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingSpaces.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            Documents
            {pendingDocuments.length > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingDocuments.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Pending User Approvals</CardTitle>
              <CardDescription>Users awaiting account approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All Caught Up!</p>
                  <p className="text-muted-foreground">No pending user approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.firstName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{user.role}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Registered {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetails(user, 'user')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectUser(user.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spaces Tab */}
        <TabsContent value="spaces">
          <Card>
            <CardHeader>
              <CardTitle>Pending Parking Space Approvals</CardTitle>
              <CardDescription>Parking spaces awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSpaces.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All Caught Up!</p>
                  <p className="text-muted-foreground">No pending space approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSpaces.map((space) => (
                    <div
                      key={space.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{space.name}</p>
                          <p className="text-sm text-muted-foreground">{space.address}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${space.hourlyRate}/hr
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {space.totalSpots} spots
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetails(space, 'space')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectSpace(space.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveSpace(space.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Pending Document Verifications</CardTitle>
              <CardDescription>Documents awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All Caught Up!</p>
                  <p className="text-muted-foreground">No pending document verifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingDocuments.map((doc) => {
                    const user = users.find(u => u.id === doc.userId);
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded by {user?.firstName} {user?.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{doc.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectDocument(doc.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveDocument(doc.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          
            <VisuallyHidden.Root>
              <DialogTitle>
                {approvalType === 'user' && 'User Details'}
                {approvalType === 'space' && 'Parking Space Details'}
                {approvalType === 'document' && 'Document Details'}
              </DialogTitle>
            </VisuallyHidden.Root>
          
          
          {approvalType === 'user' && selectedItem && 'role' in selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedItem.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedItem.email}`}
                  alt={selectedItem.firstName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-xl font-semibold">
                    {selectedItem.firstName} {selectedItem.lastName}
                  </p>
                  <Badge variant="outline">{selectedItem.role}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {selectedItem.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedItem.phone}</p>
                <p><span className="font-medium">Registered:</span> {format(new Date(selectedItem.createdAt), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
          )}

          {approvalType === 'space' && selectedItem && 'hourlyRate' in selectedItem && (
            <div className="space-y-4">
              <p className="text-xl font-semibold">{selectedItem.name}</p>
              <p className="text-muted-foreground">{selectedItem.address}</p>
              <p>{selectedItem.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-lg font-bold">${selectedItem.hourlyRate}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Spots</p>
                  <p className="text-lg font-bold">{selectedItem.totalSpots}</p>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
