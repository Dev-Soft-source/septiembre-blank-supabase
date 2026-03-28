/**
 * Advanced Health Checker with Detailed System Metrics
 * Monitors database, Redis, cache performance, and system health
 */
import { pool } from '../database/connection';
import readReplicaManager from '../database/readReplicaManager';
import redisClient from '../cache/redisClient';
import { AdvancedCache } from '../cache/advancedCache';
import { logger } from '../logging/logger';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  uptime: number;
  version: string;
  
  database: {
    primary: DatabaseHealth;
    replicas: DatabaseHealth[];
    replicationLag?: number;
  };
  
  redis: {
    status: 'healthy' | 'degraded' | 'critical';
    memory: RedisMemoryStats;
    performance: RedisPerformanceStats;
    fragmentation: number;
  };
  
  cache: {
    hitRate: number;
    compressionRatio: number;
    activeKeys: number;
    memoryUsage: number;
  };
  
  performance: {
    avgQueryTime: number;
    slowQueries: number;
    errorRate: number;
  };
  
  system: {
    memory: NodeJS.MemoryUsage;
    cpu: NodeJS.CpuUsage;
    eventLoop: number;
  };
}

interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'critical';
  responseTime: number;
  activeConnections: number;
  maxConnections: number;
  error?: string;
}

interface RedisMemoryStats {
  used: number;
  peak: number;
  fragmentation: number;
  evictions: number;
}

interface RedisPerformanceStats {
  commandsPerSecond: number;
  keyspaceHits: number;
  keyspaceMisses: number;
  hitRate: number;
}

export class AdvancedHealthChecker {
  private static queryPerformanceHistory: number[] = [];
  private static errorHistory: { timestamp: number; count: number }[] = [];
  
  /**
   * Perform comprehensive health check
   */
  static async performHealthCheck(): Promise<SystemHealth> {
    const startTime = Date.now();
    
    const health: SystemHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      
      database: {
        primary: await AdvancedHealthChecker.checkPrimaryDatabase(),
        replicas: await AdvancedHealthChecker.checkReadReplicas(),
        replicationLag: await AdvancedHealthChecker.checkReplicationLag()
      },
      
      redis: await AdvancedHealthChecker.checkRedisHealth(),
      cache: await AdvancedHealthChecker.checkCacheHealth(),
      performance: await AdvancedHealthChecker.checkPerformanceMetrics(),
      system: AdvancedHealthChecker.getSystemMetrics()
    };
    
    // Determine overall health status
    health.status = AdvancedHealthChecker.calculateOverallHealth(health);
    
    const checkDuration = Date.now() - startTime;
    logger.info('Health check completed', { 
      status: health.status, 
      duration: checkDuration,
      timestamp: health.timestamp
    });
    
    return health;
  }
  
  /**
   * Check primary database health
   */
  private static async checkPrimaryDatabase(): Promise<DatabaseHealth> {
    try {
      const start = Date.now();
      
      // Test connection with a simple query
      const result = await pool.query('SELECT 1 as health_check, now() as server_time');
      const responseTime = Date.now() - start;
      
      // Get connection pool stats
      const poolStats = await pool.query(`
        SELECT 
          count(*) as active_connections,
          current_setting('max_connections')::int as max_connections
        FROM pg_stat_activity 
        WHERE state = 'active'
      `);
      
      const stats = poolStats.rows[0];
      
      return {
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'degraded' : 'critical',
        responseTime,
        activeConnections: parseInt(stats.active_connections),
        maxConnections: parseInt(stats.max_connections)
      };
    } catch (error) {
      logger.error('Primary database health check failed', error instanceof Error ? error : new Error('Unknown database error'));
      return {
        status: 'critical',
        responseTime: -1,
        activeConnections: -1,
        maxConnections: -1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Check read replica health
   */
  private static async checkReadReplicas(): Promise<DatabaseHealth[]> {
    const replicas: DatabaseHealth[] = [];
    
    try {
      const replica = readReplicaManager.getReplica();
      const start = Date.now();
      
      await replica.query('SELECT 1 as replica_health');
      const responseTime = Date.now() - start;
      
      replicas.push({
        status: responseTime < 150 ? 'healthy' : responseTime < 600 ? 'degraded' : 'critical',
        responseTime,
        activeConnections: 0, // Would need to be implemented per replica
        maxConnections: 0
      });
    } catch (error) {
      replicas.push({
        status: 'critical',
        responseTime: -1,
        activeConnections: -1,
        maxConnections: -1,
        error: error instanceof Error ? error.message : 'Replica unavailable'
      });
    }
    
    return replicas;
  }
  
  /**
   * Check replication lag
   */
  private static async checkReplicationLag(): Promise<number | undefined> {
    try {
      // This would need to be implemented based on your specific replication setup
      // For now, return undefined as it's not implemented
      return undefined;
    } catch (error) {
      logger.warn('Could not check replication lag', { error });
      return undefined;
    }
  }
  
  /**
   * Check Redis health and performance
   */
  private static async checkRedisHealth(): Promise<SystemHealth['redis']> {
    try {
      const start = Date.now();
      
      // Test Redis connectivity
      const pong = await redisClient.ping();
      const responseTime = Date.now() - start;
      
      // Get Redis info
      const info = await redisClient.info();
      const infoString = typeof info === 'string' ? info : String(info || '');
      const memoryInfo = AdvancedHealthChecker.parseRedisMemoryInfo(infoString);
      const perfInfo = await AdvancedHealthChecker.getRedisPerformanceInfo();
      
      const status = responseTime < 50 ? 'healthy' : 
                    responseTime < 200 ? 'degraded' : 'critical';
      
      return {
        status,
        memory: memoryInfo,
        performance: perfInfo,
        fragmentation: memoryInfo.fragmentation
      };
    } catch (error) {
      logger.error('Redis health check failed', error instanceof Error ? error : new Error('Unknown Redis error'));
      return {
        status: 'critical',
        memory: { used: 0, peak: 0, fragmentation: 0, evictions: 0 },
        performance: { commandsPerSecond: 0, keyspaceHits: 0, keyspaceMisses: 0, hitRate: 0 },
        fragmentation: 0
      };
    }
  }
  
  /**
   * Parse Redis memory information
   */
  private static parseRedisMemoryInfo(info: string): RedisMemoryStats {
    const lines = info.split('\r\n');
    const stats: any = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        stats[key] = value;
      }
    });
    
    return {
      used: parseInt(stats.used_memory || '0'),
      peak: parseInt(stats.used_memory_peak || '0'),
      fragmentation: parseFloat(stats.mem_fragmentation_ratio || '0'),
      evictions: parseInt(stats.evicted_keys || '0')
    };
  }
  
  /**
   * Get Redis performance information
   */
  private static async getRedisPerformanceInfo(): Promise<RedisPerformanceStats> {
    try {
      const info = await redisClient.info('stats');
      const infoString = typeof info === 'string' ? info : String(info || '');
      const lines = infoString.split('\r\n');
      const stats: any = {};
      
      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          stats[key] = value;
        }
      });
      
      const hits = parseInt(stats.keyspace_hits || '0');
      const misses = parseInt(stats.keyspace_misses || '0');
      const hitRate = (hits + misses) > 0 ? hits / (hits + misses) : 0;
      
      return {
        commandsPerSecond: parseFloat(stats.instantaneous_ops_per_sec || '0'),
        keyspaceHits: hits,
        keyspaceMisses: misses,
        hitRate
      };
    } catch (error) {
      return {
        commandsPerSecond: 0,
        keyspaceHits: 0,
        keyspaceMisses: 0,
        hitRate: 0
      };
    }
  }
  
  /**
   * Check cache health
   */
  private static async checkCacheHealth(): Promise<SystemHealth['cache']> {
    const cacheHealth = AdvancedCache.getCacheHealth();
    
    return {
      hitRate: cacheHealth.hitRate,
      compressionRatio: cacheHealth.avgCompressionRatio,
      activeKeys: cacheHealth.activeKeys,
      memoryUsage: cacheHealth.memoryUsage.metadata + cacheHealth.memoryUsage.schedulers
    };
  }
  
  /**
   * Check performance metrics
   */
  private static async checkPerformanceMetrics(): Promise<SystemHealth['performance']> {
    const recentQueries = AdvancedHealthChecker.queryPerformanceHistory.slice(-100);
    const avgQueryTime = recentQueries.length > 0 
      ? recentQueries.reduce((a, b) => a + b, 0) / recentQueries.length 
      : 0;
    
    const slowQueries = recentQueries.filter(time => time > 1000).length;
    
    // Calculate error rate from recent history
    const recentErrors = AdvancedHealthChecker.errorHistory
      .filter(entry => entry.timestamp > Date.now() - 60000); // Last minute
    const totalErrors = recentErrors.reduce((sum, entry) => sum + entry.count, 0);
    const errorRate = totalErrors / 100; // Assuming 100 requests per minute baseline
    
    return {
      avgQueryTime,
      slowQueries,
      errorRate: Math.min(errorRate, 1) // Cap at 100%
    };
  }
  
  /**
   * Get system metrics
   */
  private static getSystemMetrics(): SystemHealth['system'] {
    const eventLoopUtilization = (process as any).eventLoopUtilization?.() || { utilization: 0 };
    
    return {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      eventLoop: eventLoopUtilization.utilization || 0
    };
  }
  
  /**
   * Calculate overall health status
   */
  private static calculateOverallHealth(health: SystemHealth): 'healthy' | 'degraded' | 'critical' {
    const criticalConditions = [
      health.database.primary.status === 'critical',
      health.redis.status === 'critical',
      health.system.memory.heapUsed / health.system.memory.heapTotal > 0.9,
      health.performance.errorRate > 0.1
    ];
    
    const degradedConditions = [
      health.database.primary.status === 'degraded',
      health.redis.status === 'degraded',
      health.cache.hitRate < 0.5,
      health.performance.avgQueryTime > 500,
      health.system.memory.heapUsed / health.system.memory.heapTotal > 0.8
    ];
    
    if (criticalConditions.some(condition => condition)) {
      return 'critical';
    }
    
    if (degradedConditions.some(condition => condition)) {
      return 'degraded';
    }
    
    return 'healthy';
  }
  
  /**
   * Record query performance for monitoring
   */
  static recordQueryTime(duration: number): void {
    AdvancedHealthChecker.queryPerformanceHistory.push(duration);
    
    // Keep only last 1000 entries
    if (AdvancedHealthChecker.queryPerformanceHistory.length > 1000) {
      AdvancedHealthChecker.queryPerformanceHistory = 
        AdvancedHealthChecker.queryPerformanceHistory.slice(-1000);
    }
  }
  
  /**
   * Record error for monitoring
   */
  static recordError(): void {
    const now = Date.now();
    const recent = AdvancedHealthChecker.errorHistory.find(
      entry => entry.timestamp > now - 60000 // Same minute
    );
    
    if (recent) {
      recent.count++;
    } else {
      AdvancedHealthChecker.errorHistory.push({ timestamp: now, count: 1 });
    }
    
    // Clean old entries
    AdvancedHealthChecker.errorHistory = AdvancedHealthChecker.errorHistory
      .filter(entry => entry.timestamp > now - 3600000); // Keep last hour
  }
}
