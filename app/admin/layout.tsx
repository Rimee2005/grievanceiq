'use client';

import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (in a real app, you'd verify the token)
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    } else {
      // Decode token to get user info (simplified - in production use proper JWT decoding)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: payload.email, role: payload.role });
      } catch (e) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  // Initialize sidebar state: hidden by default on mobile, open by default on desktop
  useEffect(() => {
    // Set initial state: closed on mobile, open on desktop
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Sidebar
        userName={user?.name}
        userRole={user?.role}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content - Dynamically adjusts margin based on sidebar state */}
      <div 
        className={`
          flex-1 
          overflow-auto 
          bg-gray-100 
          dark:bg-gray-900 
          transition-all 
          duration-300 
          ease-in-out
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
        `}
      >
        {/* Toggle Button - Always visible when sidebar is closed (mobile and desktop) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-[60] p-3.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group animate-pulse hover:animate-none"
            aria-label="Open sidebar menu"
            title="Click to open menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="hidden md:inline-block text-sm font-semibold whitespace-nowrap">
              Menu
            </span>
          </button>
        )}

        {/* Content Container - Adjusts padding based on sidebar state */}
        <div 
          className={`
            p-4 
            sm:p-6 
            lg:p-8 
            transition-all 
            duration-300 
            ease-in-out
            ${!sidebarOpen ? 'pt-20 lg:pt-16' : 'pt-8'}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
