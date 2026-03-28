/**
 * Utility functions for page detection and routing
 */

/**
 * Determines if the current page should show the marquee
 * Excludes authentication and dashboard pages
 */
export const isPublicPage = (pathname: string): boolean => {
  const excludedPaths = [
    '/signup',
    '/login', 
    '/auth',
    '/register',
    '/signing',
    '/user-dashboard',
    '/hotel-dashboard', 
    '/panel-',
    '/promoter',
    '/admin'
  ];
  
  return !excludedPaths.some(path => pathname.startsWith(path));
};

/**
 * Gets the appropriate language code for marquee messages
 * Maps browser languages to available message files
 */
export const getMarqueeLanguage = (browserLang: string): string => {
  const supportedLanguages = ['en', 'es', 'pt', 'ro'];
  
  // Extract language code (e.g., 'en-US' -> 'en')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Return if supported, otherwise default to English
  return supportedLanguages.includes(langCode) ? langCode : 'en';
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Prevents immediate repetition of messages
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};