import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuthStore();
  const isUser = user?.role?.name?.toLowerCase() === 'user' || !user;

  // For syncing stores, we could use effects here to fetch if necessary,
  // but it's typically done by hooks inside components (e.g. useCart).

  return (
    <>
      <Toaster position="top-right" />
      
      <Header isUser={isUser} />
      
      {isUser && <SubHeader activeMart={user?.active_mart} />}
      
      <main className={isUser ? "pt-[120px]" : "pt-[80px]"}>
        {children}
      </main>
      
      <Footer isUser={isUser} />
    </>
  );
}
