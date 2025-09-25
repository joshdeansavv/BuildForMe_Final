import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingSpinner 
        variant="fullscreen" 
        message="Authenticating..." 
      />
    );
  }

  if (!user) {
    // Save the attempted URL for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingSpinner 
        variant="fullscreen" 
        message="Loading..." 
      />
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}; 