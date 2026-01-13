/**
 * AI/NLP Processor for Grievance Analysis
 * Rule-based classification, prioritization, and duplicate detection
 */

// Category keywords mapping
const categoryKeywords: Record<string, string[]> = {
  Infrastructure: [
    'road', 'bridge', 'street', 'pothole', 'construction', 'building', 'structure',
    'सड़क', 'पुल', 'निर्माण', 'इमारत', 'गड्ढा', 'सड़क की मरम्मत',
  ],
  Sanitation: [
    'garbage', 'waste', 'trash', 'drain', 'sewage', 'dirty', 'clean', 'hygiene',
    'कचरा', 'गंदगी', 'नाली', 'सफाई', 'मलजल',
  ],
  Healthcare: [
    'hospital', 'doctor', 'medicine', 'health', 'medical', 'clinic', 'treatment',
    'अस्पताल', 'डॉक्टर', 'दवा', 'स्वास्थ्य', 'चिकित्सा',
  ],
  Education: [
    'school', 'teacher', 'student', 'education', 'exam', 'book', 'classroom',
    'स्कूल', 'शिक्षक', 'छात्र', 'शिक्षा', 'परीक्षा',
  ],
  'Public Safety': [
    'police', 'crime', 'safety', 'security', 'theft', 'accident', 'emergency',
    'पुलिस', 'अपराध', 'सुरक्षा', 'चोरी', 'दुर्घटना', 'आपातकाल',
  ],
  Utilities: [
    'water', 'electricity', 'power', 'supply', 'connection', 'bill', 'meter',
    'पानी', 'बिजली', 'आपूर्ति', 'कनेक्शन', 'बिल',
  ],
  'Administrative Delay': [
    'delay', 'pending', 'application', 'document', 'permit', 'license', 'approval',
    'विलंब', 'लंबित', 'आवेदन', 'दस्तावेज', 'अनुमति',
  ],
};

// Department mapping based on category
const departmentMapping: Record<string, string> = {
  Infrastructure: 'Municipal Department',
  Sanitation: 'Municipal Department',
  Healthcare: 'Health Department',
  Education: 'Education Department',
  'Public Safety': 'Police Department',
  Utilities: 'Utilities Department',
  'Administrative Delay': 'Administrative Department',
};

/**
 * Analyze complaint text and classify into category
 */
export function classifyCategory(text: string): string {
  const lowerText = text.toLowerCase();
  let maxMatches = 0;
  let bestCategory = 'Administrative Delay'; // Default category

  // Count keyword matches for each category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter((keyword) => lowerText.includes(keyword.toLowerCase())).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
}

/**
 * Calculate sentiment score (simple rule-based)
 * Returns a score between -1 (very negative) and 1 (very positive)
 */
export function calculateSentiment(text: string): number {
  const lowerText = text.toLowerCase();

  // Negative sentiment keywords
  const negativeKeywords = [
    'urgent', 'emergency', 'critical', 'danger', 'dangerous', 'accident', 'broken',
    'damaged', 'failed', 'not working', 'problem', 'issue', 'complaint', 'angry',
    'frustrated', 'disappointed', 'worried', 'concerned',
    'जरूरी', 'आपातकाल', 'खतरनाक', 'दुर्घटना', 'टूटा', 'खराब', 'समस्या', 'चिंतित',
  ];

  // Positive sentiment keywords (less common in complaints)
  const positiveKeywords = [
    'thank', 'appreciate', 'good', 'excellent', 'satisfied',
    'धन्यवाद', 'अच्छा', 'संतुष्ट',
  ];

  let negativeCount = 0;
  let positiveCount = 0;

  negativeKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) negativeCount++;
  });

  positiveKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) positiveCount++;
  });

  // Calculate sentiment score
  const totalKeywords = negativeCount + positiveCount;
  if (totalKeywords === 0) return 0;

  return (positiveCount - negativeCount * 2) / (totalKeywords + 1);
}

/**
 * Determine priority level based on text and image presence
 */
export function assignPriority(text: string, hasImage: boolean): 'High' | 'Medium' | 'Low' {
  const lowerText = text.toLowerCase();
  let priority: 'High' | 'Medium' | 'Low' = 'Medium';

  // High priority indicators
  const highPriorityKeywords = [
    'accident', 'danger', 'emergency', 'urgent', 'critical', 'immediate', 'life',
    'death', 'injury', 'hurt', 'blood', 'fire', 'explosion',
    'दुर्घटना', 'खतरा', 'आपातकाल', 'जरूरी', 'जीवन', 'मृत्यु', 'चोट', 'आग',
  ];

  // Low priority indicators
  const lowPriorityKeywords = [
    'suggestion', 'feedback', 'inquiry', 'question', 'information',
    'सुझाव', 'प्रतिक्रिया', 'पूछताछ', 'सवाल',
  ];

  // Check for high priority keywords
  const hasHighPriorityKeyword = highPriorityKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  // Check for low priority keywords
  const hasLowPriorityKeyword = lowPriorityKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  // Calculate sentiment
  const sentiment = calculateSentiment(text);
  const isVeryNegative = sentiment < -0.5;

  // Priority assignment logic
  if (hasHighPriorityKeyword || isVeryNegative) {
    priority = 'High';
  } else if (hasLowPriorityKeyword && sentiment > -0.2) {
    priority = 'Low';
  } else {
    priority = 'Medium';
  }

  // If image is attached, increase priority by one level
  if (hasImage) {
    if (priority === 'Low') {
      priority = 'Medium';
    } else if (priority === 'Medium') {
      priority = 'High';
    }
    // High remains High
  }

  return priority;
}

/**
 * Extract keywords from text for duplicate detection
 */
export function extractKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  const allKeywords: string[] = [];

  // Extract category keywords
  Object.values(categoryKeywords).forEach((keywords) => {
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        allKeywords.push(keyword.toLowerCase());
      }
    });
  });

  // Extract common complaint words
  const commonWords = [
    'broken', 'damaged', 'not working', 'problem', 'issue', 'complaint',
    'खराब', 'टूटा', 'समस्या', 'शिकायत',
  ];

  commonWords.forEach((word) => {
    if (lowerText.includes(word)) {
      allKeywords.push(word);
    }
  });

  return Array.from(new Set(allKeywords)); // Remove duplicates
}

/**
 * Calculate similarity between two complaint texts
 * Returns a score between 0 and 1
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);

  if (keywords1.length === 0 && keywords2.length === 0) return 0;

  // Calculate Jaccard similarity
  const intersection = keywords1.filter((k) => keywords2.includes(k)).length;
  const union = new Set([...keywords1, ...keywords2]).size;

  return intersection / union;
}

/**
 * Get department for a category
 */
export function getDepartment(category: string): string {
  return departmentMapping[category] || 'Administrative Department';
}

/**
 * Main analysis function that processes a complaint
 */
export interface ComplaintAnalysis {
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  department: string;
  sentiment: number;
  keywords: string[];
}

export function analyzeComplaint(
  text: string,
  hasImage: boolean = false
): ComplaintAnalysis {
  const category = classifyCategory(text);
  const priority = assignPriority(text, hasImage);
  const department = getDepartment(category);
  const sentiment = calculateSentiment(text);
  const keywords = extractKeywords(text);

  return {
    category,
    priority,
    department,
    sentiment,
    keywords,
  };
}

