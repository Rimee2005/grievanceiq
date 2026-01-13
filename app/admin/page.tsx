'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface KPIs {
  totalComplaints: number;
  highPriority: number;
  withImages: number;
  duplicates: number;
  pending: number;
  resolved: number;
}

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch('/api/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/admin/login';
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setKpis(data.analytics.kpis);
      } else {
        toast.error(data.error || t('track.error'));
      }
    } catch (error) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching analytics:', error);
      }
      toast.error(t('track.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">{t('admin.dashboard.loading')}</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">{t('admin.dashboard.overview')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.total')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                {kpis?.totalComplaints || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.highPriority')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mt-1 sm:mt-2">
                {kpis?.highPriority || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">🔴</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.withImages')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1 sm:mt-2">
                {kpis?.withImages || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">📷</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.duplicates')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1 sm:mt-2">
                {kpis?.duplicates || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">🔄</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.pending')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 sm:mt-2">
                {kpis?.pending || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.resolved')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2">
                {kpis?.resolved || 0}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">✅</div>
          </div>
        </div>
      </div>
    </div>
  );
}

