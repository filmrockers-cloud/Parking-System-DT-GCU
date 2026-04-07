import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Clock,
  Car,
  Building2,
  DollarSign,
  Users,
  FileCheck,
  Settings,
  LogOut,
  Shield,
  ClipboardList,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  // Driver routes
  { label: 'Dashboard', href: '/driver', icon: LayoutDashboard, roles: ['driver'] },
  { label: 'Find Parking', href: '/driver/search', icon: MapPin, roles: ['driver'] },
  { label: 'My Reservations', href: '/driver/reservations', icon: Calendar, roles: ['driver'] },
  { label: 'Active Sessions', href: '/driver/sessions', icon: Clock, roles: ['driver'] },
  { label: 'My Vehicles', href: '/driver/vehicles', icon: Car, roles: ['driver'] },
  
  // Owner routes
  { label: 'Dashboard', href: '/owner', icon: LayoutDashboard, roles: ['owner'] },
  { label: 'My Parking Spaces', href: '/owner/spaces', icon: Building2, roles: ['owner'] },
  { label: 'Reservations', href: '/owner/reservations', icon: Calendar, roles: ['owner'] },
  { label: 'Active Sessions', href: '/owner/sessions', icon: Clock, roles: ['owner'] },
  { label: 'Earnings', href: '/owner/earnings', icon: DollarSign, roles: ['owner'] },
  { label: 'Documents', href: '/owner/documents', icon: FileCheck, roles: ['owner'] },
  
  // Admin routes
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin'] },
  { label: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
  { label: 'Parking Spaces', href: '/admin/spaces', icon: Building2, roles: ['admin'] },
  { label: 'Approvals', href: '/admin/approvals', icon: ClipboardList, roles: ['admin'] },
  { label: 'Documents', href: '/admin/documents', icon: FileCheck, roles: ['admin'] },
  { label: 'Activity Log', href: '/admin/activity', icon: Shield, roles: ['admin'] },
  
  // Common routes
  { label: 'Notifications', href: '/notifications', icon: Bell, roles: ['driver', 'owner', 'admin'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['driver', 'owner', 'admin'] },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Car className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">ParkSmart</span>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
            alt={user?.firstName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 lg:hidden"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
        {sidebarContent}
      </aside>
    </>
  );
};
