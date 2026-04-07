// User Roles
export type UserRole = 'driver' | 'owner' | 'admin';

// User Status
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

// Parking Space Status
export type ParkingStatus = 'active' | 'inactive' | 'pending_approval' | 'rejected';

// Reservation Status
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired' | 'completed';

// Session Status
export type SessionStatus = 'active' | 'completed' | 'cancelled';

// Document Type
export type DocumentType = 'license' | 'registration' | 'insurance' | 'ownership_proof' | 'payment_proof';

// Notification Type
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isEmailVerified: boolean;
}

// Driver Profile
export interface DriverProfile {
  userId: string;
  vehicles: Vehicle[];
  totalSpent: number;
  totalSessions: number;
  favoriteLocations: string[];
}

// Vehicle Interface
export interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  model: string;
  color: string;
  year: number;
  isDefault: boolean;
}

// Parking Owner Profile
export interface OwnerProfile {
  userId: string;
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
  totalEarnings: number;
  totalSpaces: number;
  activeSpaces: number;
  documents: Document[];
}

// Document Interface
export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

// Parking Space Interface
export interface ParkingSpace {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  hourlyRate: number;
  totalSpots: number;
  availableSpots: number;
  status: ParkingStatus;
  features: ParkingFeature[];
  openingHours: OpeningHours;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  reviewCount: number;
}

// Parking Features
export type ParkingFeature = 
  | 'covered' 
  | 'security' 
  | 'cctv' 
  | 'lighting' 
  | 'ev_charging' 
  | 'handicap_accessible' 
  | '24_7' 
  | 'staffed';

// Opening Hours
export interface OpeningHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

// Reservation Interface
export interface Reservation {
  id: string;
  userId: string;
  parkingSpaceId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  parkingSpace?: ParkingSpace;
  vehicle?: Vehicle;
}

// Parking Session Interface
export interface ParkingSession {
  id: string;
  userId: string;
  parkingSpaceId: string;
  vehicleId: string;
  reservationId?: string;
  startTime: Date;
  endTime?: Date;
  status: SessionStatus;
  hourlyRate: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  parkingSpace?: ParkingSpace;
  vehicle?: Vehicle;
}

// Payment Interface
export interface Payment {
  id: string;
  userId: string;
  sessionId?: string;
  reservationId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  paidAt?: Date;
  createdAt: Date;
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

// Review Interface
export interface Review {
  id: string;
  userId: string;
  parkingSpaceId: string;
  sessionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
}

// Activity Log Interface
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  totalDrivers: number;
  totalOwners: number;
  totalParkingSpaces: number;
  activeParkingSpaces: number;
  totalSessions: number;
  activeSessions: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingApprovals: number;
  pendingDocuments: number;
}

// Owner Dashboard Stats
export interface OwnerDashboardStats {
  totalSpaces: number;
  activeSpaces: number;
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  activeSessions: number;
  pendingReservations: number;
  totalReservations: number;
  occupancyRate: number;
}

// Driver Dashboard Stats
export interface DriverDashboardStats {
  totalSessions: number;
  activeSessions: number;
  totalSpent: number;
  favoriteLocations: number;
  upcomingReservations: number;
  vehicles: number;
}

// Search Filters
export interface ParkingSearchFilters {
  location?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  features?: ParkingFeature[];
  availableOnly?: boolean;
  startTime?: Date;
  endTime?: Date;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

// Register Data
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}

// Theme Context Type
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Map Marker
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: number;
  available: number;
  total: number;
}

// Chart Data
export interface ChartData {
  label: string;
  value: number;
  date?: string;
}
