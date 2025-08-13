import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  ArrowLeft, 
  Bot, 
  Search,
  AlertCircle,
  Sparkles,
  Crown,
  Settings,
  MapPin,
  Clock,
  Users,
  Info,
  Zap,
  Server
} from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    { href: '/', label: 'Home', icon: Home, description: 'Back to homepage' },
    { href: '/auth', label: 'Sign In', icon: Bot, description: 'Access your account' },
    { href: '/pricing', label: 'Pricing', icon: Crown, description: 'View plans' },
    { href: '/dashboard', label: 'Dashboard', icon: Server, description: 'Manage your servers' }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main 404 Content */}
        <div className="text-center mb-12">
          {/* Error Badge removed per design simplification */}

          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl font-bold gradient-text-animated tracking-tighter">
              404
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Oops! Page not found
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild
              className="btn-primary px-8 py-3 text-lg font-semibold"
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-lg font-semibold"
            >
              <Link to="/auth">
                <Bot className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Navigation */}
        <Card className="backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Quick Navigation
              </h3>
              <p className="text-gray-400">
                Here are some popular pages you might be looking for
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:bg-gray-900/50"
                >
                  <div className="flex items-center mb-2">
                    <link.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="ml-2 font-semibold text-white group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Can't find what you're looking for?{' '}
            <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
