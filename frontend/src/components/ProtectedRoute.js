import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="card" style={{ textAlign: 'center' }}><p>Loading...</p></div>;
  }

  if (!token || !user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
