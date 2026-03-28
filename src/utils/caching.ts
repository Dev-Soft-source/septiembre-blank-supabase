/**
 * L2 Caching layer for Hotel Living platform
 * Implements memory-based caching with TTL and Redis-compatible interface
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0
  };
  private maxSize: number = 1000;
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    const expiresAt = Date.now() + ttlMs;
    
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
    
    this.stats.sets++;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      return null;
    }

    this.stats.hits++;
    return entry.value as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.evictions++;
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        this.stats.evictions++;
      }
    }
  }

  getStats(): CacheStats & { size: number; hitRate: number } {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Global cache instance
export const globalCache = new MemoryCache(2000);

// Cache key generators following the specified patterns
export const CacheKeys = {
  availability: (hotelId: string, yyyymm: string, duration: number) =>
    `avail:${hotelId}:${yyyymm}:${duration}`,
  
  hotel: (hotelId: string) =>
    `hotel:${hotelId}`,
  
  hotelList: (filters: string) =>
    `hotels:list:${filters}`,
  
  themes: () =>
    'themes:all',
  
  activities: () =>
    'activities:all',

  filters: (category: string) =>
    `filters:${category}`,

  userProfile: (userId: string) =>
    `profile:${userId}`
};

// TTL constants (in milliseconds)
export const CacheTTL = {
  AVAILABILITY_SHORT: 5 * 60 * 1000,    // 5 minutes
  AVAILABILITY_MEDIUM: 15 * 60 * 1000,   // 15 minutes  
  HOTEL_STATIC: 24 * 60 * 60 * 1000,    // 24 hours
  THEMES_ACTIVITIES: 48 * 60 * 60 * 1000, // 48 hours
  FILTERS: 60 * 60 * 1000,               // 1 hour
  USER_PROFILE: 30 * 60 * 1000           // 30 minutes
};

// Cache-aware data fetching utilities
export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CacheTTL.AVAILABILITY_SHORT
): Promise<T> => {
  // Check cache first
  const cached = globalCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch and cache
  const data = await fetcher();
  globalCache.set(key, data, ttl);
  return data;
};

// Cache invalidation helpers
export const invalidateCache = (pattern: string): void => {
  const stats = globalCache.getStats();
  console.log(`[Cache] Invalidating pattern: ${pattern} (current cache size: ${stats.size})`);
  
  // For memory cache, we need to iterate and match pattern
  // In a Redis implementation, we would use SCAN with pattern matching
  if (pattern.includes('*')) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    // This would require exposing cache keys - simplified for now
    console.log(`[Cache] Pattern invalidation would match: ${regex}`);
  }
};

export const invalidateHotelCache = (hotelId: string): void => {
  globalCache.delete(CacheKeys.hotel(hotelId));
  invalidateCache(`avail:${hotelId}:*`);
  invalidateCache('hotels:list:*');
};

export { MemoryCache };