import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetOverlay, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, UserCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileNavOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigation: { name: string; href: string }[];
}

export const MobileNavOverlay: React.FC<MobileNavOverlayProps> = ({ open, onOpenChange, navigation }) => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path.startsWith('/dashboard')) {
      return location.pathname.startsWith('/dashboard');
    }
    return location.pathname === path;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay className="fixed inset-0 z-[9999] bg-black/95" />
      <SheetContent
        side="top"
        className="fixed inset-0 z-[9999] bg-black flex flex-col justify-between p-0 border-0"
        style={{ 
          maxWidth: '100vw', 
          width: '100vw', 
          height: '100vh', 
          borderRadius: 0,
          animation: 'none',
          transition: 'none'
        }}
      >
        {/* Top bar - moved logo down with extra padding */}
        <div className="flex items-center justify-center px-6" style={{ paddingTop: 'calc(env(safe-area-inset-top, 1rem) + 2rem)' }}>
          <Link to="/" onClick={() => onOpenChange(false)} className="flex items-center">
            <span className="logo-text text-2xl font-bold">BuildForMe</span>
          </Link>
        </div>
        
        {/* Nav links */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => onOpenChange(false)}
              className={`text-3xl md:text-5xl font-extrabold tracking-tight transition-all duration-200 ${
                isActiveRoute(item.href)
                  ? 'text-white'
                  : 'text-gray-600 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Bottom: Account or Sign In - positioned just above URL bar */}
        <div 
          className="px-6" 
          style={{ 
            paddingBottom: 'calc(env(safe-area-inset-bottom, 1rem) + 4.875rem)',
            marginBottom: 'calc(env(safe-area-inset-bottom, 1rem) + 3.875rem)'
          }}
        >
          {user ? (
            <div className="flex items-center gap-4 bg-gray-900/80 rounded-xl p-4 h-16">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.user_metadata?.avatar_url || undefined}
                  alt="Profile"
                  className="object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <AvatarFallback className="bg-gray-700 text-white font-semibold">
                  {(user.user_metadata?.global_name || user.user_metadata?.username || user.email?.split('@')[0] || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {user.user_metadata?.global_name || user.user_metadata?.username || user.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-gray-400 text-sm truncate">
                  {user.email}
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-400"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="w-full h-16 text-lg font-bold rounded-xl bg-gray-900/60 hover:bg-gray-900/80 text-white border border-gray-800 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/auth" className="flex items-center">
                <UserCircle2 className="mr-2 w-5 h-5" />
                Continue with Discord
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}; 