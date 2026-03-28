import { useEffect, useMemo, useRef, useState } from 'react';

export type UseCarouselOptions = {
  items: string[];
  intervalMs?: number;          // default 2000
  initialDelayMs?: number;      // default 0 (applied only on first start)
  startOnView?: boolean;        // default false
  inViewThreshold?: number;     // default 0.4
};

export function useCarousel({ items, intervalMs = 2000, initialDelayMs = 0, startOnView = false, inViewThreshold = 0.4 }: UseCarouselOptions) {
  const memoItems = useMemo(() => items, [items]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visible, setVisible] = useState(!startOnView);
  const [running, setRunning] = useState(!startOnView);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sectionRef = useRef<HTMLElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  // Measure tallest item to prevent jump
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [minHeight, setMinHeight] = useState<number>(0);
  useEffect(() => {
    if (!measureRef.current) return;
    const el = measureRef.current;
    const heights = Array.from(el.querySelectorAll('[data-measure]')).map((n) => (n as HTMLElement).offsetHeight);
    setMinHeight(Math.max(0, ...heights));
  }, [memoItems]);

  // Intersection Observer
  useEffect(() => {
    if (!startOnView || prefersReduced) return; // if reduced motion, do nothing special
    const node = sectionRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setRunning(true);
        } else {
          setRunning(false);
          // pause + clear timers
          if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
          if (startTimeoutRef.current) { window.clearTimeout(startTimeoutRef.current); startTimeoutRef.current = null; }
          if (fadeTimeoutRef.current) { window.clearTimeout(fadeTimeoutRef.current); fadeTimeoutRef.current = null; }
        }
      },
      { threshold: inViewThreshold }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [startOnView, inViewThreshold, prefersReduced]);

  // Core rotation logic
  useEffect(() => {
    // Cleanup any existing timers on change
    if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
    if (startTimeoutRef.current) { window.clearTimeout(startTimeoutRef.current); startTimeoutRef.current = null; }

    if (prefersReduced) {
      // Do not auto-rotate
      setRunning(false);
      return;
    }

    if (startOnView && !running) return; // wait for view

    const delay = hasStartedRef.current ? 0 : initialDelayMs;

    // Initial hold before starting (only once)
    startTimeoutRef.current = window.setTimeout(() => {
      hasStartedRef.current = true;
      intervalRef.current = window.setInterval(() => {
        // Start cross-fade transition
        setIsTransitioning(true);
        
        fadeTimeoutRef.current = window.setTimeout(() => {
          // Complete the transition
          setCurrentIndex(nextIndex);
          setNextIndex((nextIndex + 1) % memoItems.length);
          setIsTransitioning(false);
        }, 2000); // 2 second cross-fade
      }, intervalMs);
    }, delay);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (startTimeoutRef.current) window.clearTimeout(startTimeoutRef.current);
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    };
  }, [memoItems.length, intervalMs, initialDelayMs, startOnView, running, prefersReduced]);

  return {
    sectionRef,
    measureRef,
    currentIndex,
    nextIndex,
    isTransitioning,
    minHeight,
    prefersReduced,
    setIndex: (indexOrUpdater: number | ((prev: number) => number)) => {
      const newIndex = typeof indexOrUpdater === 'function' ? indexOrUpdater(currentIndex) : indexOrUpdater;
      setCurrentIndex(newIndex);
      setNextIndex((newIndex + 1) % memoItems.length);
    },
  } as const;
}
