'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPostAuthRedirect } from '@/lib/auth-redirect';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { loading, isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated()) {
      const from = pathname ? `?from=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${from}`);
      return;
    }

    if (requireAdmin && !isAdmin && user) {
      router.replace(getPostAuthRedirect(user.role));
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Checking access...
      </div>
    );
  }

  if (!isAuthenticated()) return null;
  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
