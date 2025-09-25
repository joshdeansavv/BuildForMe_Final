import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetOverlay, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';

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
    if (path.startsWith('/dashboard') || path.startsWith('/servers') || path.startsWith('/billing')) {
      return location.pathname.startsWith(path);
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
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    <img
                      src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                      style={{
                        WebkitMaskImage: '-webkit-radial-gradient(white, black)'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </div>
              </div>
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
                Log out
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="w-full h-16 text-lg font-bold rounded-xl btn-gradient shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/auth">
                <svg className="mr-2 w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056a19.9 19.9 0 0 0 5.995 3.037a.077.077 0 0 0 .084-.027a13.9 13.9 0 0 0 1.21-1.965a.076.076 0 0 0-.041-.104a12.3 12.3 0 0 1-1.753-.832a.077.077 0 0 1-.008-.128c.117-.088.234-.18.346-.274a.074.074 0 0 1 .077-.01c3.676 1.68 7.633 1.68 11.287 0a.075.075 0 0 1 .078.009c.112.094.229.186.346.274a.074.074 0 0 1-.006.128a12.083 12.083 0 0 1-1.754.832a.076.076 0 0 0-.04.105c.36.68.77 1.34 1.21 1.964a.076.076 0 0 0 .084.028a19.876 19.876 0 0 0 6.002-3.037a.077.077 0 0 0 .03-.055c.5-5.177-.838-9.673-3.548-13.66a.062.062 0 0 0-.03-.028z" />
                </svg>
                Continue with Discord
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}; 