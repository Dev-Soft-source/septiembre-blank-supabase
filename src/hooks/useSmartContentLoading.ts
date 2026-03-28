import React from 'react';
import { useEffect, useState } from 'react';

interface PrefetchOptions {
  priority?: 'low' | 'high';
  delay?: number;
}

export function useSmartContentLoading() {
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<Set<string>>(new Set());

  // Prefetch a route's code
  const prefetchRoute = async (route: string, options: PrefetchOptions = {}) => {
    if (prefetchedRoutes.has(route)) return;

    const { priority = 'low', delay = 0 } = options;

    try {
      // Add delay if specified
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Prefetch based on route
      let modulePromise: Promise<any> | null = null;

      switch (route) {
        case '/hotels':
          modulePromise = import('@/pages/Hotels');
          break;
        case '/search':
          modulePromise = import('@/pages/Search');
          break;
        case '/affinity-stays':
          modulePromise = import('@/pages/AffinityStays');
          break;
        case '/user-dashboard':
          modulePromise = import('@/pages/UserDashboard');
          break;
        case '/hotel-dashboard':
          modulePromise = import('@/pages/HotelDashboard');
          break;
        case '/admin':
          modulePromise = import('@/pages/PanelFernando');
          break;
        default:
          console.warn(`[Prefetch] Unknown route: ${route}`);
          return;
      }

      if (modulePromise) {
        // Use requestIdleCallback for low priority prefetching
        if (priority === 'low' && 'requestIdleCallback' in window) {
          requestIdleCallback(async () => {
            try {
              await modulePromise;
              setPrefetchedRoutes(prev => new Set([...prev, route]));
            } catch (error) {
              console.warn(`[Prefetch] Failed to prefetch ${route}:`, error);
            }
          });
        } else {
          await modulePromise;
          setPrefetchedRoutes(prev => new Set([...prev, route]));
        }
      }
    } catch (error) {
      console.warn(`[Prefetch] Failed to prefetch ${route}:`, error);
    }
  };

  // Prefetch likely next routes based on current route
  const prefetchLikelyRoutes = (currentRoute: string) => {
    const routeMap: Record<string, string[]> = {
      '/': ['/hotels', '/search', '/affinity-stays'],
      '/hotels': ['/search', '/hotel-dashboard'],
      '/search': ['/hotels', '/affinity-stays'],
      '/affinity-stays': ['/search', '/hotels'],
      '/login/user': ['/user-dashboard'],
      '/login/hotel': ['/hotel-dashboard'],
      '/registerUser': ['/user-dashboard'],
      '/registerHotel': ['/hotel-dashboard']
    };

    const nextRoutes = routeMap[currentRoute] || [];
    
    nextRoutes.forEach((route, index) => {
      // Stagger prefetching to avoid overwhelming the browser
      prefetchRoute(route, { 
        priority: 'low', 
        delay: index * 1000 
      });
    });
  };

  // Auto-prefetch based on user interactions
  const handleLinkHover = (href: string) => {
    if (href.startsWith('/')) {
      prefetchRoute(href, { priority: 'high' });
    }
  };

  // Smart component lazy loading utilities
  const createLazyComponent = (importFn: () => Promise<any>, fallback?: React.ComponentType) => {
    return React.lazy(() => {
      return importFn().catch(error => {
        console.warn('[Lazy Loading] Component import failed:', error);
        // Return a fallback component or retry
        if (fallback) {
          return { default: fallback };
        }
        throw error;
      });
    });
  };

  // Intersection observer for lazy loading
  const observeForLazyLoad = (element: HTMLElement, callback: () => void) => {
    if (!element || !('IntersectionObserver' in window)) {
      callback(); // Fallback for browsers without IntersectionObserver
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: '100px' // Start loading 100px before element comes into view
      }
    );

    observer.observe(element);
    
    return () => observer.unobserve(element);
  };

  return {
    prefetchRoute,
    prefetchLikelyRoutes,
    handleLinkHover,
    createLazyComponent,
    observeForLazyLoad,
    prefetchedRoutes: Array.from(prefetchedRoutes)
  };
}