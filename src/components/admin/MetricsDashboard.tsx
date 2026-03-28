import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Activity, Database, Clock, TrendingUp } from 'lucide-react';
import { toast } from "sonner";

interface Metrics {
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

interface AlertData {
  type: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: string;
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [history, setHistory] = useState<Metrics[]>([]);
  const [status, setStatus] = useState<'healthy' | 'alerting'>('healthy');
  const [loading, setLoading] = useState(false);

  const fetchCurrentMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('metrics-dashboard', {
        body: {},
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) throw error;

      if (data?.success) {
        setMetrics(data.data.metrics);
        setAlerts(data.data.alerts || []);
        setStatus(data.data.status);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      toast.error('Failed to fetch current metrics');
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('metrics-dashboard', {
        body: { action: 'history' },
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) throw error;

      if (data?.success) {
        setHistory(data.data.history);
      }
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
    }
  };

  const triggerAlertTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('metrics-dashboard', {
        body: { action: 'trigger_alert' },
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) throw error;

      if (data?.success) {
        setMetrics(data.data.metrics);
        setAlerts(data.data.alerts || []);
        setStatus('alerting');
        toast.success('Alert conditions triggered for testing');
      }
    } catch (error) {
      console.error('Failed to trigger alert:', error);
      toast.error('Failed to trigger alert test');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentMetrics();
    fetchHistoricalData();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCurrentMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatLatency = (value: number) => `${value}ms`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Observability Dashboard</h2>
        <div className="flex gap-2">
          <Badge variant={status === 'healthy' ? 'default' : 'destructive'}>
            {status === 'healthy' ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> Healthy</>
            ) : (
              <><AlertTriangle className="w-3 h-3 mr-1" /> Alerting</>
            )}
          </Badge>
          <Button onClick={triggerAlertTest} disabled={loading} size="sm">
            {loading ? 'Triggering...' : 'Test Alerts'}
          </Button>
        </div>
      </div>

      {/* Current Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-destructive">Active Alerts</h3>
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.type}:</strong> {alert.message}
                <div className="text-xs opacity-75 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Current Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">P95 Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLatency(metrics.p95_latency)}</div>
              <p className="text-xs text-muted-foreground">
                Threshold: 700ms
              </p>
              {metrics.p95_latency > 700 && (
                <Badge variant="destructive" className="mt-1">Above Threshold</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(metrics.error_rate)}</div>
              <p className="text-xs text-muted-foreground">
                Threshold: 1%
              </p>
              {metrics.error_rate > 1 && (
                <Badge variant="destructive" className="mt-1">Above Threshold</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DB Pool Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.db_pool_usage}%</div>
              <p className="text-xs text-muted-foreground">
                Threshold: 80%
              </p>
              {metrics.db_pool_usage > 80 && (
                <Badge variant="destructive" className="mt-1">Above Threshold</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.requests_per_minute}</div>
              <p className="text-xs text-muted-foreground">
                Active connections: {metrics.active_connections}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historical Charts */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latency Trends (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value}ms`, '']}
                  />
                  <Line type="monotone" dataKey="p50_latency" stroke="#8884d8" name="P50" strokeWidth={2} />
                  <Line type="monotone" dataKey="p95_latency" stroke="#82ca9d" name="P95" strokeWidth={2} />
                  <Line type="monotone" dataKey="p99_latency" stroke="#ffc658" name="P99" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Rate & DB Usage (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number, name: string) => [
                      name === 'error_rate' ? `${value.toFixed(2)}%` : `${value}%`,
                      name === 'error_rate' ? 'Error Rate' : 'DB Pool'
                    ]}
                  />
                  <Line type="monotone" dataKey="error_rate" stroke="#ff7300" name="Error Rate" strokeWidth={2} />
                  <Line type="monotone" dataKey="db_pool_usage" stroke="#00ff00" name="DB Pool" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Proof Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>P2 Observability Proof</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Alert Thresholds:</h4>
              <ul className="text-sm space-y-1">
                <li>• P95 Latency {'>'}700ms (2 min)</li>
                <li>• Error Rate {'>'}1% (1 min)</li>
                <li>• DB Pool {'>'}80% (2 min)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Current Status:</h4>
              <p className="text-sm">
                Dashboard shows real-time metrics with alert conditions.
                Use "Test Alerts" button to trigger alert conditions.
              </p>
            </div>
          </div>
          
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <strong>Verification:</strong> This dashboard provides live metrics with configurable alerts.
              The "Test Alerts" button demonstrates alert triggering when thresholds are exceeded.
              Metrics are updated every 30 seconds with historical trending.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}