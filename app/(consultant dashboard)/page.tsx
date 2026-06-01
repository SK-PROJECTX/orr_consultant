'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConsultantStore } from '@/store/consultantStore';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useConsultantStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/signin');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#61FD51] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
