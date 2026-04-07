import type { 
  User, 
  Vehicle, 
  ParkingSpace, 
  Reservation, 
  ParkingSession, 
  Notification,
  ActivityLog,
  DashboardStats,
  OwnerDashboardStats,
  DriverDashboardStats,
  Document
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'driver@example.com',
    firstName: 'SanjayReddy',
    lastName: 'Driver',
    phone: '+1234567890',
    role: 'driver',
    status: 'approved',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isEmailVerified: true,
  },
  {
    id: '2',
    email: 'owner@example.com',
    firstName: 'Thiruselvan',
    lastName: 'Owner',
    phone: '+1234567891',
    role: 'owner',
    status: 'approved',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isEmailVerified: true,
  },
  {
    id: '3',
    email: 'admin@example.com',
    firstName: 'Selva',
    lastName: 'Admin',
    phone: '+1234567892',
    role: 'admin',
    status: 'approved',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isEmailVerified: true,
  },
  {
    id: '4',
    email: 'pending@example.com',
    firstName: 'Pending',
    lastName: 'Owner',
    phone: '+1234567893',
    role: 'owner',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isEmailVerified: true,
  },
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    plateNumber: 'ABC-1234',
    model: 'Toyota Camry',
    color: 'Silver',
    year: 2020,
    isDefault: true,
  },
  {
    id: '2',
    userId: '1',
    plateNumber: 'XYZ-5678',
    model: 'Honda Civic',
    color: 'Blue',
    year: 2019,
    isDefault: false,
  },
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: '1',
    userId: '2',
    type: 'license',
    fileName: 'business_license.pdf',
    fileUrl: '/documents/license.pdf',
    uploadedAt: new Date('2024-01-01'),
    status: 'approved',
  },
  {
    id: '2',
    userId: '2',
    type: 'ownership_proof',
    fileName: 'property_deed.pdf',
    fileUrl: '/documents/deed.pdf',
    uploadedAt: new Date('2024-01-01'),
    status: 'approved',
  },
  {
    id: '3',
    userId: '4',
    type: 'license',
    fileName: 'pending_license.pdf',
    fileUrl: '/documents/pending.pdf',
    uploadedAt: new Date('2024-01-15'),
    status: 'pending',
  },
];

// Mock Parking Spaces
export const mockParkingSpaces: ParkingSpace[] = [
  {
    id: '1',
    ownerId: '2',
    name: 'Downtown Parking Plaza',
    description: 'Secure underground parking in the heart of downtown. 24/7 security with CCTV surveillance.',
    address: '123 Main Street, Downtown, NY 10001',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
      'https://images.unsplash.com/photo-1621929747188-b6943fe363e2?w=800',
    ],
    hourlyRate: 5.00,
    totalSpots: 50,
    availableSpots: 23,
    status: 'active',
    features: ['covered', 'security', 'cctv', 'lighting', '24_7'],
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: '2',
    ownerId: '2',
    name: 'Central Mall Parking',
    description: 'Convenient parking at Central Mall. Close to shopping and dining.',
    address: '456 Shopping Ave, Midtown, NY 10002',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    images: [
      'https://images.unsplash.com/photo-1590674899505-1c5c41943f1d?w=800',
    ],
    hourlyRate: 3.50,
    totalSpots: 100,
    availableSpots: 45,
    status: 'active',
    features: ['covered', 'lighting', 'handicap_accessible'],
    openingHours: {
      monday: { open: '06:00', close: '22:00', isOpen: true },
      tuesday: { open: '06:00', close: '22:00', isOpen: true },
      wednesday: { open: '06:00', close: '22:00', isOpen: true },
      thursday: { open: '06:00', close: '22:00', isOpen: true },
      friday: { open: '06:00', close: '23:00', isOpen: true },
      saturday: { open: '06:00', close: '23:00', isOpen: true },
      sunday: { open: '08:00', close: '21:00', isOpen: true },
    },
    documents: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: '3',
    ownerId: '2',
    name: 'Airport Express Parking',
    description: 'Long-term parking near the airport with shuttle service.',
    address: '789 Airport Blvd, JFK, NY 11430',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    images: [
      'https://images.unsplash.com/photo-1445548671936-e1ff8a6a6b20?w=800',
    ],
    hourlyRate: 8.00,
    totalSpots: 200,
    availableSpots: 87,
    status: 'active',
    features: ['security', 'cctv', 'lighting', 'staffed', '24_7'],
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
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    rating: 4.7,
    reviewCount: 256,
  },
  {
    id: '4',
    ownerId: '4',
    name: 'New Owner Parking',
    description: 'Pending approval parking space.',
    address: '999 New Street, Brooklyn, NY 11201',
    coordinates: { lat: 40.6892, lng: -73.9442 },
    images: [],
    hourlyRate: 4.00,
    totalSpots: 20,
    availableSpots: 20,
    status: 'pending_approval',
    features: ['lighting'],
    openingHours: {
      monday: { open: '08:00', close: '18:00', isOpen: true },
      tuesday: { open: '08:00', close: '18:00', isOpen: true },
      wednesday: { open: '08:00', close: '18:00', isOpen: true },
      thursday: { open: '08:00', close: '18:00', isOpen: true },
      friday: { open: '08:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '17:00', isOpen: true },
      sunday: { open: '', close: '', isOpen: false },
    },
    documents: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    rating: 0,
    reviewCount: 0,
  },
  {
    id: '5',
    ownerId: '2',
    name: 'EV Charging Station',
    description: 'Parking with electric vehicle charging stations.',
    address: '321 Green Ave, Eco District, NY 10003',
    coordinates: { lat: 40.7282, lng: -73.9942 },
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    ],
    hourlyRate: 6.50,
    totalSpots: 15,
    availableSpots: 8,
    status: 'active',
    features: ['ev_charging', 'covered', 'security', 'cctv'],
    openingHours: {
      monday: { open: '06:00', close: '22:00', isOpen: true },
      tuesday: { open: '06:00', close: '22:00', isOpen: true },
      wednesday: { open: '06:00', close: '22:00', isOpen: true },
      thursday: { open: '06:00', close: '22:00', isOpen: true },
      friday: { open: '06:00', close: '22:00', isOpen: true },
      saturday: { open: '07:00', close: '21:00', isOpen: true },
      sunday: { open: '08:00', close: '20:00', isOpen: true },
    },
    documents: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    rating: 4.8,
    reviewCount: 45,
  },
];

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: '1',
    userId: '1',
    parkingSpaceId: '1',
    vehicleId: '1',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    endTime: new Date(Date.now() + 7200000), // 2 hours from now
    status: 'confirmed',
    totalAmount: 10.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    parkingSpaceId: '3',
    vehicleId: '2',
    startTime: new Date(Date.now() + 86400000), // 1 day from now
    endTime: new Date(Date.now() + 90000000), // 1 day + 1 hour
    status: 'pending',
    totalAmount: 8.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock Parking Sessions
export const mockSessions: ParkingSession[] = [
  {
    id: '1',
    userId: '1',
    parkingSpaceId: '2',
    vehicleId: '1',
    startTime: new Date(Date.now() - 1800000), // 30 minutes ago
    status: 'active',
    hourlyRate: 3.50,
    totalAmount: 1.75,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    parkingSpaceId: '1',
    vehicleId: '1',
    startTime: new Date(Date.now() - 7200000), // 2 hours ago
    endTime: new Date(Date.now() - 1800000), // 30 minutes ago
    status: 'completed',
    hourlyRate: 5.00,
    totalAmount: 7.50,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 1800000),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Reservation Confirmed',
    message: 'Your reservation at Downtown Parking Plaza has been confirmed.',
    type: 'success',
    isRead: false,
    link: '/driver/reservations',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Parking Session Started',
    message: 'Your parking session at Central Mall Parking has started.',
    type: 'info',
    isRead: true,
    link: '/driver/sessions',
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: '3',
    userId: '2',
    title: 'New Reservation',
    message: 'You have a new reservation at Downtown Parking Plaza.',
    type: 'info',
    isRead: false,
    link: '/owner/reservations',
    createdAt: new Date(),
  },
  {
    id: '4',
    userId: '2',
    title: 'Payment Received',
    message: 'You received a payment of $7.50 for parking session #2.',
    type: 'success',
    isRead: false,
    link: '/owner/earnings',
    createdAt: new Date(Date.now() - 1800000),
  },
];

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    action: 'LOGIN',
    entityType: 'user',
    entityId: '1',
    details: { ip: '192.168.1.1' },
    ipAddress: '192.168.1.1',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    action: 'CREATE_RESERVATION',
    entityType: 'reservation',
    entityId: '1',
    details: { parkingSpaceId: '1', amount: 10.00 },
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: '2',
    action: 'APPROVE_ARRIVAL',
    entityType: 'session',
    entityId: '1',
    details: { userId: '1', parkingSpaceId: '2' },
    createdAt: new Date(),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: 156,
  totalDrivers: 120,
  totalOwners: 34,
  totalParkingSpaces: 89,
  activeParkingSpaces: 76,
  totalSessions: 1247,
  activeSessions: 23,
  totalRevenue: 45678.90,
  todayRevenue: 1234.56,
  pendingApprovals: 5,
  pendingDocuments: 8,
};

// Mock Owner Dashboard Stats
export const mockOwnerDashboardStats: OwnerDashboardStats = {
  totalSpaces: 4,
  activeSpaces: 3,
  totalEarnings: 15234.56,
  todayEarnings: 234.50,
  weeklyEarnings: 1456.78,
  monthlyEarnings: 5234.90,
  activeSessions: 2,
  pendingReservations: 3,
  totalReservations: 156,
  occupancyRate: 68.5,
};

// Mock Driver Dashboard Stats
export const mockDriverDashboardStats: DriverDashboardStats = {
  totalSessions: 24,
  activeSessions: 1,
  totalSpent: 345.67,
  favoriteLocations: 5,
  upcomingReservations: 2,
  vehicles: 2,
};

// Helper function to get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email === email);
};

// Helper function to get parking spaces by owner
export const getParkingSpacesByOwner = (ownerId: string): ParkingSpace[] => {
  return mockParkingSpaces.filter(p => p.ownerId === ownerId);
};

// Helper function to get reservations by user
export const getReservationsByUser = (userId: string): Reservation[] => {
  return mockReservations.filter(r => r.userId === userId);
};

// Helper function to get sessions by user
export const getSessionsByUser = (userId: string): ParkingSession[] => {
  return mockSessions.filter(s => s.userId === userId);
};

// Helper function to get notifications by user
export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId);
};

// Helper function to get vehicles by user
export const getVehiclesByUser = (userId: string): Vehicle[] => {
  return mockVehicles.filter(v => v.userId === userId);
};
