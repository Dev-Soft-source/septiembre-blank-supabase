import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetricsData {
  p50_latency: number;
  p95_latency: number;
  p99_latency: number;
  error_rate: number;
  db_pool_usage: number;
  cache_hit_rate: number;
  active_connections: number;
  requests_per_minute: number;
  timestamp: string;
}

// Simulate realistic metrics with some variance
function generateMetrics(): MetricsData {
  const baseLatency = 150 + Math.random() * 100;
  const errorSpike = Math.random() > 0.9; // 10% chance of error spike
  
  return {
    p50_latency: Math.round(baseLatency),
    p95_latency: Math.round(baseLatency * 2.5 + Math.random() * 200),
    p99_latency: Math.round(baseLatency * 4 + Math.random() * 400),
    error_rate: errorSpike ? 2.5 + Math.random() * 3 : Math.random() * 0.5,
    db_pool_usage: Math.round(60 + Math.random() * 30),
    cache_hit_rate: Math.round(85 + Math.random() * 10),
    active_connections: Math.round(20 + Math.random() * 30),
    requests_per_minute: Math.round(150 + Math.random() * 100),
    timestamp: new Date().toISOString()
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'current';

    if (action === 'current') {
      // Return current metrics
      const metrics = generateMetrics();
      
      // Check for alert conditions
      const alerts = [];
      if (metrics.p95_latency > 700) {
        alerts.push({
          type: 'HIGH_LATENCY',
          message: `P95 latency is ${metrics.p95_latency}ms (threshold: 700ms)`,
          severity: 'warning',
          timestamp: metrics.timestamp
        });
      }
      
      if (metrics.error_rate > 1) {
        alerts.push({
          type: 'HIGH_ERROR_RATE',
          message: `Error rate is ${metrics.error_rate.toFixed(2)}% (threshold: 1%)`,
          severity: 'critical',
          timestamp: metrics.timestamp
        });
      }
      
      if (metrics.db_pool_usage > 80) {
        alerts.push({
          type: 'HIGH_DB_POOL_USAGE',
          message: `DB pool usage is ${metrics.db_pool_usage}% (threshold: 80%)`,
          severity: 'warning',
          timestamp: metrics.timestamp
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            metrics,
            alerts,
            status: alerts.length > 0 ? 'alerting' : 'healthy'
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (action === 'history') {
      // Return historical data (last 24 hours simulated)
      const history = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
        const metrics = generateMetrics();
        metrics.timestamp = timestamp.toISOString();
        history.push(metrics);
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            history,
            period: '24h',
            interval: '1h'
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (action === 'trigger_alert') {
      // Simulate high latency/error rate for alert testing
      const metrics = {
        p50_latency: 450,
        p95_latency: 850, // Above 700ms threshold
        p99_latency: 1200,
        error_rate: 2.3, // Above 1% threshold
        db_pool_usage: 85, // Above 80% threshold
        cache_hit_rate: 82,
        active_connections: 45,
        requests_per_minute: 180,
        timestamp: new Date().toISOString()
      };

      const alerts = [
        {
          type: 'HIGH_LATENCY',
          message: `P95 latency is ${metrics.p95_latency}ms (threshold: 700ms)`,
          severity: 'warning',
          timestamp: metrics.timestamp
        },
        {
          type: 'HIGH_ERROR_RATE',
          message: `Error rate is ${metrics.error_rate}% (threshold: 1%)`,
          severity: 'critical',
          timestamp: metrics.timestamp
        },
        {
          type: 'HIGH_DB_POOL_USAGE',
          message: `DB pool usage is ${metrics.db_pool_usage}% (threshold: 80%)`,
          severity: 'warning',
          timestamp: metrics.timestamp
        }
      ];

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            metrics,
            alerts,
            status: 'alerting',
            message: 'Alert conditions triggered for testing'
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid action parameter'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Metrics dashboard error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});