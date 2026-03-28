import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  test: string;
  avatarId: string;
  success: boolean;
  error?: string;
  [key: string]: any;
}

interface TestResponse {
  success: boolean;
  results?: TestResult[];
  totalTests?: number;
  summary?: {
    avatarsTested: number;
    testsPerAvatar: number;
    totalTests: number;
  };
  error?: string;
}

export const AvatarIsolationTests: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    try {
      console.log('Starting isolation tests for all avatars...');
      
      const { data, error } = await supabase.functions.invoke('avatar-isolation-tests', {
        body: {
          action: 'run_all_tests'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const response = data as TestResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Tests failed');
      }

      console.log('All tests completed:', response);
      setResults(response.results || []);
      setSummary(response.summary);
      
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getTestResultsByType = (testType: string) => {
    return results.filter(r => r.test.includes(testType));
  };

  const getAvatarResults = (avatarId: string) => {
    return results.filter(r => r.avatarId === avatarId);
  };

  const avatars = ['antonio', 'luisa', 'teresa', 'john', 'maria', 'ion', 'juan', 'martin'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar Isolation Tests</CardTitle>
          <CardDescription>
            Run systematic tests to identify the source of nonsense speech problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Tests...' : 'Run All Isolation Tests'}
            </Button>
            
            {summary && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Test Summary</h3>
                <p>Avatars Tested: {summary.avatarsTested}</p>
                <p>Tests Per Avatar: {summary.testsPerAvatar}</p>
                <p>Total Tests: {summary.totalTests}</p>
                <p>Results Collected: {results.length}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-6">
          {/* Test 1 Results - Model Isolation */}
          <Card>
            <CardHeader>
              <CardTitle>Test 1: Model Isolation Results</CardTitle>
              <CardDescription>Raw ChatGPT output without TTS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getTestResultsByType('Model Isolation').map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{result.avatarId}</h4>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    {result.success ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>Generated Text:</strong> "{result.generatedText}"</p>
                        <p><strong>Word Count:</strong> {result.wordCount}</p>
                        <p><strong>Is Coherent:</strong> {result.isCoherent ? "Yes" : "No"}</p>
                        <p><strong>Within 40 words:</strong> {result.isWithinLimit ? "Yes" : "No"}</p>
                      </div>
                    ) : (
                      <p className="text-red-600">Error: {result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test 2 Results - TTS Isolation */}
          <Card>
            <CardHeader>
              <CardTitle>Test 2: TTS Isolation Results</CardTitle>
              <CardDescription>Known good text sent directly to Google Cloud TTS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getTestResultsByType('TTS Isolation').map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{result.avatarId}</h4>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    {result.success ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>Input Text:</strong> "{result.inputText}"</p>
                        <p><strong>Voice Used:</strong> {result.voiceUsed}</p>
                        <p><strong>Has Audio:</strong> {result.hasAudioContent ? "Yes" : "No"}</p>
                        <p><strong>Audio Length:</strong> {result.audioContentLength} characters</p>
                      </div>
                    ) : (
                      <p className="text-red-600">Error: {result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test 3 Results - Full Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Test 3: Full Pipeline Results</CardTitle>
              <CardDescription>Complete flow comparison with Test 1</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getTestResultsByType('Full Pipeline').map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{result.avatarId}</h4>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    {result.success ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>Model Output:</strong> "{result.modelOutput}"</p>
                        <p><strong>TTS Input:</strong> "{result.ttsInput}"</p>
                        <p><strong>Text Corruption:</strong> {result.textCorruption}</p>
                        <p><strong>Outputs Identical:</strong> {result.comparison?.identical ? "Yes" : "No"}</p>
                        <p><strong>Has Audio:</strong> {result.hasAudioOutput ? "Yes" : "No"}</p>
                      </div>
                    ) : (
                      <p className="text-red-600">Error: {result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avatar Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar Summary</CardTitle>
              <CardDescription>Test results by avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {avatars.map(avatarId => {
                  const avatarResults = getAvatarResults(avatarId);
                  const successCount = avatarResults.filter(r => r.success).length;
                  const totalCount = avatarResults.length;
                  
                  return (
                    <div key={avatarId} className="flex items-center justify-between p-3 border rounded-lg">
                      <h4 className="font-semibold capitalize">{avatarId}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{successCount}/{totalCount} tests passed</span>
                        <Badge variant={successCount === totalCount ? "default" : successCount > 0 ? "secondary" : "destructive"}>
                          {successCount === totalCount ? "All Passed" : successCount > 0 ? "Partial" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};