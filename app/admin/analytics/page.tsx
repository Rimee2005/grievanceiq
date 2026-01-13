'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Analytics {
  kpis: {
    totalComplaints: number;
    highPriority: number;
    withImages: number;
    duplicates: number;
    pending: number;
    resolved: number;
  };
  categoryCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  imageStats: {
    withImage: number;
    withoutImage: number;
  };
  duplicateStats: {
    duplicates: number;
    unique: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function Analytics() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAnalytics(data.analytics);
      } else {
        toast.error(data.error || t('track.error'));
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error(t('track.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">{t('admin.loading')}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">{t('admin.analytics.noData')}</div>;
  }

  // Helper function to translate category names
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Infrastructure': 'category.infrastructure',
      'Sanitation': 'category.sanitation',
      'Healthcare': 'category.healthcare',
      'Education': 'category.education',
      'Public Safety': 'category.publicSafety',
      'Utilities': 'category.utilities',
      'Administrative Delay': 'category.administrativeDelay',
    };
    return categoryMap[category] ? t(categoryMap[category]) : category;
  };

  // Helper function to translate priority names
  const translatePriority = (priority: string) => {
    const priorityMap: Record<string, string> = {
      'High': 'admin.priority.high',
      'Medium': 'admin.priority.medium',
      'Low': 'admin.priority.low',
    };
    return priorityMap[priority] ? t(priorityMap[priority]) : priority;
  };

  // Helper function to translate status names
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'Pending': 'admin.status.pending',
      'In Progress': 'admin.status.inProgress',
      'Resolved': 'admin.status.resolved',
    };
    return statusMap[status] ? t(statusMap[status]) : status;
  };

  // Prepare data for charts with translations
  const categoryData = Object.entries(analytics.categoryCounts).map(([name, value]) => ({
    name: translateCategory(name),
    value,
  }));

  const priorityData = Object.entries(analytics.priorityCounts).map(([name, value]) => ({
    name: translatePriority(name),
    value,
  }));

  const statusData = Object.entries(analytics.statusCounts).map(([name, value]) => ({
    name: translateStatus(name),
    value,
  }));

  const imageData = [
    { name: t('admin.analytics.withImage'), value: analytics.imageStats.withImage },
    { name: t('admin.analytics.withoutImage'), value: analytics.imageStats.withoutImage },
  ];

  const duplicateData = [
    { name: t('admin.analytics.duplicates'), value: analytics.duplicateStats.duplicates },
    { name: t('admin.analytics.unique'), value: analytics.duplicateStats.unique },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">{t('admin.analytics.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Complaints by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('admin.analytics.category')}</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('admin.analytics.priority')}</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('admin.analytics.resolution')}</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Image vs No Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('admin.analytics.image')}</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={imageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {imageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Duplicate vs Unique */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('admin.analytics.duplicate')}</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={duplicateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {duplicateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

