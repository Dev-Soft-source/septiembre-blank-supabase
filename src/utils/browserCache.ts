/**
 * Browser-specific cache clearing utilities
 * Helps resolve Edge caching issues and ensures proper logout functionality
 */

/**
 * Clears all browser storage and forces cache refresh
 * This is particularly important for Edge browser compatibility
 */
export const clearBrowserCache = (): void => {
  try {
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    // Clear sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    
    // Clear any service worker caches if available
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    console.log('Browser cache and storage cleared successfully');
  } catch (error) {
    console.error('Error clearing browser cache:', error);
  }
};

/**
 * Forces a hard refresh with cache bypass
 * Uses different methods for different browsers
 */
export const forcePageRefresh = (): void => {
  try {
    // For Edge and other browsers, force reload with cache bypass
    if (window.location && window.location.reload) {
      // Use timestamp to force cache bypass
      const url = new URL(window.location.href);
      url.searchParams.set('_t', Date.now().toString());
      window.location.href = url.toString();
    }
  } catch (error) {
    console.error('Error forcing page refresh:', error);
    // Fallback to simple reload
    window.location.reload();
  }
};

/**
 * Enhanced logout with cache clearing for Edge compatibility
 */
export const performEnhancedLogout = async (signOutFn: () => Promise<void>): Promise<void> => {
  try {
    console.log('🚀 Starting enhanced logout process');
    
    // First clear all browser storage
    console.log('🧹 Clearing browser cache...');
    clearBrowserCache();
    
    // Execute the actual sign out
    console.log('🔐 Executing sign out function...');
    await signOutFn();
    console.log('✅ Sign out function completed');
    
    // Small delay to ensure logout completes
    console.log('⏳ Waiting for logout to complete...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force page refresh to ensure clean state
    console.log('🔄 Force refreshing page...');
    forcePageRefresh();
    
  } catch (error) {
    console.error('❌ Error during enhanced logout:', error);
    console.log('🔄 Executing fallback: clear cache and force refresh');
    // Fallback: clear cache and force refresh anyway
    clearBrowserCache();
    setTimeout(() => forcePageRefresh(), 100);
  }
};

/**
 * Detects if running in Edge browser
 */
export const isEdgeBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Edge|Edg/.test(navigator.userAgent);
};

/**
 * Gets build information for debugging cache issues
 */
export const getBuildInfo = (): { buildTime?: string; cacheBuster?: string } => {
  try {
    const buildTimeEl = document.querySelector('meta[name="build-time"]');
    const cacheBusterEl = document.querySelector('meta[name="cache-buster"]');
    
    return {
      buildTime: buildTimeEl?.getAttribute('content') || undefined,
      cacheBuster: cacheBusterEl?.getAttribute('content') || undefined,
    };
  } catch (error) {
    console.error('Error getting build info:', error);
    return {};
  }
};