import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/flo-logo.svg" alt="Flo" className="w-8 h-8 rounded-full" />
            <span className="font-syne text-2xl font-bold text-warm-100 tracking-tight">Flo</span>
          </div>
          <div className="w-6 h-0.5 bg-accent-indigo skeleton rounded-full" />
        </div>
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
