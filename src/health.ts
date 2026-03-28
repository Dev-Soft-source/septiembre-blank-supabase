/**
 * Health Check Endpoint for Load Balancers
 */
import { ComprehensiveHealthChecker } from './shared/health/comprehensiveHealthChecker';

export async function healthHandler(req: any, res: any) {
  try {
    const { status, body } = await ComprehensiveHealthChecker.getHealthStatus();
    
    res.status(status).json(body);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}

// Simple health check for basic monitoring
export function simpleHealthHandler(req: any, res: any) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || 'unknown'
  });
}