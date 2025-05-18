
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse mx-auto"/>
          <div className="h-4 w-32 bg-muted animate-pulse mx-auto"/>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
