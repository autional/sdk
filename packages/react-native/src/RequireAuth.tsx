import { useEffect, useState, type ReactNode } from 'react';
import { useAuthms } from './AuthmsProvider';

interface RequireAuthProps {
  children: ReactNode;
  roles?: string[];
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

export function RequireAuth({ children, roles, fallback, loadingFallback }: RequireAuthProps) {
  const { isAuthenticated, isLoading, user } = useAuthms();
  const [phase, setPhase] = useState<'loading' | 'unauthenticated' | 'forbidden' | 'ok'>('loading');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setPhase('unauthenticated');
      return;
    }

    if (roles && roles.length > 0) {
      const userRole = (user as Record<string, unknown> | null)?.['role'] as string | undefined;
      if (userRole && !roles.includes(userRole)) {
        setPhase('forbidden');
        return;
      }
    }

    setPhase('ok');
  }, [isLoading, isAuthenticated, user, roles]);

  if (phase === 'loading') {
    return loadingFallback ? <>{loadingFallback}</> : null;
  }

  if (phase === 'unauthenticated' || phase === 'forbidden') {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
