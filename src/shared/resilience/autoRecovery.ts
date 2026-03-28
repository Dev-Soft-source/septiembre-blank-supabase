/**
 * Automated Recovery Mechanisms
 * Self-healing actions for database reconnection, Redis recovery, and cache refresh
 */
import { pool } from '../database/connection';
import readReplicaManager from '../database/readReplicaManager';
import redisClient from '../cache/redisClient';
import { AdvancedCache } from '../cache/advancedCache';
import { logger } from '../logging/logger';

export type RecoveryAction = 
  | 'db_reconnect'
  | 'redis_reconnect'
  | 'cache_refresh'
  | 'replica_failover'
  | 'memory_cleanup'
  | 'connection_reset';

interface RecoveryStatus {
  action: RecoveryAction;
  status: 'idle' | 'running' | 'success' | 'failed';
  timestamp: string;
  attempts: number;
  lastError?: string;
}

export class AutoRecovery {
  private static recoveryStatus = new Map<RecoveryAction, RecoveryStatus>();
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAYS = [1000, 5000, 15000]; // Exponential backoff
  
  /**
   * Initialize auto-recovery system
   */
  static initialize(): void {
    logger.info('Initializing auto-recovery system');
    
    // Set up periodic health monitoring
    setInterval(() => {
      AutoRecovery.performAutomaticChecks();
    }, 30000); // Every 30 seconds
    
    // Initialize recovery status for all actions
    const actions: RecoveryAction[] = [
      'db_reconnect',
      'redis_reconnect', 
      'cache_refresh',
      'replica_failover',
      'memory_cleanup',
      'connection_reset'
    ];
    
    actions.forEach(action => {
      AutoRecovery.recoveryStatus.set(action, {
        action,
        status: 'idle',
        timestamp: new Date().toISOString(),
        attempts: 0
      });
    });
  }
  
  /**
   * Perform automatic health checks and recovery
   */
  private static async performAutomaticChecks(): Promise<void> {
    try {
      // Check database connection
      await AutoRecovery.checkAndRecoverDatabase();
      
      // Check Redis connection
      await AutoRecovery.checkAndRecoverRedis();
      
      // Check memory usage
      await AutoRecovery.checkAndRecoverMemory();
      
    } catch (error) {
      logger.error('Auto-recovery check failed', error instanceof Error ? error : new Error('Unknown recovery error'));
    }
  }
  
  /**
   * Check and recover database connection
   */
  private static async checkAndRecoverDatabase(): Promise<void> {
    try {
      await pool.query('SELECT 1');
    } catch (error) {
      logger.warn('Database connection check failed, initiating recovery', { error });
      await AutoRecovery.executeRecovery('db_reconnect');
    }
  }
  
  /**
   * Check and recover Redis connection
   */
  private static async checkAndRecoverRedis(): Promise<void> {
    try {
      await redisClient.ping();
    } catch (error) {
      logger.warn('Redis connection check failed, initiating recovery', { error });
      await AutoRecovery.executeRecovery('redis_reconnect');
    }
  }
  
  /**
   * Check and recover memory usage
   */
  private static async checkAndRecoverMemory(): Promise<void> {
    const usage = process.memoryUsage();
    const heapUsagePercent = usage.heapUsed / usage.heapTotal;
    
    if (heapUsagePercent > 0.85) {
      logger.warn('High memory usage detected, initiating cleanup', { 
        heapUsagePercent: (heapUsagePercent * 100).toFixed(2) + '%'
      });
      await AutoRecovery.executeRecovery('memory_cleanup');
    }
  }
  
  /**
   * Execute recovery action with retry logic
   */
  static async executeRecovery(action: RecoveryAction): Promise<boolean> {
    const status = AutoRecovery.recoveryStatus.get(action);
    if (!status) {
      logger.error(`Unknown recovery action: ${action}`);
      return false;
    }
    
    if (status.status === 'running') {
      logger.warn('Recovery action already running', { action });
      return false;
    }
    
    // Update status to running
    status.status = 'running';
    status.timestamp = new Date().toISOString();
    status.attempts++;
    
    try {
      logger.info(`Starting recovery action: ${action} (attempt ${status.attempts})`);
      
      const success = await AutoRecovery.performRecoveryAction(action);
      
      if (success) {
        status.status = 'success';
        status.lastError = undefined;
        logger.info(`Recovery action completed successfully: ${action}`);
        return true;
      } else {
        throw new Error('Recovery action returned false');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      status.status = 'failed';
      status.lastError = errorMessage;
      
      logger.error(`Recovery action failed: ${action}`, new Error(errorMessage), { 
        attempt: status.attempts 
      });
      
      // Retry with exponential backoff
      if (status.attempts < AutoRecovery.MAX_RETRY_ATTEMPTS) {
        const delay = AutoRecovery.RETRY_DELAYS[status.attempts - 1] || 15000;
        
        setTimeout(() => {
          AutoRecovery.executeRecovery(action);
        }, delay);
        
        logger.info(`Scheduling recovery retry for: ${action} (delay: ${delay}ms, next attempt: ${status.attempts + 1})`);
      } else {
        logger.error(`Recovery action exceeded max attempts: ${action} (max: ${AutoRecovery.MAX_RETRY_ATTEMPTS})`);
        status.attempts = 0; // Reset for future attempts
      }
      
      return false;
    }
  }
  
  /**
   * Perform the actual recovery action
   */
  private static async performRecoveryAction(action: RecoveryAction): Promise<boolean> {
    switch (action) {
      case 'db_reconnect':
        return await AutoRecovery.reconnectDatabase();
        
      case 'redis_reconnect':
        return await AutoRecovery.reconnectRedis();
        
      case 'cache_refresh':
        return await AutoRecovery.refreshCache();
        
      case 'replica_failover':
        return await AutoRecovery.performReplicaFailover();
        
      case 'memory_cleanup':
        return await AutoRecovery.performMemoryCleanup();
        
      case 'connection_reset':
        return await AutoRecovery.resetConnections();
        
      default:
        logger.error(`Unknown recovery action: ${action}`);
        return false;
    }
  }
  
  /**
   * Reconnect to database
   */
  private static async reconnectDatabase(): Promise<boolean> {
    try {
      // End existing pool connections
      await pool.end();
      
      // Wait a moment before reconnecting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test new connection
      await pool.query('SELECT 1');
      
      logger.info('Database reconnection successful');
      return true;
    } catch (error) {
      logger.error('Database reconnection failed', error instanceof Error ? error : new Error('Unknown database reconnection error'));
      return false;
    }
  }
  
  /**
   * Reconnect to Redis
   */
  private static async reconnectRedis(): Promise<boolean> {
    try {
      // Disconnect existing client
      await redisClient.disconnect();
      
      // Wait before reconnecting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reconnect
      await redisClient.connect();
      
      // Test connection
      await redisClient.ping();
      
      logger.info('Redis reconnection successful');
      return true;
    } catch (error) {
      logger.error('Redis reconnection failed', error instanceof Error ? error : new Error('Unknown Redis reconnection error'));
      return false;
    }
  }
  
  /**
   * Refresh cache
   */
  private static async refreshCache(): Promise<boolean> {
    try {
      // Clear all cache data
      await AdvancedCache.invalidate('*');
      
      // Cleanup metadata
      AdvancedCache.cleanup(0); // Clear all metadata
      
      logger.info('Cache refresh completed');
      return true;
    } catch (error) {
      logger.error('Cache refresh failed', error instanceof Error ? error : new Error('Unknown cache refresh error'));
      return false;
    }
  }
  
  /**
   * Perform replica failover
   */
  private static async performReplicaFailover(): Promise<boolean> {
    try {
      // This would implement actual replica failover logic
      // For now, just test replica connectivity
      const replica = readReplicaManager.getReplica();
      await replica.query('SELECT 1');
      
      logger.info('Replica failover check completed');
      return true;
    } catch (error) {
      logger.error('Replica failover failed', error instanceof Error ? error : new Error('Unknown replica failover error'));
      return false;
    }
  }
  
  /**
   * Perform memory cleanup
   */
  private static async performMemoryCleanup(): Promise<boolean> {
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Cleanup cache metadata
      AdvancedCache.cleanup(60 * 60 * 1000); // Clean entries older than 1 hour
      
      // Clear old recovery logs
      AutoRecovery.cleanupOldRecoveryLogs();
      
      const memoryAfter = process.memoryUsage();
      logger.info('Memory cleanup completed', {
        heapUsed: `${(memoryAfter.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        heapTotal: `${(memoryAfter.heapTotal / 1024 / 1024).toFixed(2)}MB`
      });
      
      return true;
    } catch (error) {
      logger.error('Memory cleanup failed', error instanceof Error ? error : new Error('Unknown memory cleanup error'));
      return false;
    }
  }
  
  /**
   * Reset all connections
   */
  private static async resetConnections(): Promise<boolean> {
    try {
      const dbSuccess = await AutoRecovery.reconnectDatabase();
      const redisSuccess = await AutoRecovery.reconnectRedis();
      
      return dbSuccess && redisSuccess;
    } catch (error) {
      logger.error('Connection reset failed', error instanceof Error ? error : new Error('Unknown connection reset error'));
      return false;
    }
  }
  
  /**
   * Clean up old recovery logs
   */
  private static cleanupOldRecoveryLogs(): void {
    // Reset attempts counter for actions that have been idle
    for (const [action, status] of AutoRecovery.recoveryStatus) {
      if (status.status === 'idle' || status.status === 'success') {
        const age = Date.now() - new Date(status.timestamp).getTime();
        if (age > 24 * 60 * 60 * 1000) { // 24 hours
          status.attempts = 0;
          status.lastError = undefined;
        }
      }
    }
  }
  
  /**
   * Get recovery status for all actions
   */
  static getRecoveryStatus(): Map<RecoveryAction, RecoveryStatus> {
    return new Map(AutoRecovery.recoveryStatus);
  }
  
  /**
   * Get recovery status for specific action
   */
  static getActionStatus(action: RecoveryAction): RecoveryStatus | undefined {
    return AutoRecovery.recoveryStatus.get(action);
  }
  
  /**
   * Manually trigger recovery action
   */
  static async triggerRecovery(action: RecoveryAction): Promise<boolean> {
    logger.info(`Manual recovery trigger requested: ${action}`);
    return await AutoRecovery.executeRecovery(action);
  }
}