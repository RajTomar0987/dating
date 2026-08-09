import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import LoadingScreen from '../components/auth/LoadingScreen';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { status, loading } = useAuth();
  const location = useLocation();

  if (loading || status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'authenticated') {
    // Redirect to where they came from, or dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  if (status === 'needs-profile') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
