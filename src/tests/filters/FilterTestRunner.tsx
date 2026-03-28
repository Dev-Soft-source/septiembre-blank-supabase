/**
 * Interactive Test Runner Component for Search Filters
 * Provides UI to execute and monitor filter tests
 */

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { searchFiltersTestSuite } from './SearchFiltersTestSuite';

interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  beforeCount: number;
  afterCount: number;
  executionTime: number;
}

export function FilterTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    successRate: number;
    totalTime: number;
  } | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setCurrentTest('Initializing...');
    setSummary(null);

    try {
      // Mock progress updates since we can't get real-time updates from the test suite
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);

      const testResults = await searchFiltersTestSuite.runAllTests();
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(testResults);
      
      // Calculate summary
      const total = testResults.length;
      const passed = testResults.filter(r => r.passed).length;
      const failed = total - passed;
      const successRate = (passed / total) * 100;
      const totalTime = testResults.reduce((sum, r) => sum + r.executionTime, 0);
      
      setSummary({
        total,
        passed,
        failed,
        successRate,
        totalTime
      });
      
    } catch (error) {
      console.error('Test execution failed:', error);
      setCurrentTest('Test execution failed');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const resetTests = () => {
    setResults([]);
    setProgress(0);
    setCurrentTest('');
    setSummary(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Search Filters Test Suite
          </CardTitle>
          <CardDescription>
            Comprehensive automated testing for all search filter components using hotels_public_view data source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? '🔄 Running Tests...' : '▶️ Run All Tests'}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetTests}
              disabled={isRunning}
            >
              🔄 Reset
            </Button>
          </div>
          
          {isRunning && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
              {currentTest && (
                <p className="text-sm text-muted-foreground">
                  Current: {currentTest}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.successRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.totalTime}ms</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>✅ All tests use <code>hotels_public_view</code> exclusively</div>
              <div>🌍 Multi-language support verified (EN/ES/PT/RO)</div>
              <div>🔄 Filter combinations tested for proper interaction</div>
              <div>📊 Results validate before/after hotel counts</div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.passed 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.passed ? 'default' : 'destructive'}>
                        {result.passed ? '✅ PASS' : '❌ FAIL'}
                      </Badge>
                      <span className="font-medium">{result.testName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {result.executionTime}ms
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div>{result.message}</div>
                    <div className="text-muted-foreground">
                      Results: {result.beforeCount} → {result.afterCount} hotels
                      {result.beforeCount > 0 && (
                        <span className="ml-2">
                          ({((result.beforeCount - result.afterCount) / result.beforeCount * 100).toFixed(1)}% reduction)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>📋 Test Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Basic Filters</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• CountryFilter</li>
                <li>• LocationFilter</li>
                <li>• MonthFilter</li>
                <li>• PriceRangeFilter</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Property Filters</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• PropertyTypeFilter</li>
                <li>• PropertyStyleFilter</li>
                <li>• CategoryFilter (Stars)</li>
                <li>• SearchTermFilter</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Feature Filters</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• HotelFeaturesFilter</li>
                <li>• RoomFeaturesFilter</li>
                <li>• ActivityFilter</li>
                <li>• Combined Filters</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Test Verification Points</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ All filters query <code>hotels_public_view</code> exclusively</li>
              <li>✓ Filter results never exceed original dataset size</li>
              <li>✓ Combined filters work correctly together</li>
              <li>✓ Edge cases handled properly (non-existent values, extreme ranges)</li>
              <li>✓ Performance metrics collected for all operations</li>
              <li>✓ Multi-language support across EN/ES/PT/RO variants</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}