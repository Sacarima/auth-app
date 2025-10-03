import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show a tiny spinner while we *truly* don't know yet
  if (loading) return <div className="center">Loading…</div>;

  // If not authenticated, punt to /login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
