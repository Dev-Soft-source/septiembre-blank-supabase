import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecurityMetrics {
  totalRequests: number;
  failedRequests: number;
  rateLimitViolations: number;
  suspiciousActivities: number;
  criticalAlerts: number;
  topFailedEndpoints: Array<{ endpoint: string; count: number }>;
  topViolatingIPs: Array<{ ip_address: string; count: number }>;
  recentAlerts: Array<any>;
}

async function requireAdmin(req: Request) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  // Check admin status
  const { data: isAdmin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!isAdmin) {
    throw new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  return { supabase, user };
}

async function getSecurityMetrics(supabase: any, timeframe: string = '24h'): Promise<SecurityMetrics> {
  const hoursAgo = timeframe === '1h' ? 1 : (timeframe === '7d' ? 168 : 24);
  const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  // Get total requests
  const { data: totalReqData } = await supabase
    .from('security_audit_logs')
    .select('id', { count: 'exact' })
    .gte('timestamp', since);
  
  // Get failed requests (4xx, 5xx status codes)
  const { data: failedReqData } = await supabase
    .from('security_audit_logs')
    .select('id', { count: 'exact' })
    .gte('timestamp', since)
    .gte('response_code', 400);

  // Get rate limit violations
  const { data: rateLimitData } = await supabase
    .from('rate_limit_violations')
    .select('id', { count: 'exact' })
    .gte('last_violation', since);

  // Get security alerts
  const { data: alertsData } = await supabase
    .from('security_alerts')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  // Count critical alerts
  const criticalAlerts = alertsData?.filter(alert => alert.severity === 'critical').length || 0;

  // Get top failed endpoints
  const { data: failedEndpoints } = await supabase
    .from('security_audit_logs')
    .select('endpoint')
    .gte('timestamp', since)
    .gte('response_code', 400);

  const endpointCounts = failedEndpoints?.reduce((acc: any, log: any) => {
    acc[log.endpoint] = (acc[log.endpoint] || 0) + 1;
    return acc;
  }, {}) || {};

  const topFailedEndpoints = Object.entries(endpointCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([endpoint, count]) => ({ endpoint, count: count as number }));

  // Get top violating IPs
  const { data: violatingIPs } = await supabase
    .from('rate_limit_violations')
    .select('ip_address, violation_count')
    .gte('last_violation', since);

  const ipCounts = violatingIPs?.reduce((acc: any, violation: any) => {
    acc[violation.ip_address] = (acc[violation.ip_address] || 0) + violation.violation_count;
    return acc;
  }, {}) || {};

  const topViolatingIPs = Object.entries(ipCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([ip_address, count]) => ({ ip_address, count: count as number }));

  return {
    totalRequests: totalReqData?.length || 0,
    failedRequests: failedReqData?.length || 0,
    rateLimitViolations: rateLimitData?.length || 0,
    suspiciousActivities: alertsData?.length || 0,
    criticalAlerts,
    topFailedEndpoints,
    topViolatingIPs,
    recentAlerts: alertsData?.slice(0, 20) || []
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { supabase } = await requireAdmin(req);
    const url = new URL(req.url);

    if (url.pathname === '/metrics' && req.method === 'GET') {
      const timeframe = url.searchParams.get('timeframe') || '24h';
      const metrics = await getSecurityMetrics(supabase, timeframe);
      
      return new Response(JSON.stringify({
        success: true,
        data: metrics,
        timeframe,
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (url.pathname === '/alerts' && req.method === 'GET') {
      const { data: alerts } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      return new Response(JSON.stringify({
        success: true,
        data: alerts || [],
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (url.pathname.match(/^\/alerts\/[^\/]+\/resolve$/) && req.method === 'POST') {
      const alertId = url.pathname.split('/')[2];
      const { user } = await requireAdmin(req);
      
      const { error } = await supabase
        .from('security_alerts')
        .update({
          resolved: true,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Alert resolved'
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (url.pathname === '/audit-logs' && req.method === 'GET') {
      const page = Math.max(1, Number(url.searchParams.get('page') || 1));
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 50)));
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: logs, error, count } = await supabase
        .from('security_audit_logs')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .range(from, to);

      if (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: logs || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error) {
    console.error('Security dashboard error:', error);
    
    if (error instanceof Response) {
      return error;
    }

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});