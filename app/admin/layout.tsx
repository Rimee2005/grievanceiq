'use client';

import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile: open/closed
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop: expanded/collapsed
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if current route is login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) {
      return;
    }
    
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
  }, [router, isLoginPage]);

  // Initialize sidebar state and detect mobile/desktop
  useEffect(() => {
    // Skip sidebar initialization on login page
    if (isLoginPage) {
      return;
    }
    
    const updateLayout = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        
        if (mobile) {
          // Mobile: sidebar closed by default
          setSidebarOpen(false);
        } else {
          // Desktop: sidebar open (expanded) by default
          setSidebarOpen(true);
          setSidebarCollapsed(false);
        }
      }
    };
    
    // Set initial state
    updateLayout();
    
    // Handle window resize
    window.addEventListener('resize', updateLayout);
    
    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, [isLoginPage]);

  // If login page, render only children without Sidebar or menu button
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors">
      <Sidebar
        userName={user?.name}
        userRole={user?.role}
        isOpen={isMobile ? sidebarOpen : true}
        isCollapsed={!isMobile && sidebarCollapsed}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Mobile Top App Bar with Hamburger */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-gray-800 dark:bg-gray-950 border-b border-gray-700 dark:border-gray-800 z-40 flex items-center px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded transition-colors duration-200"
            aria-label="Open sidebar menu"
            title="Open Menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}
      
      {/* Main Content - Dynamically adjusts margin based on sidebar state */}
      <div 
        className={`
          flex-1 
          overflow-auto 
          bg-gray-100 
          dark:bg-gray-800 
          transition-all 
          duration-[250ms] 
          ease-in-out
          ${isMobile ? 'ml-0' : sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        {/* Content Container - Adjusts padding based on sidebar state */}
        <div 
          className={`
            p-4 
            sm:p-6 
            lg:p-8 
            transition-all 
            duration-250 
            ease-in-out
            ${isMobile ? 'pt-20' : 'pt-8'}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
