import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import LoadingScreen from '../components/auth/LoadingScreen';

interface RequireAuthProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export default function RequireAuth({ children, requireProfile = true }: RequireAuthProps) {
  const { status, loading } = useAuth();
  const location = useLocation();

  if (loading || status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfile && status === 'needs-profile') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
