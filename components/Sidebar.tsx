'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  userName?: string;
  userRole?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ userName, userRole, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  const menuItems = [
    { href: '/admin', key: 'admin.dashboard', icon: '📊' },
    { href: '/admin/complaints', key: 'admin.complaints', icon: '📋' },
    { href: '/admin/priority', key: 'admin.priority', icon: '🔴' },
    { href: '/admin/duplicates', key: 'admin.duplicates', icon: '🔄' },
    { href: '/admin/analytics', key: 'admin.analytics', icon: '📈' },
  ];

  return (
    <>
      {/* Mobile Overlay - Only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
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
          w-64
          bg-gray-800 dark:bg-gray-900
          text-white
          z-50
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          min-h-screen
          shadow-2xl
          lg:shadow-none
        `}
      >
        {/* Header with Toggle Button */}
        <div className="p-4 border-b border-gray-700 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('admin.panel') || 'Admin Panel'}</h2>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close sidebar"
            title="Close Menu"
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

        {/* User Info */}
        {userName && (
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
                flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors
                ${pathname === item.href ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="text-sm md:text-base">{t(item.key) || item.key}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 mt-4 border-t border-gray-700 transition-colors text-left"
          >
            <span className="mr-3 text-lg">🚪</span>
            <span className="text-sm md:text-base">{t('admin.logout') || 'Logout'}</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
