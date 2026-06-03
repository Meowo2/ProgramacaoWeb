import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Carregando...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
