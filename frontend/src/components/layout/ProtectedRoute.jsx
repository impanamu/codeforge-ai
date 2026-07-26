import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../common/UIComponents';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: 'var(--bg-darker)',
          gap: '1rem',
        }}
      >
        <Spinner size={32} style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Authenticating CodeForge Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
