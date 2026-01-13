'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatButton from '@/components/ChatButton';

export default function ConditionalPublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPublicLayout, setShowPublicLayout] = useState(true);

  // Memoize pathname checks for performance
  const pathInfo = useMemo(() => {
    const adminPath = pathname?.startsWith('/admin');
    const loginPath = pathname === '/admin/login';
    return { adminPath, loginPath };
  }, [pathname]);

  useEffect(() => {
    // Check if we're on an admin page
    const { adminPath, loginPath } = pathInfo;
    
    if (!adminPath) {
      // Not an admin page, show public layout
      setShowPublicLayout(true);
      return;
    }
    
    if (loginPath) {
      // On login page, show public layout (Navbar + Footer)
      setShowPublicLayout(true);
      return;
    }
    
    // On authenticated admin page, check for token synchronously
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // Hide public layout (Navbar/Footer) if token exists (authenticated)
      setShowPublicLayout(!token);
    }
  }, [pathInfo]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {showPublicLayout && <Navbar />}
      <main className={`flex-grow ${showPublicLayout ? 'pt-16' : ''}`}>{children}</main>
      {showPublicLayout && <Footer />}
      {showPublicLayout && <ChatButton />}
    </div>
  );
}

