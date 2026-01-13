'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import CategoryBadge from '@/components/CategoryBadge';
import ImageModal from '@/components/ImageModal';

interface Complaint {
  _id: string;
  name: string;
  email: string;
  complaintText: string;
  location?: string;
  imageUrl?: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  department: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  isDuplicate: boolean;
  createdAt: string;
}

export default function HighPriority() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const getDepartmentTranslation = (department: string) => {
    const deptMap: Record<string, string> = {
      'Municipal Department': 'department.municipal',
      'Health Department': 'department.health',
      'Education Department': 'department.education',
      'Police Department': 'department.police',
      'Utilities Department': 'department.utilities',
      'Administrative Department': 'department.administrative',
    };
    return deptMap[department] ? t(deptMap[department]) : department;
  };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/complaints/get?admin=true&priority=High', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setComplaints(data.complaints || []);
      } else {
        toast.error(data.error || t('track.error'));
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error(t('track.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">{t('admin.loading')}</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">{t('admin.priority.title')}</h1>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.id')}
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.category')}
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.image')}
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.department')}
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.status')}
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.created')}
                </th>
                <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.table.complaint')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {t('track.notfound')}
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {complaint._id.substring(0, 8)}...
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <CategoryBadge category={complaint.category} />
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      {complaint.imageUrl ? (
                        <button
                          onClick={() => setSelectedImage(complaint.imageUrl!)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          📷 {t('admin.view')}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getDepartmentTranslation(complaint.department)}
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {complaint.complaintText}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {complaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400 transition-colors">
            {t('track.notfound')}
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={complaint.category} />
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="text-sm text-gray-900 dark:text-white line-clamp-3">
                  {complaint.complaintText}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">{t('admin.table.department')}:</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {getDepartmentTranslation(complaint.department)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">{t('admin.table.created')}:</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {complaint.imageUrl && (
                  <button
                    onClick={() => setSelectedImage(complaint.imageUrl!)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    📷 {t('admin.view')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          allowDownload={true}
        />
      )}
    </div>
  );
}

