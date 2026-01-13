'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface PriorityBadgeProps {
  priority: 'High' | 'Medium' | 'Low';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useLanguage();
  const colors = {
    High: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    Medium: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    Low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  };

  const priorityText = {
    High: t('admin.priority.high'),
    Medium: t('admin.priority.medium'),
    Low: t('admin.priority.low'),
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[priority]}`}>
      {priorityText[priority]}
    </span>
  );
}

