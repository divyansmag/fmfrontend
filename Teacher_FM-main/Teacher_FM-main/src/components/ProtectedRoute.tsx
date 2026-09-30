import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    if (user.role === 'parent') {
      return <Navigate to="/parent/dashboard" replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
