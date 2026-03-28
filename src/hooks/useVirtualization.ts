import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  getItemKey?: (index: number) => string | number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  key: string | number;
}

/**
 * Advanced virtualization hook for large lists with smooth scrolling
 */
export function useVirtualization<T>(
  items: T[],
  config: VirtualizationConfig
) {
  const { itemHeight, containerHeight, overscan = 5, getItemKey } = config;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const itemCount = items.length;
  const totalHeight = itemCount * itemHeight;

  const visibleRange = useMemo(() => {
    const containerItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + containerItemCount, itemCount - 1);

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(itemCount - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  const virtualItems = useMemo<VirtualItem[]>(() => {
    const items: VirtualItem[] = [];
    
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        key: getItemKey ? getItemKey(i) : i
      });
    }
    
    return items;
  }, [visibleRange, itemHeight, getItemKey]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!scrollElementRef.current) return;

    let scrollTop: number;
    
    switch (align) {
      case 'start':
        scrollTop = index * itemHeight;
        break;
      case 'center':
        scrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2;
        break;
      case 'end':
        scrollTop = index * itemHeight - containerHeight + itemHeight;
        break;
    }

    scrollElementRef.current.scrollTop = Math.max(0, Math.min(scrollTop, totalHeight - containerHeight));
  }, [itemHeight, containerHeight, totalHeight]);

  return {
    virtualItems,
    totalHeight,
    scrollElementRef,
    handleScroll,
    scrollToIndex,
    isScrolling: scrollTop > 0,
    visibleRange
  };
}