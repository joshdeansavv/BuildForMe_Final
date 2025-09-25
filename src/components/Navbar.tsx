import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Home,
  BarChart3,
  CreditCard,
  Server,
  HelpCircle
} from 'lucide-react';
import { MobileNavOverlay } from '@/components/MobileNavOverlay';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, signOut, subscription } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path.startsWith('/dashboard')) {
      return location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/servers') || location.pathname.startsWith('/billing');
    }
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    ...(user ? [
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ] : []),
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const userInitials = user?.user_metadata?.global_name?.[0]?.toUpperCase() || user?.user_metadata?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className={`bg-black/95 border-b border-gray-800 backdrop-blur-xl ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="logo-text">BuildForMe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActiveRoute(item.href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-600 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 relative">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {(user?.user_metadata?.global_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col gap-1 p-2">
                    <p className="font-medium text-sm">{user?.user_metadata?.global_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-white text-black hover:bg-gray-100 border border-gray-200">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <MobileNavOverlay 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
        navigation={navigation}
      />
    </header>
  );
};