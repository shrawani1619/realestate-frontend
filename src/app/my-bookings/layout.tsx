'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MyBookingsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
