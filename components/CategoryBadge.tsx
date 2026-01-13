'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryBadgeProps {
  category: string;
}

const categoryMap: Record<string, string> = {
  'Infrastructure': 'category.infrastructure',
  'Sanitation': 'category.sanitation',
  'Healthcare': 'category.healthcare',
  'Education': 'category.education',
  'Public Safety': 'category.publicSafety',
  'Utilities': 'category.utilities',
  'Administrative Delay': 'category.administrativeDelay',
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const { t } = useLanguage();
  const translationKey = categoryMap[category] || category;
  const displayText = translationKey.startsWith('category.') ? t(translationKey) : category;
  
  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
      {displayText}
    </span>
  );
}

