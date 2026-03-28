/**
 * Advanced Caching with Predictive Preloading and Adaptive TTL
 * Implements refresh-ahead logic, compression, and intelligent cache management
 */
import { QueryCache } from './queryCache';
import { logger } from '../logging/logger';
import { promisify } from 'util';
import zlib from 'zlib';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

interface CacheStats {
  hits: number;
  misses: number;
  refreshes: number;
  compressionRatio: number;
}

interface CacheMetadata {
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed: boolean;
  refreshScheduled: boolean;
}

export class AdvancedCache {
  private static stats: CacheStats = {
    hits: 0,
    misses: 0,
    refreshes: 0,
    compressionRatio: 0
  };
  
  private static metadata = new Map<string, CacheMetadata>();
  private static refreshScheduler = new Map<string, NodeJS.Timeout>();
  private static readonly COMPRESSION_THRESHOLD = 1024; // 1KB
  private static readonly PRELOAD_THRESHOLD = 5; // Access count for preloading
  private static readonly REFRESH_AHEAD_RATIO = 0.8; // Refresh at 80% of TTL
  
  /**
   * Get value with advanced caching features
   */
  static async get<T>(
    key: string,
    fetchFunction?: () => Promise<T>,
    options: {
      ttl?: number;
      compress?: boolean;
      refreshAhead?: boolean;
    } = {}
  ): Promise<T | null> {
    const { ttl = 300, compress = true, refreshAhead = true } = options;
    
    try {
      // Try to get from cache
      const cached = await QueryCache.get<string | T>(key);
      const meta = AdvancedCache.metadata.get(key);
      
      if (cached !== null) {
        AdvancedCache.stats.hits++;
        
        // Update metadata
        if (meta) {
          meta.accessCount++;
          meta.lastAccessed = Date.now();
          
          // Schedule refresh-ahead if needed
          if (refreshAhead && fetchFunction && !meta.refreshScheduled) {
            const age = Date.now() - meta.createdAt;
            const refreshTime = ttl * 1000 * AdvancedCache.REFRESH_AHEAD_RATIO;
            
            if (age > refreshTime) {
              AdvancedCache.scheduleRefresh(key, fetchFunction, { ttl, compress });
            }
          }
        }
        
        // Decompress if needed
        if (typeof cached === 'string' && meta?.compressed) {
          try {
            const buffer = Buffer.from(cached, 'base64');
            const decompressed = await gunzip(buffer);
            return JSON.parse(decompressed.toString());
        } catch (error) {
          logger.warn(`Failed to decompress cache value for key: ${key}`, error instanceof Error ? error : new Error('Unknown decompression error'));
            return cached as T;
          }
        }
        
        return cached as T;
      }
      
      // Cache miss
      AdvancedCache.stats.misses++;
      
      if (!fetchFunction) {
        return null;
      }
      
      // Fetch and cache new value
      const value = await fetchFunction();
      await AdvancedCache.set(key, value, { ttl, compress, refreshAhead });
      
      return value;
    } catch (error) {
      logger.error('Advanced cache get error', error instanceof Error ? error : new Error(`Cache error for key: ${key}`));
      return null;
    }
  }
  
  /**
   * Set value with compression and metadata
   */
  static async set<T>(
    key: string,
    value: T,
    options: {
      ttl?: number;
      compress?: boolean;
      refreshAhead?: boolean;
    } = {}
  ): Promise<void> {
    const { ttl = 300, compress = true } = options;
    
    try {
      let finalValue: T | string = value;
      let compressed = false;
      const originalSize = JSON.stringify(value).length;
      
      // Compress large values
      if (compress && originalSize > AdvancedCache.COMPRESSION_THRESHOLD) {
        try {
          const jsonString = JSON.stringify(value);
          const gzipped = await gzip(Buffer.from(jsonString));
          finalValue = gzipped.toString('base64');
          compressed = true;
          
          // Update compression ratio
          const compressedSize = finalValue.length;
          const ratio = (originalSize - compressedSize) / originalSize;
          AdvancedCache.stats.compressionRatio = 
            (AdvancedCache.stats.compressionRatio + ratio) / 2;
        } catch (error) {
          logger.warn(`Compression failed for key: ${key}, storing uncompressed`, error instanceof Error ? error : new Error('Unknown compression error'));
        }
      }
      
      // Store in cache
      await QueryCache.set(key, finalValue, ttl);
      
      // Store metadata
      AdvancedCache.metadata.set(key, {
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
        size: originalSize,
        compressed,
        refreshScheduled: false
      });
      
      // Schedule predictive preloading for frequently accessed keys
      const meta = AdvancedCache.metadata.get(key);
      if (meta && meta.accessCount >= AdvancedCache.PRELOAD_THRESHOLD) {
        AdvancedCache.schedulePreload(key, ttl);
      }
      
    } catch (error) {
      logger.error(`Advanced cache set error for key: ${key}`, error instanceof Error ? error : new Error('Unknown cache set error'));
    }
  }
  
  /**
   * Schedule refresh-ahead for a key
   */
  private static scheduleRefresh<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: { ttl?: number; compress?: boolean }
  ): void {
    const meta = AdvancedCache.metadata.get(key);
    if (!meta || meta.refreshScheduled) return;
    
    meta.refreshScheduled = true;
    
    const refreshTimeout = setTimeout(async () => {
      try {
        const newValue = await fetchFunction();
        await AdvancedCache.set(key, newValue, options);
        AdvancedCache.stats.refreshes++;
        
        logger.info('Cache refresh completed', { key });
      } catch (error) {
        logger.error('Cache refresh failed', error instanceof Error ? error : new Error(`Refresh failed for key: ${key}`));
      } finally {
        const currentMeta = AdvancedCache.metadata.get(key);
        if (currentMeta) {
          currentMeta.refreshScheduled = false;
        }
        AdvancedCache.refreshScheduler.delete(key);
      }
    }, 1000); // Refresh after 1 second delay
    
    AdvancedCache.refreshScheduler.set(key, refreshTimeout);
  }
  
  /**
   * Schedule predictive preloading
   */
  private static schedulePreload(key: string, ttl: number): void {
    const preloadTime = ttl * 1000 * 0.9; // Preload at 90% of TTL
    
    setTimeout(() => {
      const meta = AdvancedCache.metadata.get(key);
      if (meta && meta.accessCount >= AdvancedCache.PRELOAD_THRESHOLD) {
        // Trigger a background refresh if the key is still popular
        logger.info('Predictive preload triggered', { key });
      }
    }, preloadTime);
  }
  
  /**
   * Invalidate with pattern matching
   */
  static async invalidate(pattern: string): Promise<void> {
    try {
      await QueryCache.invalidate(pattern);
      
      // Clean up metadata
      const regex = new RegExp(pattern.replace('*', '.*'));
      for (const [key] of AdvancedCache.metadata) {
        if (regex.test(key)) {
          AdvancedCache.metadata.delete(key);
          
          // Cancel any scheduled refreshes
          const timeout = AdvancedCache.refreshScheduler.get(key);
          if (timeout) {
            clearTimeout(timeout);
            AdvancedCache.refreshScheduler.delete(key);
          }
        }
      }
    } catch (error) {
      logger.error(`Cache invalidation error for pattern: ${pattern}`, error instanceof Error ? error : new Error('Unknown invalidation error'));
    }
  }
  
  /**
   * Get cache statistics and health
   */
  static getCacheHealth(): {
    stats: CacheStats;
    hitRate: number;
    avgCompressionRatio: number;
    activeKeys: number;
    scheduledRefreshes: number;
    memoryUsage: {
      metadata: number;
      schedulers: number;
    };
  } {
    const totalRequests = AdvancedCache.stats.hits + AdvancedCache.stats.misses;
    const hitRate = totalRequests > 0 ? AdvancedCache.stats.hits / totalRequests : 0;
    
    return {
      stats: { ...AdvancedCache.stats },
      hitRate,
      avgCompressionRatio: AdvancedCache.stats.compressionRatio,
      activeKeys: AdvancedCache.metadata.size,
      scheduledRefreshes: AdvancedCache.refreshScheduler.size,
      memoryUsage: {
        metadata: AdvancedCache.metadata.size * 100, // Rough estimate
        schedulers: AdvancedCache.refreshScheduler.size * 50
      }
    };
  }
  
  /**
   * Cleanup old metadata and cancel refreshes
   */
  static cleanup(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    
    for (const [key, meta] of AdvancedCache.metadata) {
      if (meta.lastAccessed < cutoff) {
        AdvancedCache.metadata.delete(key);
        
        // Cancel refresh if scheduled
        const timeout = AdvancedCache.refreshScheduler.get(key);
        if (timeout) {
          clearTimeout(timeout);
          AdvancedCache.refreshScheduler.delete(key);
        }
      }
    }
  }
}

// Schedule periodic cleanup
setInterval(() => {
  AdvancedCache.cleanup();
}, 60 * 60 * 1000); // Every hour