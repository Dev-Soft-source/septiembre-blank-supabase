/**
 * Simple test runner for P0 stability validation
 * Executes tests via edge function and displays results
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Database, Zap, BarChart3, Bell, Terminal, ExternalLink } from 'lucide-react';

interface TestResult {
  test: string;
  result?: 'PASS' | 'FAIL';
  status?: 'PASS' | 'FAIL' | 'ok';
  latencyMs?: number;
  breakerState?: string;
  reason?: string;
  step?: number;
  cache?: string;
  connectionsSimulated?: number;
  errors?: number;
  triggered?: string[];
}

interface TestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  partial: number;
  avgDuration: number;
}

export function StabilityTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [rawResults, setRawResults] = useState<any[]>([]);
  const { toast } = useToast();

  const runTests = async (testType: string) => {
    setIsRunning(true);
    setResults([]);
    
    try {
      setCurrentTest(`Running ${testType} test...`);
      console.log(`[STABILITY TEST] Starting ${testType} test execution`);
      
      const { data, error } = await supabase.functions.invoke('stability-validation-tests', {
        body: { testType }
      });

      console.log(`[STABILITY TEST] Response:`, { data, error });

      if (error) {
        console.error(`[STABILITY TEST] Edge function error:`, error);
        throw new Error(`Edge Function Error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response received from Edge Function');
      }

      // Handle simple JSON response format
      setResults([data]);
      
      const status = data.result || data.status;
      const success = status === 'PASS' || status === 'ok';
      
      console.log(`[STABILITY TEST] Result: ${data.test} = ${status}`);
      
      toast({
        title: `${data.test} Test`,
        description: `Result: ${status}`,
        variant: success ? "default" : "destructive"
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during test execution';
      console.error('[STABILITY TEST] Complete error details:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      toast({
        title: "Test Execution Failed", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Direct Edge Function test without Supabase client
  const runDirectTest = async (testType: string) => {
    setIsRunning(true);
    setRawResults([]);
    
    try {
      setCurrentTest(`Direct testing ${testType}...`);
      console.log(`🧪 DIRECT TEST: ${testType}`);
      console.log('━'.repeat(50));
      
      const url = 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/stability-validation-tests';
      const payload = { testType };
      
      console.log(`📍 URL: ${url}`);
      console.log(`📍 Payload:`, payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0'
        },
        body: JSON.stringify(payload)
      });

      console.log(`🔹 Status: ${response.status} ${response.statusText}`);
      console.log(`🔹 Headers:`, Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log(`🔹 Raw Response:`, responseText);
      
      if (response.ok) {
        try {
          const jsonData = JSON.parse(responseText);
          console.log(`✅ PARSED JSON:`, jsonData);
          
          setRawResults([{
            testType,
            success: true,
            status: response.status,
            data: jsonData,
            raw: responseText
          }]);
          
          toast({
            title: "✅ Direct Test Success",
            description: `${testType}: ${JSON.stringify(jsonData)}`,
            variant: "default"
          });
          
        } catch (parseError) {
          console.log(`⚠️ JSON Parse Error:`, parseError);
          setRawResults([{
            testType,
            success: false,
            status: response.status,
            error: 'Invalid JSON response',
            raw: responseText
          }]);
        }
      } else {
        console.log(`❌ HTTP Error: ${response.status}`);
        setRawResults([{
          testType,
          success: false,
          status: response.status,
          error: `HTTP ${response.status}: ${response.statusText}`,
          raw: responseText
        }]);
        
        toast({
          title: "❌ Direct Test Failed",
          description: `HTTP ${response.status}: ${response.statusText}`,
          variant: "destructive"
        });
      }
      
    } catch (networkError) {
      console.log(`🚨 Network Error:`, networkError);
      setRawResults([{
        testType,
        success: false,
        error: networkError.message,
        raw: 'Network error - no response'
      }]);
      
      toast({
        title: "🚨 Network Error",
        description: networkError.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Run all direct tests
  const runAllDirectTests = async () => {
    const testTypes = ['ping', 'circuit-breaker', 'cache', 'pool', 'alerts'];
    setRawResults([]);
    
    for (const testType of testTypes) {
      await runDirectTest(testType);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Remove unused functions since we now use simple JSON responses
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>P0 Stability Validation Tests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <Button 
              onClick={() => runTests('ping')} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Zap className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Ping Test</div>
                <div className="text-xs text-muted-foreground">Basic connectivity</div>
              </div>
            </Button>

            <Button 
              onClick={() => runTests('circuit-breaker')} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Zap className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Circuit Breaker</div>
                <div className="text-xs text-muted-foreground">1.5s timeout limit</div>
              </div>
            </Button>

            <Button 
              onClick={() => runTests('cache')} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Database className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Cache Test</div>
                <div className="text-xs text-muted-foreground">MISS → HIT</div>
              </div>
            </Button>

            <Button 
              onClick={() => runTests('pool')} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <BarChart3 className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Pool Test</div>
                <div className="text-xs text-muted-foreground">500 connections</div>
              </div>
            </Button>

            <Button 
              onClick={() => runTests('alerts')} 
              disabled={isRunning}
              className="flex items-center space-x-2 h-auto p-4"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="font-semibold">Alert Test</div>
                <div className="text-xs text-white/70">Threshold check</div>
              </div>
            </Button>
          </div>

          {/* DIRECT EDGE FUNCTION TESTING - PROOF SECTION */}
          <Card className="mb-4 border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <Terminal className="h-5 w-5" />
                <span>🧪 Direct Edge Function Proof Testing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-orange-700 mb-4">
                  <strong>Raw JSON Proof:</strong> Direct fetch() calls to Edge Function bypassing Supabase client.
                  All outputs logged to browser console with timestamps.
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => runDirectTest('ping')} 
                    disabled={isRunning}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Direct Ping
                  </Button>
                  
                  <Button 
                    onClick={() => runDirectTest('circuit-breaker')} 
                    disabled={isRunning}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Direct Circuit Breaker
                  </Button>
                  
                  <Button 
                    onClick={() => runDirectTest('cache')} 
                    disabled={isRunning}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Direct Cache
                  </Button>
                  
                  <Button 
                    onClick={() => runDirectTest('pool')} 
                    disabled={isRunning}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Direct Pool
                  </Button>
                  
                  <Button 
                    onClick={() => runDirectTest('alerts')} 
                    disabled={isRunning}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Direct Alerts
                  </Button>
                  
                  <Button 
                    onClick={runAllDirectTests} 
                    disabled={isRunning}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    Run All Direct Tests
                  </Button>
                </div>
                
                <div className="text-xs text-orange-600 p-2 bg-orange-100 rounded">
                  <strong>Console Logging:</strong> Open browser DevTools → Console to see real-time raw JSON responses
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RAW RESULTS DISPLAY */}
          {rawResults.length > 0 && (
            <Card className="mb-4 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">🔍 Raw Edge Function Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rawResults.map((result, index) => (
                    <div key={index} className="p-4 bg-white border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{result.testType}</span>
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                          </Badge>
                          {result.status && (
                            <Badge variant="outline">HTTP {result.status}</Badge>
                          )}
                        </div>
                      </div>
                      
                      {result.success && result.data && (
                        <div className="mb-3">
                          <div className="text-sm font-medium text-green-800 mb-1">✅ Raw JSON Response:</div>
                          <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto font-mono">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {!result.success && (
                        <div className="mb-3">
                          <div className="text-sm font-medium text-red-700 mb-1">❌ Error Details:</div>
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">
                            {result.error}
                          </div>
                        </div>
                      )}
                      
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                          View Raw Response Body
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                          {result.raw}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentTest && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{currentTest}</span>
            </div>
          )}

          {results.length > 0 && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {results.map((result, index) => {
                    const status = result.result || result.status;
                    const isSuccess = status === 'PASS' || status === 'ok';
                    
                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{result.test} Test</span>
                            <Badge variant={isSuccess ? 'default' : 'destructive'}>
                              {status}
                            </Badge>
                          </div>
                          <div className="text-right text-sm">
                            {result.latencyMs && <div>{result.latencyMs}ms</div>}
                            {result.breakerState && <div>State: {result.breakerState}</div>}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm space-y-1">
                          {result.cache && <div>Cache: <span className="font-mono">{result.cache}</span></div>}
                          {result.connectionsSimulated && (
                            <div>Connections: {result.connectionsSimulated}, Errors: {result.errors}</div>
                          )}
                          {result.triggered && result.triggered.length > 0 && (
                            <div>Alerts: {result.triggered.join(', ')}</div>
                          )}
                          {result.reason && (
                            <div className="text-red-600">Reason: {result.reason}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Real P0 stability validation with actual database tests:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Ping:</strong> Basic connectivity test</li>
              <li><strong>Circuit Breaker:</strong> 1.5s timeout with failure protection</li>
              <li><strong>Cache:</strong> MISS → HIT simulation</li>
              <li><strong>Pool:</strong> 500 connection simulation</li>
              <li><strong>Alerts:</strong> Threshold monitoring (pool&gt;80%, errorRate&gt;1%)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => {
                const status = result.result || result.status;
                const isSuccess = status === 'PASS' || status === 'ok';
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{result.test} Test</span>
                        <Badge variant={isSuccess ? 'default' : 'destructive'}>
                          {status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <details>
                          <summary className="cursor-pointer hover:text-foreground">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(result, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        {result.latencyMs ? `${result.latencyMs}ms` : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Infrastructure Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p><strong>PgBouncer:</strong> Requires server-level configuration. Tests validate connection pooling logic.</p>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <p><strong>Circuit Breakers:</strong> Implemented with 500ms timeout, 3-failure threshold, 30s recovery.</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p><strong>Caching:</strong> In-memory L2 cache with TTL (production would use Redis/Upstash).</p>
            </div>
            <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
              <p><strong>Alerts:</strong> Console/session storage (production would integrate Slack/email).</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}