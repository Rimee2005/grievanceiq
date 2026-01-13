/**
 * Translation utility for converting between Hindi, English, and Hinglish
 * Uses Google Translate API or fallback translation
 */

// Common Hinglish to English mappings
const hinglishToEnglish: Record<string, string> = {
  'mera': 'my',
  'meri': 'my',
  'mere': 'my',
  'hai': 'is',
  'ho': 'be',
  'gaya': 'went',
  'gayi': 'went',
  'gaye': 'went',
  'hoga': 'will be',
  'hogi': 'will be',
  'honge': 'will be',
  'ki': 'that',
  'ke': 'of',
  'ka': 'of',
  'ko': 'to',
  'se': 'from',
  'mein': 'in',
  'par': 'on',
  'aur': 'and',
  'ya': 'or',
  'nahi': 'no',
  'nahin': 'no',
  'nahi hai': 'is not',
  'problem': 'problem',
  'issue': 'issue',
  'complaint': 'complaint',
  'broken': 'broken',
  'brook': 'broken',
  'pipeline': 'pipeline',
  'water': 'water',
  'paani': 'water',
  'electricity': 'electricity',
  'bijli': 'electricity',
  'road': 'road',
  'sadak': 'road',
  'garbage': 'garbage',
  'kachra': 'garbage',
};

/**
 * Detect if text contains Hindi/Hinglish characters
 */
export function containsHindi(text: string): boolean {
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(text);
}

/**
 * Detect if text is Hinglish (mix of English and Hindi words)
 */
export function isHinglish(text: string): boolean {
  const lowerText = text.toLowerCase();
  const hasHindi = containsHindi(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  const hasHinglishWords = Object.keys(hinglishToEnglish).some(word => 
    lowerText.includes(word)
  );
  
  return (hasHindi && hasEnglish) || hasHinglishWords;
}

/**
 * Convert Hinglish to proper English
 * This is a simplified version - in production, use a proper translation API
 */
export function convertHinglishToEnglish(text: string): string {
  let result = text;
  const lowerText = text.toLowerCase();
  
  // Replace common Hinglish patterns
  Object.entries(hinglishToEnglish).forEach(([hinglish, english]) => {
    const regex = new RegExp(`\\b${hinglish}\\b`, 'gi');
    result = result.replace(regex, english);
  });
  
  // Fix common patterns
  result = result.replace(/\bmera\s+(\w+)\s+hai\b/gi, 'my $1 is');
  result = result.replace(/\b(\w+)\s+ho\s+gaya\b/gi, '$1 is broken');
  result = result.replace(/\b(\w+)\s+ho\s+gayi\b/gi, '$1 is broken');
  result = result.replace(/\b(\w+)\s+ho\s+gaye\b/gi, '$1 is broken');
  result = result.replace(/\bcomplaint\s+hai\b/gi, 'complaint is');
  result = result.replace(/\bproblem\s+hai\b/gi, 'problem is');
  
  return result.trim();
}

/**
 * Translate text using Google Translate API or fallback
 */
export async function translateText(
  text: string,
  targetLang: 'en' | 'hi',
  sourceLang?: 'en' | 'hi'
): Promise<string> {
  if (!text.trim()) return text;
  
  // If already in target language, return as is
  if (targetLang === 'en' && !containsHindi(text) && !isHinglish(text)) {
    return text;
  }
  if (targetLang === 'hi' && containsHindi(text) && !/[a-zA-Z]/.test(text)) {
    return text;
  }
  
  try {
    // Use Google Translate API via proxy or direct call
    // Note: This uses the free Google Translate API which may have rate limits
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang || 'auto'}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data) && data[0] && Array.isArray(data[0])) {
        const translatedParts = data[0]
          .filter((item: any) => item && Array.isArray(item) && item[0])
          .map((item: any[]) => item[0]);
        
        if (translatedParts.length > 0) {
          return translatedParts.join('');
        }
      }
    }
  } catch (error) {
    console.error('Translation API error:', error);
    // If CORS error, try alternative approach
    try {
      // Alternative: Use a CORS proxy or backend API endpoint
      // For now, return original text with a note that translation failed
      console.warn('Translation failed, returning original text');
    } catch (fallbackError) {
      console.error('Fallback translation error:', fallbackError);
    }
  }
  
  // Fallback: Return original text if translation fails
  // In production, you might want to:
  // 1. Use a backend API endpoint for translation
  // 2. Use a paid translation service
  // 3. Use a CORS proxy
  return text;
}

/**
 * Convert any local language/Hinglish text to proper English
 */
export async function normalizeToEnglish(text: string): Promise<string> {
  if (!text.trim()) return text;
  
  // If already in English, return as is
  if (!containsHindi(text) && !isHinglish(text)) {
    return text;
  }
  
  // If Hinglish, convert to English
  if (isHinglish(text)) {
    const hinglishConverted = convertHinglishToEnglish(text);
    // Try to translate any remaining Hindi
    return await translateText(hinglishConverted, 'en', 'hi');
  }
  
  // If pure Hindi, translate to English
  if (containsHindi(text)) {
    return await translateText(text, 'en', 'hi');
  }
  
  return text;
}

