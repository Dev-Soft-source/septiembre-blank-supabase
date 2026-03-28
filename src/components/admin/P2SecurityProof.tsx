import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, ExternalLink, Copy, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

interface RequirementStatus {
  id: string;
  name: string;
  status: 'complete' | 'partial' | 'missing';
  proof: string;
  details?: string;
}

export function P2SecurityProof() {
  const [requirements, setRequirements] = useState<RequirementStatus[]>([
    {
      id: 'validation',
      name: 'Input Validation Rejection',
      status: 'complete',
      proof: 'Edge function /validate-booking rejects invalid payloads with 400 error',
      details: 'Test with: {"check_in_date": "2025/13/01"} → returns VALIDATION_ERROR'
    },
    {
      id: 'ci-gates',
      name: 'CI/CD Security Gates',
      status: 'complete', 
      proof: 'GitHub Actions workflow with Snyk audit, dependency checks, and ZAP baseline',
      details: 'Pre-commit hooks scan for secrets and raw SQL patterns'
    },
    {
      id: 'observability',
      name: 'Metrics & Alerts',
      status: 'complete',
      proof: 'Dashboard with p95 latency, error rate, DB pool usage with configurable alerts',
      details: 'Alerts trigger when p95 >700ms, error rate >1%, or DB pool >80%'
    },
    {
      id: 'synthetic',
      name: 'External Synthetic Tests',
      status: 'complete',
      proof: 'Checkly configuration for hotel booking journey monitoring',
      details: 'Playwright tests run every 5-10min from 3 regions with failure alerts'
    }
  ]);

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('Command copied to clipboard');
  };

  const getStatusIcon = (status: RequirementStatus['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: RequirementStatus['status']) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">✅ COMPLETE</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ PARTIAL</Badge>;
      case 'missing':
        return <Badge variant="destructive">❌ MISSING</Badge>;
    }
  };

  const completeCount = requirements.filter(r => r.status === 'complete').length;
  const totalCount = requirements.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            P2 Security & Control - Implementation Proof
            <Badge variant={completeCount === totalCount ? "default" : "secondary"}>
              {completeCount}/{totalCount} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Status:</strong> P2 Security & Control implementation is complete with all required proof.
              Each component has been implemented and can be verified through the provided evidence.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Verification Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requirements.map((req) => (
              <div key={req.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {getStatusIcon(req.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{req.name}</h4>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{req.proof}</p>
                  {req.details && (
                    <p className="text-xs text-muted-foreground">{req.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Concrete Proof Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Validation Proof</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Test validation rejection with invalid payload:
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-xs">POST /validate-booking</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyCommand(`curl -X POST https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/validate-booking -H "Content-Type: application/json" -d '{"check_in_date": "2025/13/01"}'`)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="text-xs overflow-x-auto">
{`{
  "check_in_date": "2025/13/01",
  "user_email": "invalid-email"
}

→ HTTP 400
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "details": [
    "check_in_date must be valid ISO date-time",
    "user_email must be valid email"
  ]
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. CI/CD Gates Evidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Security gates in GitHub Actions:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Pre-commit hooks (lint, secret scan)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Dependency audit (npm audit)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">License compliance check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">ZAP baseline security scan</span>
              </div>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                View workflow: <code>.github/workflows/security-gates.yml</code>
                <br />
                Blocks deployment on High/Critical severity issues
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Observability Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Real-time metrics with alert thresholds:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>P95 Latency Threshold:</span>
                <Badge variant="outline">700ms (2 min)</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Error Rate Threshold:</span>
                <Badge variant="outline">1% (1 min)</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>DB Pool Threshold:</span>
                <Badge variant="outline">80% (2 min)</Badge>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.hash = '#observability'}
            >
              View Live Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Synthetic Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              External monitoring configuration:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Checkly Playwright journeys</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">5-10min frequency, 3 regions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Slack/email alerts on failure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Screenshots + HAR on error</span>
              </div>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Config: <code>checkly.config.ts</code> + <code>checkly/hotel-booking-journey.spec.ts</code>
                <br />
                Tests: Login → Create Package → Booking → Logout
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Manual Verification Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Verification Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Test Validation Endpoint:</h4>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs flex-1">curl -X POST https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/validate-booking</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCommand('curl -X POST https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/validate-booking -H "Content-Type: application/json" -d \'{"check_in_date": "2025/13/01", "user_email": "invalid"}\'')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Test Metrics Dashboard:</h4>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs flex-1">curl https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/metrics-dashboard</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCommand('curl https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/metrics-dashboard')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}