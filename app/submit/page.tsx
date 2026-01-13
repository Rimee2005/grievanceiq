'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyzeComplaint } from '@/lib/ai-processor';
import { normalizeToEnglish, translateText, containsHindi, isHinglish } from '@/lib/translator';

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SubmitComplaint() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaintText: '',
    location: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Voice-to-text state
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const accumulatedTextRef = useRef<string>('');
  const [suggestions, setSuggestions] = useState<{
    category?: string;
    priority?: string;
  } | null>(null);
  
  // Translation state
  const originalTextRef = useRef<string>(''); // Store original user input
  const englishTextRef = useRef<string>(''); // Store English version for backend
  const [isTranslating, setIsTranslating] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.error(t('submit.image.invalid'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('submit.image.size'));
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          // Get current text when starting
          setFormData((prev) => {
            accumulatedTextRef.current = prev.complaintText;
            return prev;
          });
          toast.success(t('submit.voice.listening'), { icon: '🎤' });
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Update accumulated text
          if (finalTranscript) {
            accumulatedTextRef.current += finalTranscript;
          }

          // Update complaint text: show accumulated + interim
          const newText = accumulatedTextRef.current + interimTranscript;
          originalTextRef.current = newText;
          setFormData((prev) => ({ ...prev, complaintText: newText }));

          // Convert to English for backend (async)
          if (finalTranscript.trim()) {
            normalizeToEnglish(newText).then((englishText) => {
              englishTextRef.current = englishText;
            }).catch((error) => {
              console.error('Error normalizing text:', error);
            });
          }

          // Analyze text for suggestions when we have final transcript
          if (finalTranscript.trim()) {
            // Use a timeout to debounce the analysis
            setTimeout(() => {
              const textToAnalyze = englishTextRef.current || accumulatedTextRef.current;
              analyzeTextForSuggestions(textToAnalyze);
            }, 500);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'no-speech') {
            toast.error(t('submit.voice.noSpeech'));
          } else if (event.error === 'not-allowed') {
            toast.error(t('submit.voice.permissionRequired'));
          } else {
            toast.error(t('submit.voice.error'));
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          // Sync accumulated text with form data when recording ends
          setFormData((prev) => {
            accumulatedTextRef.current = prev.complaintText;
            originalTextRef.current = prev.complaintText;
            // Convert to English
            normalizeToEnglish(prev.complaintText).then((englishText) => {
              englishTextRef.current = englishText;
            });
            return prev;
          });
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (normalizeTimerRef.current) {
        clearTimeout(normalizeTimerRef.current);
      }
    };
  }, [language]);

  // Helper function to get category translation key
  const getCategoryTranslationKey = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Infrastructure': 'category.infrastructure',
      'Sanitation': 'category.sanitation',
      'Healthcare': 'category.healthcare',
      'Education': 'category.education',
      'Public Safety': 'category.publicSafety',
      'Utilities': 'category.utilities',
      'Administrative Delay': 'category.administrativeDelay',
    };
    return categoryMap[category] || category;
  };

  // Analyze text to suggest category and priority
  const analyzeTextForSuggestions = (text: string) => {
    if (!text.trim()) {
      setSuggestions(null);
      return;
    }

    try {
      const analysis = analyzeComplaint(text, !!image);
      setSuggestions({
        category: analysis.category,
        priority: analysis.priority,
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  };

  // Start/Stop voice recording
  const toggleListening = () => {
    if (!isSupported) {
      toast.error(t('submit.voice.notSupported'));
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.success(t('submit.voice.stopped'), { icon: '⏹️' });
    } else {
      try {
        // Update language before starting
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        }
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error(t('submit.voice.startError'));
      }
    }
  };

  // Debounce timer for text normalization
  const normalizeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle text change and analyze for suggestions
  const handleComplaintTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    originalTextRef.current = newText;
    
    // Update form data
    setFormData({ ...formData, complaintText: newText });
    
    // Update accumulated text ref when user types manually
    if (!isListening) {
      accumulatedTextRef.current = newText;
    }
    
    // Clear previous timer
    if (normalizeTimerRef.current) {
      clearTimeout(normalizeTimerRef.current);
    }
    
    // Convert to English for backend (debounced, async, don't block UI)
    if (newText.trim()) {
      normalizeTimerRef.current = setTimeout(async () => {
        try {
          const englishText = await normalizeToEnglish(newText);
          englishTextRef.current = englishText;
        } catch (error) {
          console.error('Error normalizing text:', error);
          // If text is already in English, use it
          if (!containsHindi(newText) && !isHinglish(newText)) {
            englishTextRef.current = newText;
          } else {
            englishTextRef.current = newText; // Fallback to original
          }
        }
      }, 1000); // Debounce for 1 second
    } else {
      englishTextRef.current = '';
    }
    
    // Analyze text for suggestions when user types (immediate)
    if (newText.trim().length > 10) {
      // Use current text for immediate analysis, English version will update suggestions later
      analyzeTextForSuggestions(newText);
    } else {
      setSuggestions(null);
    }
  };

  // Store previous language to detect changes
  const prevLanguageRef = useRef<string>(language);
  
  // Translate complaint text when language changes (only)
  useEffect(() => {
    // Skip if language hasn't actually changed or no text
    if (prevLanguageRef.current === language || !formData.complaintText.trim()) {
      prevLanguageRef.current = language;
      return;
    }
    
    const translateComplaintText = async () => {
      const currentText = formData.complaintText;
      
      setIsTranslating(true);
      try {
        let translatedText = currentText;
        
        // Determine source language
        const hasHindi = containsHindi(currentText);
        const isHinglishText = isHinglish(currentText);
        
        if (language === 'en') {
          // Switching to English - convert to proper English
          if (hasHindi || isHinglishText) {
            // Use cached English version if available, otherwise translate
            if (englishTextRef.current && englishTextRef.current !== currentText) {
              translatedText = englishTextRef.current;
            } else {
              translatedText = await normalizeToEnglish(currentText);
              englishTextRef.current = translatedText;
            }
          } else {
            // Already in English, cache it
            englishTextRef.current = currentText;
          }
        } else {
          // Switching to Hindi - translate to Hindi
          if (!hasHindi) {
            // Text is in English, translate to Hindi
            const englishVersion = englishTextRef.current || currentText;
            translatedText = await translateText(englishVersion, 'hi', 'en');
            // Keep English version cached
            englishTextRef.current = englishVersion;
          } else {
            // Already in Hindi, ensure we have English version cached
            if (!englishTextRef.current) {
              englishTextRef.current = await normalizeToEnglish(currentText);
            }
          }
        }
        
        // Update form and refs only if translation changed
        if (translatedText !== currentText) {
          setFormData((prev) => ({ ...prev, complaintText: translatedText }));
          originalTextRef.current = translatedText;
        }
      } catch (error) {
        console.error('Error translating text:', error);
        // Keep current text on error
      } finally {
        setIsTranslating(false);
        prevLanguageRef.current = language;
      }
    };

    translateComplaintText();
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!formData.name || !formData.email || !formData.complaintText) {
      toast.error(t('submit.required'));
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('submit.email.invalid'));
      setLoading(false);
      return;
    }

    try {
      // Convert complaint text to proper English for backend
      let englishComplaintText = formData.complaintText;
      
      // If text is in Hindi/Hinglish, convert to English
      if (containsHindi(formData.complaintText) || isHinglish(formData.complaintText)) {
        if (englishTextRef.current) {
          englishComplaintText = englishTextRef.current;
        } else {
          englishComplaintText = await normalizeToEnglish(formData.complaintText);
        }
      } else if (language === 'hi') {
        // If currently showing Hindi, get English version
        if (englishTextRef.current) {
          englishComplaintText = englishTextRef.current;
        } else {
          // Translate back to English
          englishComplaintText = await translateText(formData.complaintText, 'en', 'hi');
        }
      }
      
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('complaintText', englishComplaintText);
      if (formData.location) {
        submitFormData.append('location', formData.location);
      }
      if (image) {
        console.log('[Frontend] Adding image to FormData:', {
          fileName: image.name,
          fileSize: image.size,
          fileType: image.type,
        });
        submitFormData.append('image', image);
      } else {
        console.log('[Frontend] ⚠️ No image to add to FormData');
      }

      // Debug: Log FormData contents
      console.log('[Frontend] FormData keys:', Array.from(submitFormData.keys()));
      for (const [key, value] of Array.from(submitFormData.entries())) {
        if (value instanceof File) {
          console.log(`[Frontend] FormData[${key}]:`, {
            type: 'File',
            name: value.name,
            size: value.size,
            typeMime: value.type,
          });
        } else {
          console.log(`[Frontend] FormData[${key}]:`, value);
        }
      }

      const response = await fetch('/api/complaints/create', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('submit.success'));
        if (data.complaint?.isDuplicate) {
          toast(t('submit.duplicate'), { icon: 'ℹ️' });
        }
        // Reset form
        setFormData({ name: '', email: '', complaintText: '', location: '' });
        setImage(null);
        setImagePreview(null);
        originalTextRef.current = '';
        englishTextRef.current = '';
        accumulatedTextRef.current = '';
        setSuggestions(null);
        // Redirect to track page
        setTimeout(() => {
          router.push('/track');
        }, 1500);
      } else {
        toast.error(data.error || t('submit.error'));
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error(t('submit.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 transition-colors">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('submit.title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('submit.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder={t('submit.placeholder.name')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('submit.email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder={t('submit.placeholder.email')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="complaintText"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('submit.complaint')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {isSupported ? (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isListening
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
                          : 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 shadow-md hover:shadow-lg'
                      }`}
                      title={isListening ? t('submit.voice.stop') : (language === 'hi' ? 'आवाज़ से टाइप करें' : 'Type with Voice')}
                    >
                      <svg
                        className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                        <path d="M12 18.5V22h3" />
                      </svg>
                      <span className="hidden sm:inline">
                        {isListening ? t('submit.voice.stop') : t('submit.voice.speak')}
                      </span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                      {language === 'hi' ? 'आवाज़ पहचान उपलब्ध नहीं' : 'Voice input not available'}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  id="complaintText"
                  name="complaintText"
                  value={formData.complaintText}
                  onChange={handleComplaintTextChange}
                  required
                  rows={6}
                  disabled={isTranslating}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                  placeholder={t('submit.placeholder.complaint')}
                />
                {isListening && (
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium hidden sm:inline">
                      {t('submit.voice.listening')}
                    </span>
                  </div>
                )}
                {isTranslating && (
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium hidden sm:inline">
                      {language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* AI Suggestions */}
              {suggestions && formData.complaintText.trim().length > 10 && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    {t('submit.suggestions.title')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.category && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {t('submit.suggestions.category')} {t(getCategoryTranslationKey(suggestions.category)) || suggestions.category}
                      </span>
                    )}
                    {suggestions.priority && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {t('submit.suggestions.priority')} {t(`admin.priority.${suggestions.priority.toLowerCase()}`) || suggestions.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {t('submit.suggestions.description')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('submit.location')}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder={t('submit.placeholder.location')}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('submit.image')}
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('submit.image.accepted')}</p>
              </div>

              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 md:h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    {t('submit.image.remove')}
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-blue dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-gov-dark dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? t('submit.submitting') : t('submit.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

