/**
 * Enhanced Hotel Living Server with Security and Performance Monitoring
 */
import express from 'express';
import cors from 'cors';
import { advancedSecurityHeaders, cspReportHandler } from './shared/middleware/advancedSecurityHeaders';
import { SecurityMonitor } from './shared/security/securityMonitor';
import { AutoRecovery } from './shared/resilience/autoRecovery';
import { PerformanceMonitor } from './shared/performance/performanceMonitor';
import { AdvancedHealthChecker } from './shared/health/advancedHealthChecker';
import { logger } from './shared/logging/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Security headers (apply early)
app.use(advancedSecurityHeaders);
app.use(cspReportHandler);

// Performance monitoring (wrap all requests)
app.use(PerformanceMonitor.middleware());

// Health check endpoints
app.get('/health', async (req, res) => {
  try {
    const health = await AdvancedHealthChecker.performHealthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'critical',
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

app.get('/health/advanced', async (req, res) => {
  try {
    const health = await AdvancedHealthChecker.performHealthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      error: 'Advanced health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Security monitoring endpoints
app.get('/security', (req, res) => {
  try {
    const report = SecurityMonitor.getSecurityReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get security report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Performance monitoring endpoints
app.get('/performance', (req, res) => {
  try {
    const report = PerformanceMonitor.getPerformanceReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get performance report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Recovery endpoints
app.get('/recovery', (req, res) => {
  try {
    const status = AutoRecovery.getRecoveryStatus();
    const statusObj = Object.fromEntries(status);
    res.json({
      status: 'operational',
      recoveryActions: statusObj
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get recovery status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/recovery/:action', async (req, res) => {
  try {
    const { action } = req.params;
    
    // Validate action
    const validActions = ['db_reconnect', 'redis_reconnect', 'cache_refresh', 'replica_failover', 'memory_cleanup', 'connection_reset'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        error: 'Invalid recovery action',
        validActions
      });
    }
    
    const success = await AutoRecovery.triggerRecovery(action as any);
    
    res.json({
      action,
      success,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Recovery action failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// CSP report endpoint
app.post('/api/security/csp-report', express.json(), (req, res) => {
  // This is handled by cspReportHandler middleware
  res.status(204).send();
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled server error', error, {
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Record error for performance monitoring
  AdvancedHealthChecker.recordError();
  
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize systems
async function initializeServer() {
  try {
    // Initialize auto-recovery system
    AutoRecovery.initialize();
    
    // Log system start
    SecurityMonitor.logSecurityEvent('system_start', 'low', {
      ip: '127.0.0.1',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });
    
    logger.info('Hotel Living server initialized successfully', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Server initialization failed', error instanceof Error ? error : new Error('Unknown error'));
    process.exit(1);
  }
}

// Start server
app.listen(PORT, async () => {
  await initializeServer();
  console.log(`🚀 Hotel Living server running on port ${PORT}`);
  console.log(`📊 Monitoring endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - Advanced Health: http://localhost:${PORT}/health/advanced`);
  console.log(`   - Security: http://localhost:${PORT}/security`);
  console.log(`   - Performance: http://localhost:${PORT}/performance`);
  console.log(`   - Recovery: http://localhost:${PORT}/recovery`);
});

export default app;