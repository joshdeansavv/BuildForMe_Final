import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  LogOut,
  Home,
  BarChart3,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import { MobileNavOverlay } from '@/components/MobileNavOverlay';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, signOut, subscription } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/dashboard')) return location.pathname.startsWith('/dashboard');
    return location.pathname === path;
  };

  const navigation = useMemo(
    () => [
      { name: 'Home', href: '/', icon: Home },
      ...(user ? [{ name: 'Dashboard', href: '/dashboard', icon: BarChart3 }] : []),
      ...(!subscription?.subscribed ? [{ name: 'Pricing', href: '/pricing', icon: CreditCard }] : []),
      { name: 'Commands', href: '/commands', icon: HelpCircle },
    ],
    [user, subscription?.subscribed]
  );

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const userInitial =
    user?.user_metadata?.global_name?.[0]?.toUpperCase() ||
    user?.user_metadata?.username?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  // No separate mobile account icon; account actions live inside the mobile nav overlay

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled ? 'bg-black/70 border-b border-gray-800/60 backdrop-blur-xl' : 'bg-black/40 backdrop-blur-md'
      } ${className}`}
      style={{ WebkitBackdropFilter: 'saturate(180%) blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <span className="logo-text text-xl sm:text-2xl">BuildForMe</span>
          </Link>

          {/* Center/Right: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 lg:px-4 rounded-xl text-sm lg:text-base font-semibold transition-all ${
                  isActiveRoute(item.href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Desktop Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="ml-1 h-10 w-10 rounded-full p-0 hover:bg-gray-800/60 focus:ring-0 focus:outline-none"
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url || undefined}
                        alt="Profile"
                        className="object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-gray-600 text-white font-semibold text-sm">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2" sideOffset={10}>
                  <div className="flex flex-col gap-1 p-4">
                    <p className="font-medium text-sm text-white truncate">
                      {user?.user_metadata?.global_name ||
                        user?.user_metadata?.username ||
                        user?.email?.split('@')[0] ||
                        'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 hover:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="ml-2 bg-white text-black hover:bg-gray-100 border border-gray-200 rounded-xl"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Right: Mobile icons */}
          <div className="md:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              className="h-9 w-9 rounded-full text-gray-300 hover:text-white hover:bg-gray-800/60"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <MobileNavOverlay open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} navigation={navigation} />
    </header>
  );
};