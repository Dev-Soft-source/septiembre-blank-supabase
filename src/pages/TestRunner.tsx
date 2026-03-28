import React, { useState, useEffect } from 'react';
import { runCompleteFilterTestSuite, runQuickFilterValidation } from '@/tests/filters';

interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  beforeCount: number;
  afterCount: number;
  executionTime: number;
}

interface CompleteResults {
  mainTests: TestResult[];
  languageTests: any[];
  integrationTests: any[];
  summary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    successRate: number;
    totalExecutionTime: number;
  };
}

export function TestRunner() {
  const [results, setResults] = useState<CompleteResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [quickValidation, setQuickValidation] = useState<boolean | null>(null);

  // Override console.log to capture test output
  const originalLog = console.log;
  const captureLog = (message: string) => {
    setLogs(prev => [...prev, message]);
    originalLog(message);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    setLogs([]);
    setResults(null);
    setQuickValidation(null);

    // Temporarily override console.log
    console.log = captureLog;

    try {
      // First run quick validation
      captureLog('🚀 Starting Quick Validation...');
      const quickResult = await runQuickFilterValidation();
      setQuickValidation(quickResult);
      
      if (!quickResult) {
        captureLog('❌ Quick validation failed - stopping test execution');
        return;
      }

      // Run complete test suite
      captureLog('🚀 Starting Complete Test Suite...');
      const testResults = await runCompleteFilterTestSuite();
      setResults(testResults);
      
      captureLog('✅ All tests completed successfully!');
      
    } catch (error) {
      captureLog(`❌ Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Restore original console.log
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Search Filters Test Suite Results
          </h1>
          <p className="text-xl text-purple-200">
            Comprehensive testing of all filter components against hotels_public_view
          </p>
        </div>

        {/* Quick Validation Status */}
        {quickValidation !== null && (
          <div className={`mb-6 p-4 rounded-lg ${quickValidation ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
            <h3 className="text-lg font-semibold text-white mb-2">
              ⚡ Quick Validation: {quickValidation ? 'PASSED' : 'FAILED'}
            </h3>
            <p className="text-sm text-gray-300">
              {quickValidation 
                ? 'Basic filter functionality verified - proceeding with full test suite'
                : 'Basic validation failed - check database connectivity and permissions'
              }
            </p>
          </div>
        )}

        {/* Test Progress */}
        {isRunning && (
          <div className="mb-6 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white font-semibold">Running comprehensive test suite...</span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">{results.summary.totalTests}</div>
              <div className="text-purple-200">Total Tests</div>
            </div>
            <div className="bg-green-900/30 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400">{results.summary.totalPassed}</div>
              <div className="text-purple-200">Passed</div>
            </div>
            <div className="bg-red-900/30 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-400">{results.summary.totalFailed}</div>
              <div className="text-purple-200">Failed</div>
            </div>
            <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">{results.summary.successRate.toFixed(1)}%</div>
              <div className="text-purple-200">Success Rate</div>
            </div>
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400">{results.summary.totalExecutionTime}ms</div>
              <div className="text-purple-200">Total Time</div>
            </div>
          </div>
        )}

        {/* Detailed Results Tabs */}
        {results && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Detailed Test Results</h2>
            
            {/* Main Filter Tests */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                🔍 Main Filter Tests ({results.mainTests.length} tests)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-purple-900/50">
                    <tr>
                      <th className="px-4 py-3 text-purple-200">Test Name</th>
                      <th className="px-4 py-3 text-purple-200">Status</th>
                      <th className="px-4 py-3 text-purple-200">Before</th>
                      <th className="px-4 py-3 text-purple-200">After</th>
                      <th className="px-4 py-3 text-purple-200">Time</th>
                      <th className="px-4 py-3 text-purple-200">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.mainTests.map((test, index) => (
                      <tr key={index} className={`border-b border-purple-800/30 ${test.passed ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                        <td className="px-4 py-3 text-white font-medium">{test.testName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            test.passed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {test.passed ? '✅ PASS' : '❌ FAIL'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-purple-200">{test.beforeCount}</td>
                        <td className="px-4 py-3 text-purple-200">{test.afterCount}</td>
                        <td className="px-4 py-3 text-purple-200">{test.executionTime}ms</td>
                        <td className="px-4 py-3 text-purple-200 max-w-md truncate">{test.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Language Tests */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                🌍 Language Tests ({results.languageTests.length} tests)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['en', 'es', 'pt', 'ro'].map(lang => {
                  const langTests = results.languageTests.filter(t => t.language === lang);
                  const passed = langTests.filter(t => t.passed).length;
                  const total = langTests.length;
                  
                  return (
                    <div key={lang} className="bg-purple-900/30 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{lang.toUpperCase()}</div>
                        <div className="text-purple-200">{passed}/{total}</div>
                        <div className="text-sm text-purple-300">
                          {total > 0 ? `${(passed/total*100).toFixed(1)}%` : '0%'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Integration Tests */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                🔧 Integration Tests ({results.integrationTests.length} tests)
              </h3>
              <div className="space-y-2">
                {results.integrationTests.map((test, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    test.passed ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{test.testName}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        test.passed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {test.componentType}
                      </span>
                    </div>
                    <div className="text-sm text-purple-200 mt-1">{test.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Console Logs */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">📝 Test Execution Log</h2>
          <div className="bg-black/70 rounded p-4 max-h-96 overflow-y-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {logs.join('\n')}
            </pre>
          </div>
        </div>

        {/* Raw Results JSON */}
        {results && (
          <div className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">📋 Raw Results (JSON)</h2>
            <pre className="bg-black/70 rounded p-4 text-green-400 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold rounded-lg transition-colors"
          >
            {isRunning ? 'Running Tests...' : '🔄 Run Tests Again'}
          </button>
        </div>
      </div>
    </div>
  );
}