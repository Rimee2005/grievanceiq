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

export default function AllComplaints() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    hasImage: '',
    isDuplicate: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
    // Also fetch debug info
    fetchDebugInfo();
  }, [filters]);

  const fetchDebugInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/complaints/debug-images', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/admin/login';
        return;
      }
      
      const data = await response.json();
      if (response.ok && process.env.NODE_ENV === 'development') {
        console.log('=== DEBUG INFO FROM DATABASE ===');
        console.log('Total complaints in DB:', data.debug.totalComplaints);
        console.log('Complaints with imageUrl:', data.debug.complaintsWithImageUrl);
        console.log('Complaints without imageUrl:', data.debug.complaintsWithoutImageUrl);
        console.log('Sample complaints:', data.debug.sampleComplaints);
        console.log('Complaints with images:', data.debug.complaintsWithImages);
        console.log('=== END DEBUG INFO ===');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching debug info:', error);
      }
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const params = new URLSearchParams({ admin: 'true' });
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.hasImage) params.append('hasImage', filters.hasImage);
      if (filters.isDuplicate) params.append('isDuplicate', filters.isDuplicate);

      const response = await fetch(`/api/complaints/get?${params.toString()}`, {
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

      // Always log response for debugging (even in production, but can be removed)
      console.log('[Admin Complaints] API Response:', {
        ok: response.ok,
        status: response.status,
        complaintsCount: data.complaints?.length || 0,
        hasComplaints: !!data.complaints,
        error: data.error,
      });

      if (response.ok) {
        const fetchedComplaints = data.complaints || [];
        
        console.log('[Admin Complaints] ✅ Fetched complaints:', {
          count: fetchedComplaints.length,
          firstComplaint: fetchedComplaints[0] ? {
            id: fetchedComplaints[0]._id,
            name: fetchedComplaints[0].name,
            category: fetchedComplaints[0].category,
          } : null,
        });
        
        // Debug logging only in development
        if (process.env.NODE_ENV === 'development') {
          // Log ALL complaints with their imageUrl status
          fetchedComplaints.forEach((c: Complaint, index: number) => {
            console.log(`Complaint ${index + 1}:`, {
              id: c._id,
              hasImageUrl: !!c.imageUrl,
              imageUrlType: typeof c.imageUrl,
              imageUrlValue: c.imageUrl,
              imageUrlLength: c.imageUrl?.length || 0,
              allKeys: Object.keys(c),
            });
          });
          
          // Debug: Log complaints with images
          const withImages = fetchedComplaints.filter((c: Complaint) => c.imageUrl).length;
          console.log(`[Admin UI] Fetched ${fetchedComplaints.length} complaints, ${withImages} with images`);
          
          // Log first complaint with image for debugging
          const firstWithImage = fetchedComplaints.find((c: Complaint) => c.imageUrl);
          if (firstWithImage) {
            console.log('[Admin UI] Sample complaint with image:', {
              id: firstWithImage._id,
              imageUrl: firstWithImage.imageUrl,
              hasImageUrl: !!firstWithImage.imageUrl,
              imageUrlPreview: firstWithImage.imageUrl?.substring(0, 100),
            });
          } else {
            console.warn('[Admin UI] No complaints with images found!');
          }
          
          console.log('=== ADMIN UI DEBUG END ===');
        }
        
        setComplaints(fetchedComplaints);
        
        // Show success message if complaints were found
        if (fetchedComplaints.length > 0) {
          console.log(`[Admin Complaints] ✅ Successfully loaded ${fetchedComplaints.length} complaints`);
        } else {
          console.warn('[Admin Complaints] ⚠️ No complaints found (check filters or database)');
        }
      } else {
        console.error('[Admin Complaints] ❌ API Error:', {
          status: response.status,
          error: data.error,
          details: data.details,
        });
        toast.error(data.error || t('track.error'));
      }
    } catch (error: any) {
      console.error('[Admin Complaints] ❌ Fetch Error:', {
        message: error.message,
        stack: error.stack,
      });
      toast.error(t('track.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    setUpdatingId(complaintId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch('/api/complaints/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId, status: newStatus }),
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
        toast.success(t('admin.status.updated'));
        fetchComplaints();
      } else {
        toast.error(data.error || t('track.error'));
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating status:', error);
      }
      toast.error(t('track.error.generic'));
    } finally {
      setUpdatingId(null);
    }
  };

  const categories = [
    'Infrastructure',
    'Sanitation',
    'Healthcare',
    'Education',
    'Public Safety',
    'Utilities',
    'Administrative Delay',
  ];

  const getCategoryTranslation = (category: string) => {
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

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">{t('admin.loading')}</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">{t('admin.complaints.title')}</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">{t('admin.filters')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.filter.category')}</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('admin.filter.all')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryTranslation(cat)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.filter.priority')}</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('admin.filter.all')}</option>
              <option value="High">{t('admin.priority.high')}</option>
              <option value="Medium">{t('admin.priority.medium')}</option>
              <option value="Low">{t('admin.priority.low')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.filter.status')}</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('admin.filter.all')}</option>
              <option value="Pending">{t('admin.status.pending')}</option>
              <option value="In Progress">{t('admin.status.inProgress')}</option>
              <option value="Resolved">{t('admin.status.resolved')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.filter.image')}</label>
            <select
              value={filters.hasImage}
              onChange={(e) => setFilters({ ...filters, hasImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('admin.filter.all')}</option>
              <option value="true">{t('admin.filter.yes')}</option>
              <option value="false">{t('admin.filter.no')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.filter.duplicate')}</label>
            <select
              value={filters.isDuplicate}
              onChange={(e) => setFilters({ ...filters, isDuplicate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('admin.filter.all')}</option>
              <option value="true">{t('admin.filter.yes')}</option>
              <option value="false">{t('admin.filter.no')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table - Desktop */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[8%]">
                  {t('admin.table.id')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                  {t('admin.table.category')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[8%]">
                  {t('admin.table.priority')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                  {t('admin.table.image')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[8%]">
                  {t('admin.table.duplicate')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[12%]">
                  {t('admin.table.department')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                  {t('admin.table.status')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                  {t('admin.table.created')}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[14%]">
                  {t('admin.table.action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {t('track.notfound')}
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white truncate">
                      {complaint._id.substring(0, 8)}...
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <CategoryBadge category={complaint.category} />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <PriorityBadge priority={complaint.priority} />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {(() => {
                        // Enhanced validation and debugging
                        const hasImage = complaint.imageUrl && 
                                       typeof complaint.imageUrl === 'string' && 
                                       complaint.imageUrl.trim() !== '' &&
                                       complaint.imageUrl !== 'null' &&
                                       complaint.imageUrl !== 'undefined';
                        
                        if (!hasImage && process.env.NODE_ENV === 'development') {
                          // Debug why image is not showing
                          console.log(`[Admin UI] Complaint ${complaint._id} has no valid image:`, {
                            imageUrl: complaint.imageUrl,
                            type: typeof complaint.imageUrl,
                            isEmpty: !complaint.imageUrl,
                            isString: typeof complaint.imageUrl === 'string',
                            trimmed: complaint.imageUrl?.trim(),
                            trimmedEmpty: complaint.imageUrl?.trim() === '',
                          });
                        }
                        
                        return hasImage ? (
                          <div className="flex items-center gap-1">
                            <img
                              src={complaint.imageUrl!}
                              alt="Complaint Evidence"
                              className="w-12 h-12 rounded object-cover border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                if (process.env.NODE_ENV === 'development') {
                                  console.log('[Admin UI] Opening image modal for:', complaint.imageUrl);
                                }
                                setSelectedImage(complaint.imageUrl!);
                              }}
                              onError={(e) => {
                                // Fallback if image fails to load
                                if (process.env.NODE_ENV === 'development') {
                                  console.error('[Admin UI] Image load error for complaint:', {
                                    id: complaint._id,
                                    imageUrl: complaint.imageUrl,
                                    error: e,
                                  });
                                }
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                // Show error indicator
                                const parent = target.parentElement;
                                if (parent) {
                                  const errorSpan = document.createElement('span');
                                  errorSpan.className = 'text-red-500 text-xs';
                                  errorSpan.textContent = '⚠️ Error';
                                  parent.appendChild(errorSpan);
                                }
                              }}
                              onLoad={() => {
                                if (process.env.NODE_ENV === 'development') {
                                  console.log('[Admin UI] ✅ Image loaded successfully for complaint:', complaint._id);
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (process.env.NODE_ENV === 'development') {
                                  console.log('[Admin UI] View button clicked for:', complaint.imageUrl);
                                }
                                setSelectedImage(complaint.imageUrl!);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              title={`Click to view full size - ${complaint.imageUrl?.substring(0, 50)}...`}
                            >
                              {t('admin.view')}
                            </button>
                            {/* Debug info tooltip */}
                            <span className="text-xs text-gray-400" title={complaint.imageUrl}>
                              🔍
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs font-semibold">
                              {t('admin.noImage')}
                            </span>
                            {/* Debug info */}
                            <span className="text-xs text-gray-400" title={`Debug: ${JSON.stringify({ imageUrl: complaint.imageUrl, type: typeof complaint.imageUrl })}`}>
                              {complaint.imageUrl ? '⚠️ Invalid' : '—'}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {complaint.isDuplicate ? (
                        <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">
                          {t('admin.table.duplicate')}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white truncate">
                      {getDepartmentTranslation(complaint.department)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                        disabled={updatingId === complaint._id}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                      >
                        <option value="Pending">{t('admin.status.pending')}</option>
                        <option value="In Progress">{t('admin.status.inProgress')}</option>
                        <option value="Resolved">{t('admin.status.resolved')}</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaints Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {complaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400 transition-colors">
            {t('track.notfound')}
          </div>
        ) : (
          complaints.map((complaint) => {
            const hasImage = complaint.imageUrl && 
                           typeof complaint.imageUrl === 'string' && 
                           complaint.imageUrl.trim() !== '' &&
                           complaint.imageUrl !== 'null' &&
                           complaint.imageUrl !== 'undefined';
            
            return (
              <div
                key={complaint._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('admin.table.id')}: {complaint._id.substring(0, 12)}...
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {complaint.complaintText}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge category={complaint.category} />
                    <PriorityBadge priority={complaint.priority} />
                    <StatusBadge status={complaint.status} />
                    {complaint.isDuplicate && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">
                        {t('admin.table.duplicate')}
                      </span>
                    )}
                  </div>

                  {hasImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={complaint.imageUrl!}
                        alt="Complaint Evidence"
                        className="w-20 h-20 rounded object-cover border border-gray-300 cursor-pointer"
                        onClick={() => setSelectedImage(complaint.imageUrl!)}
                      />
                      <button
                        onClick={() => setSelectedImage(complaint.imageUrl!)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium"
                      >
                        {t('admin.view')}
                      </button>
                    </div>
                  )}

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

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('admin.table.action')}:
                    </label>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      disabled={updatingId === complaint._id}
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Pending">{t('admin.status.pending')}</option>
                      <option value="In Progress">{t('admin.status.inProgress')}</option>
                      <option value="Resolved">{t('admin.status.resolved')}</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
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

