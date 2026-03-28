import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertCircle, Clock, Play, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  testSuite: string;
  testCase: string;
  status: 'PASS' | 'FAIL' | 'SKIP' | 'ERROR';
  details: Record<string, any>;
  executionTimeMs: number;
}

interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  errors: number;
  tests: TestResult[];
  executionTimeMs: number;
}

interface TestSummary {
  sessionId: string;
  totalSuites: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalErrors: number;
  totalExecutionTimeMs: number;
  suites: TestSuiteResult[];
}

const IntegrityTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<TestSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuites, setSelectedSuites] = useState<string[]>(['all']);
  const { toast } = useToast();

  const testSuites = [
    { id: 'all', name: 'All Tests', description: 'Run complete integrity test suite' },
    { id: 'commissions', name: 'Commissions Flow', description: 'Validate commission tracking and audit' },
    { id: 'availability', name: 'Availability Packages', description: 'Test booking logic and pricing' },
    { id: 'groups', name: 'Group Management', description: 'User ↔ Group Leader communication' },
    { id: 'navigation', name: 'Cross-Panel Navigation', description: 'Inter-panel connections' },
    { id: 'roles', name: 'Role Integrity', description: 'Multi-role user validation' }
  ];

  const runIntegrityTests = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('run-integrity-tests', {
        body: {
          testSuites: selectedSuites,
          cleanup: true
        }
      });

      if (error) throw error;

      setTestResults(data);
      
      const summary = `${data.totalPassed}/${data.totalTests} tests passed`;
      if (data.totalFailed === 0 && data.totalErrors === 0) {
        toast({
          title: "✅ All Tests Passed",
          description: summary,
        });
      } else {
        toast({
          title: "⚠️ Test Issues Found",
          description: `${summary} - Check details below`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Test execution error:', error);
      toast({
        title: "❌ Test Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAIL': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'SKIP': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PASS: 'default',
      FAIL: 'destructive', 
      ERROR: 'destructive',
      SKIP: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const calculateSuccessRate = () => {
    if (!testResults) return 0;
    return Math.round((testResults.totalPassed / testResults.totalTests) * 100);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            System Integrity Test Runner
          </CardTitle>
          <CardDescription>
            Comprehensive business logic validation across all system components.
            Tests respect RLS policies and security boundaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Test Suite Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Test Suites:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {testSuites.map(suite => (
                  <label key={suite.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSuites.includes(suite.id)}
                      onChange={(e) => {
                        if (suite.id === 'all') {
                          setSelectedSuites(e.target.checked ? ['all'] : []);
                        } else {
                          const newSuites = e.target.checked
                            ? [...selectedSuites.filter(s => s !== 'all'), suite.id]
                            : selectedSuites.filter(s => s !== suite.id);
                          setSelectedSuites(newSuites);
                        }
                      }}
                      className="rounded"
                    />
                    <div>
                      <div className="text-sm font-medium">{suite.name}</div>
                      <div className="text-xs text-muted-foreground">{suite.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex gap-2">
              <Button 
                onClick={runIntegrityTests} 
                disabled={isRunning || selectedSuites.length === 0}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Tests
                  </>
                )}
              </Button>
              
              {testResults && (
                <Button variant="outline" onClick={() => setTestResults(null)}>
                  Clear Results
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Results</span>
              <Badge variant={calculateSuccessRate() === 100 ? 'default' : 'secondary'}>
                {calculateSuccessRate()}% Success Rate
              </Badge>
            </CardTitle>
            <div className="space-y-2">
              <Progress value={calculateSuccessRate()} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Session: {testResults.sessionId.slice(0, 8)}</span>
                <span>Execution Time: {testResults.totalExecutionTimeMs}ms</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.totalPassed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.totalFailed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-700">{testResults.totalErrors}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{testResults.totalSkipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
            </div>

            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {testResults.suites.map((suite, index) => (
                  <TabsTrigger key={index} value={index.toString()} className="text-xs">
                    {suite.suiteName}
                  </TabsTrigger>
                ))}
              </TabsList>

              {testResults.suites.map((suite, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{suite.suiteName}</span>
                        <div className="flex gap-2">
                          {getStatusBadge(suite.failed === 0 && suite.errors === 0 ? 'PASS' : 'FAIL')}
                          <Badge variant="outline">
                            {suite.passed}/{suite.totalTests}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {suite.tests.map((test, testIndex) => (
                          <div key={testIndex} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="font-medium">{test.testCase}</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                {getStatusBadge(test.status)}
                                <span className="text-xs text-muted-foreground">
                                  {test.executionTimeMs}ms
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-muted-foreground mb-2">
                              {test.details.message}
                            </div>

                            {/* Detailed Results */}
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800 mb-1">🔐 Security Notice</div>
              <div className="text-yellow-700">
                All tests respect existing RLS policies and role-based access control. 
                No sensitive data is exposed during testing. Test data is automatically cleaned up after execution.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrityTestRunner;