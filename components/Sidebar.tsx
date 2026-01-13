'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  userName?: string;
  userRole?: string;
  isOpen: boolean; // For mobile: open/closed. For desktop: expanded/collapsed
  isCollapsed?: boolean; // Desktop only: true = icon-only, false = full width
  onToggle: () => void;
  onCollapse?: () => void; // Desktop only: toggle collapse/expand
}

export default function Sidebar({ userName, userRole, isOpen, isCollapsed = false, onToggle, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { href: '/admin', key: 'admin.dashboard', icon: '📊' },
    { href: '/admin/complaints', key: 'admin.complaints', icon: '📋' },
    { href: '/admin/priority', key: 'admin.priority', icon: '🔴' },
    { href: '/admin/duplicates', key: 'admin.duplicates', icon: '🔄' },
    { href: '/admin/analytics', key: 'admin.analytics', icon: '📈' },
  ];

  return (
    <>
      {/* Mobile Overlay - Only on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-250 ease-in-out"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0 left-0
          h-full
          bg-gray-800 dark:bg-gray-900
          text-white
          z-50
          transition-all
          duration-[250ms]
          ease-in-out
          min-h-screen
          shadow-2xl
          lg:shadow-none
          w-64
          ${
            // Mobile: slide in/out
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }
          lg:translate-x-0
          ${
            // Desktop: collapse width (icon-only = 64px, full = 256px)
            isCollapsed ? 'lg:w-16' : 'lg:w-64'
          }
        `}
      >
        {/* Header with Toggle Button */}
        <div className={`p-4 border-b border-gray-700 dark:border-gray-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h2 className="text-xl font-bold whitespace-nowrap">{t('admin.panel') || 'Admin Panel'}</h2>
          )}
          {/* Desktop: Collapse/Expand toggle (chevron) - hidden on mobile */}
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="hidden lg:block p-1.5 hover:bg-gray-700 rounded transition-colors duration-200"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                />
              </svg>
            </button>
          )}
          {/* Mobile: Close button (✕) - hidden on desktop */}
          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 hover:bg-gray-700 rounded transition-colors duration-200 ml-auto"
            aria-label="Close sidebar"
            title="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Info - Hidden when collapsed on desktop */}
        {userName && !isCollapsed && (
          <div className="p-4 border-b border-gray-700 dark:border-gray-700">
            <p className="text-sm text-gray-300 truncate">{userName}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 rounded">
              {userRole || (t('admin.role') || 'Admin')}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                // Close sidebar on mobile when navigating
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  onToggle();
                }
              }}
              className={`
                flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200
                ${pathname === item.href ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? (t(item.key) || item.key) : undefined}
            >
              <span className={`text-lg ${isCollapsed ? '' : 'mr-3'}`}>{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm md:text-base whitespace-nowrap">{t(item.key) || item.key}</span>
              )}
            </Link>
          ))}
          <button
            onClick={() => {
              // Clear all authentication tokens
              localStorage.removeItem('token');
              // Clear admin_token cookie
              document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              // Redirect to admin login page
              window.location.href = '/admin/login';
            }}
            className={`w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 mt-4 border-t border-gray-700 transition-colors duration-200 text-left ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? (t('admin.logout') || 'Logout') : undefined}
          >
            <span className={`text-lg ${isCollapsed ? '' : 'mr-3'}`}>🚪</span>
            {!isCollapsed && (
              <span className="text-sm md:text-base whitespace-nowrap">{t('admin.logout') || 'Logout'}</span>
            )}
          </button>
        </nav>
      </aside>
    </>
  );
}
