import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ThemeProvider, NotificationProvider, useAuth } from '@/contexts';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

// Driver Pages
import { DriverDashboard } from '@/pages/driver/DriverDashboard';
import { ParkingSearch } from '@/pages/driver/ParkingSearch';
import { Reservations } from '@/pages/driver/Reservations';
import { Sessions } from '@/pages/driver/Sessions';
import { Vehicles } from '@/pages/driver/Vehicles';

// Owner Pages
import { OwnerDashboard } from '@/pages/owner/OwnerDashboard';
import { ParkingSpaces } from '@/pages/owner/ParkingSpaces';
import { Earnings } from '@/pages/owner/Earnings';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { UserManagement } from '@/pages/admin/UserManagement';
import { Approvals } from '@/pages/admin/Approvals';

// Shared Pages
import { Notifications } from '@/pages/Notifications';
import { Settings } from '@/pages/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'driver') return <Navigate to="/driver" replace />;
    if (user.role === 'owner') return <Navigate to="/owner" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Role-based redirect component
const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'driver') return <Navigate to="/driver" replace />;
  if (user?.role === 'owner') return <Navigate to="/owner" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  
  return <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <NotificationProvider userId={user?.id}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Root redirect based on role */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Driver Routes */}
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/search"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <ParkingSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/reservations"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <Reservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/sessions"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <Sessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/vehicles"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <Vehicles />
              </ProtectedRoute>
            }
          />

          {/* Owner Routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/spaces"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <ParkingSpaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/reservations"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Reservations</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/sessions"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Active Sessions</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/earnings"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <Earnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/documents"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Documents</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/spaces"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Parking Spaces</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/documents"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Documents</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Activity Log</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['driver', 'owner', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['driver', 'owner', 'admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
