'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProfilePageContent from '@/components/profile/ProfilePageContent';

export default function ProfilePage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace('/dashboard/profile');
    }
  }, [loading, isAdmin, router]);

  if (loading || isAdmin) {
    return null;
  }

  return <ProfilePageContent />;
}
