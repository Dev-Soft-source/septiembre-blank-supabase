/**
 * P0 Stability Tests Admin Page
 * Provides access to comprehensive stability validation
 */

import { StabilityTestRunner } from '@/components/admin/StabilityTestRunner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Zap, BarChart3, AlertTriangle } from 'lucide-react';

export default function StabilityTests() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">P0 Stability Validation</h1>
            <p className="text-muted-foreground">
              Comprehensive testing suite for production-scale stability features
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-semibold">PgBouncer Ready</div>
                  <div className="text-sm text-muted-foreground">Transaction pooling</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-semibold">Circuit Breakers</div>
                  <div className="text-sm text-muted-foreground">500ms fail-fast</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-semibold">L2 Caching</div>
                  <div className="text-sm text-muted-foreground">Memory + TTL</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-semibold">Monitoring</div>
                  <div className="text-sm text-muted-foreground">Auto alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>P0 Implementation Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Database Connection Pooling</span>
                  <Badge variant="secondary">Config Ready</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Enhanced Supabase client with PgBouncer-compatible settings. 
                  Production deployment requires server-level PgBouncer configuration.
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Circuit Breakers & Timeouts</span>
                  <Badge>Implemented</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Auth, availability, and booking operations protected with 500ms timeout, 
                  3-failure threshold, 30-second recovery window.
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Redis Caching Layer</span>
                  <Badge>In-Memory</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  L2 cache with TTL support: 5-15min for availability, 24-48h for static data. 
                  Production would use Redis/Upstash.
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Automated Alerts</span>
                  <Badge>Monitoring</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Tracks DB pool {'>'} 80%, API P95 {'>'} 700ms, error rate {'>'} 1%. 
                  Console logging ready for Slack/email integration.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StabilityTestRunner />
    </div>
  );
}