/**
 * Multi-Layer Caching Strategy for High Performance
 */
import { QueryCache } from './queryCache';

// In-memory cache for ultra-fast access (Level 1)
const memoryCache = new Map<string, { data: any; expiry: number }>();

export class CachingStrategy {
  static async getWithFallback<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: {
      memoryTTL?: number;
      redisTTL?: number;
      forceRefresh?: boolean;
    } = {}
  ): Promise<T> {
    const { memoryTTL = 60, redisTTL = 300, forceRefresh = false } = options;

    // Level 1: Try memory cache first (fastest)
    if (!forceRefresh && memoryCache.has(key)) {
      const cached = memoryCache.get(key)!;
      if (cached.expiry > Date.now()) {
        return cached.data;
      } else {
        memoryCache.delete(key);
      }
    }

    // Level 2: Try Redis cache
    if (!forceRefresh) {
      const redisResult = await QueryCache.get<T>(key);
      if (redisResult) {
        // Cache in memory for next access
        memoryCache.set(key, { 
          data: redisResult, 
          expiry: Date.now() + (memoryTTL * 1000) 
        });
        return redisResult;
      }
    }

    // Level 3: Fetch from database
    const result = await fetchFunction();
    
    // Cache in both layers
    await QueryCache.set(key, result, redisTTL);
    memoryCache.set(key, { 
      data: result, 
      expiry: Date.now() + (memoryTTL * 1000) 
    });
    
    return result;
  }

  static async invalidateAll(pattern: string): Promise<void> {
    // Clear Redis cache
    await QueryCache.invalidate(pattern);
    
    // Clear memory cache
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const [key] of memoryCache) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  }

  static getMemoryCacheStats(): { size: number; keys: string[] } {
    return {
      size: memoryCache.size,
      keys: Array.from(memoryCache.keys())
    };
  }

  static clearMemoryCache(): void {
    memoryCache.clear();
  }
}

// Cleanup expired memory cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryCache) {
    if (value.expiry <= now) {
      memoryCache.delete(key);
    }
  }
}, 60000); // Every minute