/**
 * Health Check Endpoints with Dependency Validation
 */

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  dependencies: {
    database: DependencyStatus;
    cache?: DependencyStatus;
    external?: DependencyStatus[];
  };
  metrics?: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu?: number;
  };
}

interface DependencyStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

class HealthChecker {
  private version: string;
  private startTime: number;

  constructor() {
    this.version = process.env.npm_package_version || '1.0.0';
    this.startTime = Date.now();
  }

  private async checkDatabase(): Promise<DependencyStatus> {
    const startTime = Date.now();
    
    try {
      // Simulate database check - replace with actual implementation
      // const result = await supabase.from('health_check').select('1').limit(1);
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'database',
        status: 'healthy',
        responseTime,
        message: 'Database connection successful',
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'database',
        status: 'unhealthy',
        responseTime,
        message: error instanceof Error ? error.message : 'Database connection failed',
        lastChecked: new Date().toISOString()
      };
    }
  }

  private async checkCache(): Promise<DependencyStatus> {
    const startTime = Date.now();
    
    try {
      // Simulate cache check - replace with actual cache implementation
      // await redis.ping();
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'cache',
        status: 'healthy',
        responseTime,
        message: 'Cache connection successful',
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'cache',
        status: 'degraded', // Cache failure is often non-critical
        responseTime,
        message: error instanceof Error ? error.message : 'Cache connection failed',
        lastChecked: new Date().toISOString()
      };
    }
  }

  private getMemoryMetrics() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage();
      return {
        used: Math.round(memory.heapUsed / 1024 / 1024), // MB
        total: Math.round(memory.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memory.heapUsed / memory.heapTotal) * 100)
      };
    }
    
    return {
      used: 0,
      total: 0,
      percentage: 0
    };
  }

  public async performHealthCheck(): Promise<HealthCheckResult> {
    const checkStartTime = Date.now();
    
    try {
      // Perform dependency checks in parallel
      const [databaseStatus, cacheStatus] = await Promise.allSettled([
        this.checkDatabase(),
        this.checkCache()
      ]);

      const dependencies = {
        database: databaseStatus.status === 'fulfilled' 
          ? databaseStatus.value 
          : { 
              name: 'database', 
              status: 'unhealthy' as const, 
              message: 'Health check failed',
              lastChecked: new Date().toISOString()
            },
        cache: cacheStatus.status === 'fulfilled' 
          ? cacheStatus.value 
          : { 
              name: 'cache', 
              status: 'unhealthy' as const, 
              message: 'Health check failed',
              lastChecked: new Date().toISOString()
            }
      };

      // Determine overall status
      let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (dependencies.database.status === 'unhealthy') {
        overallStatus = 'unhealthy';
      } else if (dependencies.database.status === 'degraded' || 
                 dependencies.cache?.status === 'degraded' ||
                 dependencies.cache?.status === 'unhealthy') {
        overallStatus = 'degraded';
      }

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: this.version,
        uptime: Date.now() - this.startTime,
        dependencies,
        metrics: {
          memory: this.getMemoryMetrics()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: this.version,
        uptime: Date.now() - this.startTime,
        dependencies: {
          database: {
            name: 'database',
            status: 'unhealthy',
            message: 'Health check system error',
            lastChecked: new Date().toISOString()
          }
        },
        metrics: {
          memory: this.getMemoryMetrics()
        }
      };
    }
  }

  // Quick health check for load balancers
  public async quickHealthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Just check if the application is responsive
      return {
        status: 'OK',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Singleton instance
export const healthChecker = new HealthChecker();

// Health check middleware
export function createHealthEndpoint() {
  return async (req: any, res: any) => {
    try {
      const isQuickCheck = req.query.quick === 'true';
      
      if (isQuickCheck) {
        const result = await healthChecker.quickHealthCheck();
        res.status(200).json(result);
      } else {
        const result = await healthChecker.performHealthCheck();
        const statusCode = result.status === 'healthy' ? 200 : 
                          result.status === 'degraded' ? 200 : 503;
        
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Health check endpoint error:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  };
}