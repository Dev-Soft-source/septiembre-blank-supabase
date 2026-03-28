import React from 'react';
import { useVirtualization } from '@/hooks/useVirtualization';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (index: number) => string | number;
  className?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  getItemKey,
  className = '',
  emptyMessage = 'No items to display',
  loadingMessage = 'Loading...',
  isLoading = false
}: VirtualizedListProps<T>) {
  const {
    virtualItems,
    totalHeight,
    scrollElementRef,
    handleScroll
  } = useVirtualization(items, {
    itemHeight,
    containerHeight: height,
    getItemKey
  });

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-muted-foreground">{loadingMessage}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary componentName="VirtualizedList">
      <div
        ref={scrollElementRef}
        className={`overflow-auto ${className}`}
        style={{ height }}
        onScroll={handleScroll}
        role="list"
        aria-label="Virtualized list"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.key}
              role="listitem"
              style={{
                position: 'absolute',
                top: virtualItem.start,
                left: 0,
                right: 0,
                height: itemHeight
              }}
            >
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </div>
          ))}
        </div>
      </div>
    </ComponentErrorBoundary>
  );
}