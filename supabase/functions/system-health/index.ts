import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SystemHealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  response_time_ms?: number;
  details?: any;
  last_check: string;
}

interface ConnectionPoolStats {
  active_connections: number;
  idle_connections: number;
  total_connections: number;
  max_connections: number;
  connection_utilization: number;
}

async function checkDatabaseHealth(): Promise<SystemHealthCheck> {
  const startTime = Date.now();
  
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    // Simple connectivity test
    const { data, error } = await supabase
      .from('hotels')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        component: 'database',
        status: 'unhealthy',
        response_time_ms: responseTime,
        details: { error: error.message },
        last_check: new Date().toISOString()
      };
    }
    
    return {
      component: 'database',
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      response_time_ms: responseTime,
      details: { query_result: data ? 'success' : 'empty' },
      last_check: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      component: 'database',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error instanceof Error ? error.message : String(error) },
      last_check: new Date().toISOString()
    };
  }
}

async function checkApiV2Health(): Promise<SystemHealthCheck> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/api-v2`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        component: 'api-v2',
        status: 'unhealthy',
        response_time_ms: responseTime,
        details: { status_code: response.status },
        last_check: new Date().toISOString()
      };
    }
    
    return {
      component: 'api-v2',
      status: responseTime > 2000 ? 'degraded' : 'healthy',
      response_time_ms: responseTime,
      details: { status_code: response.status },
      last_check: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      component: 'api-v2',
      status: 'unhealthy',
      response_time_ms: Date.now() - startTime,
      details: { error: error instanceof Error ? error.message : String(error) },
      last_check: new Date().toISOString()
    };
  }
}

async function getConnectionPoolStats(): Promise<ConnectionPoolStats> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    // Try to get connection stats (may not be available on all plans)
    const { data: connStats } = await supabase
      .rpc('sql', { 
        query: `
          SELECT 
            count(*) FILTER (WHERE state = 'active') as active,
            count(*) FILTER (WHERE state = 'idle') as idle,
            count(*) as total,
            (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_conn
          FROM pg_stat_activity 
          WHERE datname = current_database()
        ` 
      })
      .catch(() => ({ data: null }));
    
    if (connStats && connStats.length > 0) {
      const stats = connStats[0];
      return {
        active_connections: stats.active,
        idle_connections: stats.idle,
        total_connections: stats.total,
        max_connections: stats.max_conn,
        connection_utilization: (stats.total / stats.max_conn) * 100
      };
    }
    
    // Fallback for basic plans
    return {
      active_connections: 0,
      idle_connections: 0,
      total_connections: 0,
      max_connections: 100,
      connection_utilization: 0
    };
    
  } catch (error) {
    return {
      active_connections: -1,
      idle_connections: -1,
      total_connections: -1,
      max_connections: 100,
      connection_utilization: -1
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    if (url.pathname === '/health' && req.method === 'GET') {
      // Comprehensive health check
      const [dbHealth, apiHealth] = await Promise.all([
        checkDatabaseHealth(),
        checkApiV2Health()
      ]);
      
      const connectionStats = await getConnectionPoolStats();
      
      const overallStatus = [dbHealth, apiHealth].every(h => h.status === 'healthy') ? 'healthy' :
                           [dbHealth, apiHealth].some(h => h.status === 'unhealthy') ? 'unhealthy' : 'degraded';
      
      return new Response(JSON.stringify({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        components: [dbHealth, apiHealth],
        connection_pool: connectionStats,
        version: '2.0.0',
        uptime: process?.uptime?.() || 'N/A'
      }), {
        status: overallStatus === 'healthy' ? 200 : 503,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (url.pathname === '/metrics' && req.method === 'GET') {
      // Basic system metrics
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      
      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Get request counts from security audit logs
      const { data: requestMetrics } = await supabase
        .from('security_audit_logs')
        .select('endpoint, response_code')
        .gte('timestamp', since24h)
        .then(({ data, error }) => ({ data: error ? [] : data }));
      
      const totalRequests = requestMetrics?.length || 0;
      const successfulRequests = requestMetrics?.filter(r => r.response_code < 400).length || 0;
      const errorRequests = requestMetrics?.filter(r => r.response_code >= 400).length || 0;
      
      return new Response(JSON.stringify({
        period: '24h',
        metrics: {
          total_requests: totalRequests,
          successful_requests: successfulRequests,
          error_requests: errorRequests,
          success_rate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100,
          error_rate: totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (url.pathname === '/ping' && req.method === 'GET') {
      // Simple ping endpoint for monitoring
      return new Response(JSON.stringify({
        message: 'pong',
        timestamp: new Date().toISOString(),
        service: 'Hotel Living API'
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error) {
    console.error('System health error:', error);
    
    return new Response(JSON.stringify({
      status: 'unhealthy',
      error: 'System health check failed',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});