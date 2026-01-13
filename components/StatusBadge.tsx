'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface StatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();
  const colors = {
    Pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'In Progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    Resolved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  };

  const statusText = {
    Pending: t('admin.status.pending'),
    'In Progress': t('admin.status.inProgress'),
    Resolved: t('admin.status.resolved'),
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {statusText[status]}
    </span>
  );
}

