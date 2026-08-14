import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import LoadingScreen from '../components/auth/LoadingScreen';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { status, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading || status === 'loading') {
    return <LoadingScreen message="Checking session..." />;
  }

  if (status === 'authenticated') {
    const fromLocation = (location.state as any)?.from;
    const targetPath = fromLocation?.pathname;
    const targetSearch = fromLocation?.search || '';
    const destination = (targetPath && targetPath !== '/login' && targetPath !== '/onboarding')
      ? `${targetPath}${targetSearch}`
      : '/dashboard';

    return <Navigate to={destination} replace />;
  }

  if (status === 'needs-profile') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
