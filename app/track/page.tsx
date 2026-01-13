'use client';

import { useState } from 'react';
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

export default function TrackComplaint() {
  const { t, language } = useLanguage();
  const [searchType, setSearchType] = useState<'id' | 'email'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

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

  const getLocationTranslation = (location: string) => {
    if (!location) return location;
    const locationLower = location.toLowerCase();
    const locationMap: Record<string, string> = {
      'madhubani': 'location.madhubani',
      'darbhanga': 'location.darbhanga',
      'patna': 'location.patna',
      'bhagalpur': 'location.bhagalpur',
      'muzaffarpur': 'location.muzaffarpur',
    };
    const key = Object.keys(locationMap).find(k => locationLower.includes(k));
    return key ? t(locationMap[key]) : location;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setComplaint(null);
    setComplaints([]);

    try {
      if (searchType === 'id') {
        // Search by ID - show single complaint
        const response = await fetch(`/api/complaints/get-by-id?id=${encodeURIComponent(searchValue)}`);
        const data = await response.json();

        if (response.ok && data.complaint) {
          setComplaint(data.complaint);
        } else {
          toast.error(data.error || t('track.error'));
        }
      } else {
        // Search by email - show all complaints
        const response = await fetch(`/api/complaints/get-by-email?email=${encodeURIComponent(searchValue)}`);
        const data = await response.json();

        if (response.ok) {
          if (data.complaints && data.complaints.length > 0) {
            setComplaints(data.complaints);
            toast.success(t('track.found.multiple').replace('{count}', data.complaints.length.toString()));
          } else {
            toast.error(t('track.notfound'));
          }
        } else {
          toast.error(data.error || t('track.error'));
        }
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error(t('track.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-6 md:mb-8 transition-colors">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('track.title')}
          </h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setSearchType('id')}
                className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${
                  searchType === 'id'
                    ? 'bg-gov-blue dark:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('track.search.id')}
              </button>
              <button
                type="button"
                onClick={() => setSearchType('email')}
                className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${
                  searchType === 'email'
                    ? 'bg-gov-blue dark:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('track.search.email')}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === 'id'
                    ? t('track.placeholder.id')
                    : t('track.placeholder.email')
                }
                required
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gov-blue dark:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gov-dark dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
              >
                {loading ? t('track.searching') : t('track.search')}
              </button>
            </div>
          </form>
        </div>

        {/* Single complaint view (by ID) */}
        {complaint && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('track.details')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('track.id')}: {complaint._id}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.name')}</label>
                <p className="text-gray-900 dark:text-white mt-1">{complaint.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.email')}</label>
                <p className="text-gray-900 dark:text-white mt-1">{complaint.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.complaint')}</label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-1 text-sm md:text-base">{complaint.complaintText}</p>
              </div>

              {complaint.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.location')}</label>
                  <p className="text-gray-900 dark:text-white mt-1">{getLocationTranslation(complaint.location)}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.category')}</label>
                  <div className="mt-1">
                    <CategoryBadge category={complaint.category} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.department')}</label>
                  <p className="text-gray-900 dark:text-white mt-1">{getDepartmentTranslation(complaint.department)}</p>
                </div>
              </div>

              {complaint.imageUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.image')}</label>
                  <div className="mt-2">
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint evidence"
                      className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImageUrl(complaint.imageUrl!)}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('track.image.click')}</p>
                  </div>
                </div>
              )}

              {complaint.isDuplicate && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm md:text-base">
                    {t('track.duplicate')}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('track.submitted')}</label>
                <p className="text-gray-900 dark:text-white mt-1">
                  {new Date(complaint.createdAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Multiple complaints view (by email) */}
        {complaints.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('track.complaints.title')} ({complaints.length})
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('track.complaints.desc')}
              </p>
            </div>

            <div className="grid gap-6">
              {complaints.map((comp) => (
                <div
                  key={comp._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Image Preview */}
                    {comp.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={comp.imageUrl}
                          alt="Complaint evidence"
                          className="w-full md:w-48 h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImageUrl(comp.imageUrl!)}
                        />
                      </div>
                    )}

                    {/* Complaint Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('track.complaint.id')}</p>
                          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{comp._id}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <StatusBadge status={comp.status} />
                          <PriorityBadge priority={comp.priority} />
                          <CategoryBadge category={comp.category} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('track.complaint.text')}</p>
                        <p className="text-gray-900 dark:text-white line-clamp-3">{comp.complaintText}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('track.complaint.department')}</p>
                          <p className="text-gray-900 dark:text-white font-medium">{getDepartmentTranslation(comp.department)}</p>
                        </div>
                        {comp.location && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('track.complaint.location')}</p>
                            <p className="text-gray-900 dark:text-white">{getLocationTranslation(comp.location)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('track.complaint.submitted')}</p>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(comp.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comp.createdAt).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US')}
                          </p>
                        </div>
                      </div>

                      {comp.isDuplicate && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            {t('track.complaint.duplicate')}
                          </p>
                        </div>
                      )}

                      {comp.imageUrl && (
                        <button
                          onClick={() => setSelectedImageUrl(comp.imageUrl!)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          {t('track.complaint.viewImage')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImageUrl && (
          <ImageModal
            imageUrl={selectedImageUrl}
            onClose={() => setSelectedImageUrl(null)}
            allowDownload={false}
          />
        )}
      </div>
    </div>
  );
}

