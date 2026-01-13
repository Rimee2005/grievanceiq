'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HelpSupport() {
  const { t } = useLanguage();

  const helpOptions = [
    {
      id: 'submit',
      icon: '📝',
      title: t('help.issue.submit'),
      description: t('help.issue.submit.desc'),
      action: t('help.action.submit'),
      href: '/submit',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      id: 'delayed',
      icon: '⏱️',
      title: t('help.issue.delayed'),
      description: t('help.issue.delayed.desc'),
      action: t('help.action.track'),
      href: '/track',
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30',
      iconBg: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      id: 'login',
      icon: '🔐',
      title: t('help.issue.login'),
      description: t('help.issue.login.desc'),
      action: t('help.action.login'),
      href: '/admin/login',
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      id: 'update',
      icon: '✏️',
      title: t('help.issue.update'),
      description: t('help.issue.update.desc'),
      action: t('help.action.track'),
      href: '/track',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30',
      iconBg: 'bg-green-100 dark:bg-green-900',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('help.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('help.subtitle')}
          </p>
        </div>

        {/* Guided Help Options */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t('help.guided.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpOptions.map((option) => (
              <div
                key={option.id}
                className={`${option.color} rounded-xl shadow-md p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${option.iconBg} rounded-lg p-3 flex-shrink-0`}>
                    <span className="text-3xl">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm md:text-base">
                      {option.description}
                    </p>
                    <Link
                      href={option.href}
                      className="inline-block bg-gov-blue dark:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gov-dark dark:hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      {option.action} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
