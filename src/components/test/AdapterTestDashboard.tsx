/**
 * Adapter Test Dashboard
 * Interactive component to run and monitor adapter tests in production
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, XCircle, PlayCircle, Clock } from 'lucide-react';
import { runAdapterFinalizationTests } from '@/test/adapter-finalization-tests';
import { runBackendConnectionTests } from '@/test/backend-connection-test';

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  resultsCount?: number;
  error?: any;
  details?: any;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  avgDuration: number;
  isReady: boolean;
}

export const AdapterTestDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [connectionResults, setConnectionResults] = useState<any>(null);
  const [finalizationResults, setFinalizationResults] = useState<any>(null);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentTest('Initializing...');

    try {
      // Phase 1: Backend Connection Tests
      setCurrentTest('Running Backend Connection Tests...');
      setProgress(20);
      const connectionResults = await runBackendConnectionTests();
      setConnectionResults(connectionResults);

      // Phase 2: Adapter Finalization Tests
      setCurrentTest('Running Adapter Finalization Tests...');
      setProgress(60);
      const finalizationResults = await runAdapterFinalizationTests();
      setFinalizationResults(finalizationResults);

      // Calculate overall summary
      setCurrentTest('Calculating Results...');
      setProgress(90);
      
      const connectionTests = [
        connectionResults.basicQuery,
        connectionResults.hotelDetail,
        ...connectionResults.filterQueries
      ];
      
      const connectionPassed = connectionTests.filter(t => t.success).length;
      const connectionTotal = connectionTests.length;
      
      const totalPassed = connectionPassed + finalizationResults.summary.passed;
      const totalTests = connectionTotal + finalizationResults.summary.total;
      const successRate = (totalPassed / totalTests) * 100;
      
      setSummary({
        total: totalTests,
        passed: totalPassed,
        failed: totalTests - totalPassed,
        avgDuration: finalizationResults.summary.avgDuration,
        isReady: successRate >= 95
      });

      setProgress(100);
      setCurrentTest('Tests Complete!');

    } catch (error) {
      console.error('Test execution error:', error);
      setCurrentTest('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const renderTestResult = (result: TestResult, index: number) => (
    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {result.success ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <div>
          <div className="font-medium">{result.testName}</div>
          {result.resultsCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              Found {result.resultsCount} results
            </div>
          )}
          {result.error && (
            <div className="text-sm text-red-500">
              {result.error.message || String(result.error)}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={result.success ? "default" : "destructive"}>
          {result.duration.toFixed(0)}ms
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Adapter Test Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive testing suite for the optimized query adapter
        </p>
        
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          size="lg"
          className="w-full max-w-md"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 mr-2" />
              Run All Tests
            </>
          )}
        </Button>
      </div>

      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Test Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">{currentTest}</div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Overall Results
              <Badge variant={summary.isReady ? "default" : "destructive"}>
                {summary.isReady ? "READY" : "NEEDS WORK"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Adapter performance and compatibility assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.avgDuration.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">Avg Duration</div>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress 
                value={(summary.passed / summary.total) * 100} 
                className="w-full" 
              />
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {((summary.passed / summary.total) * 100).toFixed(1)}% Success Rate
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {finalizationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Finalization Test Results</CardTitle>
            <CardDescription>
              Filter testing, type safety, performance verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finalizationResults.results.map((result: TestResult, index: number) =>
                renderTestResult(result, index)
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {connectionResults && (
        <Card>
          <CardHeader>
            <CardTitle>Backend Connection Results</CardTitle>
            <CardDescription>
              Basic connectivity and compatibility tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {renderTestResult(connectionResults.basicQuery, 0)}
              {renderTestResult(connectionResults.hotelDetail, 1)}
              {connectionResults.filterQueries.map((result: TestResult, index: number) =>
                renderTestResult(result, index + 2)
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div><strong>Filter Tests:</strong> Validates all hotel filtering functionality</div>
          <div><strong>Type Safety:</strong> Ensures TypeScript compatibility and type correctness</div>
          <div><strong>Performance:</strong> Measures query execution times and concurrent load</div>
          <div><strong>Backend View:</strong> Confirms proper use of existing database views</div>
          <div><strong>Detail Queries:</strong> Tests individual hotel data retrieval</div>
        </CardContent>
      </Card>
    </div>
  );
};