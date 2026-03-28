import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetricsData {
  timestamp: number;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  user_id?: string;
  ip_address?: string;
  error_message?: string;
}

interface AlertRule {
  name: string;
  condition: string;
  threshold: number;
  window_minutes: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const ALERT_RULES: AlertRule[] = [
  {
    name: 'High P95 Latency',
    condition: 'p95_latency_ms',
    threshold: 700,
    window_minutes: 2,
    severity: 'high'
  },
  {
    name: 'Error Rate Spike',
    condition: 'error_rate_percent',
    threshold: 1,
    window_minutes: 1,
    severity: 'high'
  },
  {
    name: 'DB Pool Usage',
    condition: 'db_pool_usage_percent',
    threshold: 80,
    window_minutes: 2,
    severity: 'medium'
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'metrics';

    if (action === 'metrics') {
      // Generate current metrics snapshot
      const metrics = await generateMetricsSnapshot(supabase);
      
      return new Response(JSON.stringify(metrics), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'alerts') {
      // Check alert conditions
      const alerts = await checkAlertConditions(supabase);
      
      return new Response(JSON.stringify({ alerts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'record' && req.method === 'POST') {
      // Record new metric data point
      const data = await req.json() as MetricsData;
      await recordMetric(supabase, data);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'dashboard') {
      // Return dashboard data
      const dashboardData = await getDashboardData(supabase);
      
      return new Response(JSON.stringify(dashboardData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Security metrics error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateMetricsSnapshot(supabase: any) {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  // Simulate metrics collection from various sources
  const apiMetrics = {
    p50_latency_ms: Math.random() * 200 + 100,
    p95_latency_ms: Math.random() * 500 + 200,
    p99_latency_ms: Math.random() * 1000 + 500,
    error_rate_percent: Math.random() * 2,
    request_count: Math.floor(Math.random() * 1000) + 500,
  };

  const dbMetrics = {
    pool_usage_percent: Math.random() * 60 + 20,
    active_connections: Math.floor(Math.random() * 50) + 10,
    avg_query_time_ms: Math.random() * 50 + 10,
  };

  const cacheMetrics = {
    hit_rate_percent: Math.random() * 30 + 70,
    miss_rate_percent: Math.random() * 30 + 0,
    eviction_rate: Math.random() * 10,
  };

  const circuitBreakerStates = {
    auth: Math.random() > 0.95 ? 'open' : 'closed',
    availability: Math.random() > 0.98 ? 'open' : 'closed',
    booking: Math.random() > 0.97 ? 'open' : 'closed',
  };

  return {
    timestamp: now.toISOString(),
    api: apiMetrics,
    database: dbMetrics,
    cache: cacheMetrics,
    circuit_breakers: circuitBreakerStates,
    health_status: {
      overall: 'healthy',
      components: {
        api: apiMetrics.error_rate_percent < 1 ? 'healthy' : 'degraded',
        database: dbMetrics.pool_usage_percent < 80 ? 'healthy' : 'degraded',
        cache: cacheMetrics.hit_rate_percent > 70 ? 'healthy' : 'degraded',
      }
    }
  };
}

async function checkAlertConditions(supabase: any) {
  const metrics = await generateMetricsSnapshot(supabase);
  const activeAlerts = [];

  for (const rule of ALERT_RULES) {
    let currentValue = 0;
    let shouldAlert = false;

    switch (rule.condition) {
      case 'p95_latency_ms':
        currentValue = metrics.api.p95_latency_ms;
        shouldAlert = currentValue > rule.threshold;
        break;
      case 'error_rate_percent':
        currentValue = metrics.api.error_rate_percent;
        shouldAlert = currentValue > rule.threshold;
        break;
      case 'db_pool_usage_percent':
        currentValue = metrics.database.pool_usage_percent;
        shouldAlert = currentValue > rule.threshold;
        break;
    }

    if (shouldAlert) {
      activeAlerts.push({
        rule: rule.name,
        severity: rule.severity,
        current_value: currentValue,
        threshold: rule.threshold,
        triggered_at: new Date().toISOString(),
        message: `${rule.name}: ${currentValue.toFixed(2)} exceeds threshold of ${rule.threshold}`
      });
    }
  }

  return activeAlerts;
}

async function recordMetric(supabase: any, data: MetricsData) {
  // In a real implementation, this would store metrics in a time-series database
  // For now, we'll log the metric
  console.log('Recording metric:', {
    timestamp: data.timestamp,
    endpoint: data.endpoint,
    method: data.method,
    status_code: data.status_code,
    response_time_ms: data.response_time_ms,
    user_id: data.user_id,
    ip_address: data.ip_address ? `${data.ip_address.slice(0, 8)}...` : undefined, // Redact IP
    has_error: !!data.error_message
  });

  return true;
}

async function getDashboardData(supabase: any) {
  const metrics = await generateMetricsSnapshot(supabase);
  const alerts = await checkAlertConditions(supabase);

  // Generate historical data for charts (mock data)
  const historicalData = [];
  const now = Date.now();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = now - (i * 60 * 1000); // Every minute for 24 minutes
    historicalData.push({
      timestamp,
      p95_latency: Math.random() * 200 + 300,
      error_rate: Math.random() * 3,
      db_pool_usage: Math.random() * 40 + 30,
      cache_hit_rate: Math.random() * 20 + 75,
    });
  }

  return {
    current_metrics: metrics,
    active_alerts: alerts,
    historical_data: historicalData,
    uptime_status: {
      overall_uptime: 99.95,
      api_uptime: 99.98,
      db_uptime: 99.92,
      cache_uptime: 99.99,
    },
    performance_summary: {
      avg_response_time_24h: 245,
      total_requests_24h: 125430,
      error_count_24h: 12,
      peak_rps: 85,
    }
  };
}