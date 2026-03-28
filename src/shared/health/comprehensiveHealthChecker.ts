/**
 * Comprehensive Health Checker for System Monitoring
 */
import redisClient from '../cache/redisClient';
import { pool } from '../database/connection';
import readReplicaManager from '../database/readReplicaManager';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  dependencies: Record<string, any>;
  metrics: Record<string, any>;
  instance?: string;
}

export class ComprehensiveHealthChecker {
  static async checkHealth(): Promise<HealthCheckResult> {
    const health: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      dependencies: {},
      metrics: {},
      instance: process.env.INSTANCE_ID || 'unknown'
    };

    // Check primary database connection
    await this.checkPrimaryDatabase(health);
    
    // Check read replicas
    await this.checkReadReplicas(health);
    
    // Check Redis connection
    await this.checkRedis(health);
    
    // Collect system metrics
    this.collectSystemMetrics(health);
    
    // Determine overall health status
    this.determineOverallStatus(health);

    return health;
  }

  private static async checkPrimaryDatabase(health: HealthCheckResult): Promise<void> {
    try {
      const start = Date.now();
      const result = await pool.query('SELECT 1 as health, NOW() as timestamp');
      const responseTime = Date.now() - start;
      
      // Check connection pool stats
      const poolStats = {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      };

      health.dependencies.database = {
        status: 'healthy',
        responseTime,
        poolStats,
        result: result.rows[0]
      };
    } catch (error) {
      health.status = 'degraded';
      health.dependencies.database = {
        status: 'unhealthy',
        error: error.message,
        code: error.code
      };
    }
  }

  private static async checkReadReplicas(health: HealthCheckResult): Promise<void> {
    try {
      const start = Date.now();
      const replica = readReplicaManager.getReplica();
      await replica.query('SELECT 1 as health');
      const responseTime = Date.now() - start;
      
      // Get replica health status
      const replicaHealth = await readReplicaManager.healthCheck();

      health.dependencies.readReplica = {
        status: replicaHealth.healthy ? 'healthy' : 'degraded',
        responseTime,
        replicaCount: replicaHealth.replicaCount,
        errors: replicaHealth.errors
      };

      if (!replicaHealth.healthy) {
        health.status = 'degraded';
      }
    } catch (error) {
      health.status = 'degraded';
      health.dependencies.readReplica = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private static async checkRedis(health: HealthCheckResult): Promise<void> {
    try {
      const start = Date.now();
      const pong = await redisClient.ping();
      const responseTime = Date.now() - start;
      
      // Get Redis info
      const info = await redisClient.info('memory');
      const infoString = typeof info === 'string' ? info : String(info);
      const memoryInfo = this.parseRedisInfo(infoString);

      health.dependencies.redis = {
        status: pong === 'PONG' ? 'healthy' : 'unhealthy',
        responseTime,
        memory: memoryInfo,
        ping: pong
      };

      if (pong !== 'PONG') {
        health.status = 'degraded';
      }
    } catch (error) {
      health.status = 'degraded';
      health.dependencies.redis = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private static collectSystemMetrics(health: HealthCheckResult): void {
    // Memory usage
    const memUsage = process.memoryUsage();
    
    // CPU usage
    const cpuUsage = process.cpuUsage();
    
    health.metrics = {
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };
  }

  private static determineOverallStatus(health: HealthCheckResult): void {
    const dependencies = Object.values(health.dependencies);
    const unhealthyCount = dependencies.filter(dep => dep.status === 'unhealthy').length;
    const degradedCount = dependencies.filter(dep => dep.status === 'degraded').length;

    if (unhealthyCount > 0) {
      health.status = 'unhealthy';
    } else if (degradedCount > 0) {
      health.status = 'degraded';
    } else {
      health.status = 'healthy';
    }
  }

  private static parseRedisInfo(info: string): Record<string, string> {
    const parsed: Record<string, string> = {};
    const lines = info.split('\r\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        parsed[key] = value;
      }
    }
    
    return parsed;
  }

  // Health check endpoint for load balancers
  static async getHealthStatus(): Promise<{ status: number; body: any }> {
    try {
      const health = await this.checkHealth();
      
      switch (health.status) {
        case 'healthy':
          return { status: 200, body: health };
        case 'degraded':
          return { status: 200, body: health }; // Still accepting traffic
        case 'unhealthy':
          return { status: 503, body: health }; // Remove from load balancer
        default:
          return { status: 500, body: health };
      }
    } catch (error) {
      return {
        status: 500,
        body: {
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}