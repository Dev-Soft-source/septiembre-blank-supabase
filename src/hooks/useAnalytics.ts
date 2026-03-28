import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  url: string;
  sessionId: string;
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'focus' | 'hover' | 'form_submit' | 'search';
  element: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  const sessionId = useCallback(() => {
    let id = sessionStorage.getItem('analytics-session-id');
    if (!id) {
      id = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics-session-id', id);
    }
    return id;
  }, []);

  const trackEvent = useCallback((event: Omit<AnalyticsEvent, 'timestamp' | 'url' | 'sessionId'>) => {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: sessionId()
    };

    // Store locally for analysis
    try {
      const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
      events.push(fullEvent);
      
      // Keep only last 100 events
      const recentEvents = events.slice(-100);
      localStorage.setItem('analytics-events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('[Analytics] Failed to store event:', error);
    }

    // Send to external analytics (if configured)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }, [sessionId]);

  const trackInteraction = useCallback((interaction: Omit<UserInteraction, 'timestamp'>) => {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now()
    };

    // Track as analytics event
    trackEvent({
      action: interaction.type,
      category: 'User Interaction',
      label: interaction.element,
      value: 1
    });

    // Store interaction data
    try {
      const interactions = JSON.parse(sessionStorage.getItem('user-interactions') || '[]');
      interactions.push(fullInteraction);
      
      // Keep only last 50 interactions per session
      const recentInteractions = interactions.slice(-50);
      sessionStorage.setItem('user-interactions', JSON.stringify(recentInteractions));
    } catch (error) {
      console.warn('[Analytics] Failed to store interaction:', error);
    }
  }, [trackEvent]);

  const trackPageView = useCallback((path?: string) => {
    trackEvent({
      action: 'page_view',
      category: 'Navigation',
      label: path || window.location.pathname
    });
  }, [trackEvent]);

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    trackEvent({
      action: 'search',
      category: 'Search',
      label: query,
      value: resultsCount
    });
  }, [trackEvent]);

  const trackFormSubmission = useCallback((formName: string, success: boolean) => {
    trackEvent({
      action: 'form_submit',
      category: 'Forms',
      label: formName,
      value: success ? 1 : 0
    });
  }, [trackEvent]);

  // Auto-track some basic interactions
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button') {
        trackInteraction({
          type: 'click',
          element: target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') + (target.className ? '.' + target.className.split(' ')[0] : ''),
          metadata: {
            text: target.textContent?.slice(0, 50),
            href: (target as HTMLAnchorElement).href
          }
        });
      }
    };

    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent % 25 === 0 && scrollPercent > 0) { // Track at 25%, 50%, 75%, 100%
        trackInteraction({
          type: 'scroll',
          element: 'page',
          metadata: { scrollPercent }
        });
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 250);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', throttledScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackInteraction]);

  return {
    trackEvent,
    trackInteraction,
    trackPageView,
    trackSearchQuery,
    trackFormSubmission,
    sessionId: sessionId()
  };
}
