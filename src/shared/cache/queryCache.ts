/**
 * Query Result Caching Utility
 */
import redisClient from './redisClient';

export class QueryCache {
  private static readonly DEFAULT_TTL = 300; // 5 minutes
  private static readonly MEMORY_CACHE = new Map<string, { data: any; expiry: number }>();

  static async get<T>(key: string): Promise<T | null> {
    try {
      // Try memory cache first
      const memoryResult = this.MEMORY_CACHE.get(key);
      if (memoryResult && memoryResult.expiry > Date.now()) {
        return memoryResult.data;
      }

      // Try Redis cache
      const cached = await redisClient.get(key);
      if (cached) {
        const parsed = JSON.parse(cached.toString());
        // Store in memory for faster access
        this.MEMORY_CACHE.set(key, { data: parsed, expiry: Date.now() + 60000 }); // 1 min memory cache
        return parsed;
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      // Set in Redis
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      
      // Set in memory cache for faster access
      this.MEMORY_CACHE.set(key, { 
        data: value, 
        expiry: Date.now() + Math.min(ttl * 1000, 60000) // Max 1 min in memory
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        
        // Clear matching memory cache entries
        for (const [memKey] of this.MEMORY_CACHE) {
          if (memKey.match(pattern.replace('*', '.*'))) {
            this.MEMORY_CACHE.delete(memKey);
          }
        }
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  static generateKey(prefix: string, params: any[]): string {
    return `${prefix}:${params.join(':')}`;
  }

  static async warmUp(keys: Array<{ key: string; fetcher: () => Promise<any>; ttl?: number }>): Promise<void> {
    console.log(`Warming up ${keys.length} cache entries...`);
    
    for (const { key, fetcher, ttl } of keys) {
      try {
        const data = await fetcher();
        await this.set(key, data, ttl);
      } catch (error) {
        console.error(`Failed to warm up cache for key ${key}:`, error);
      }
    }
    
    console.log('Cache warm-up completed');
  }
}