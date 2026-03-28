import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export function TestOpenAI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testOpenAI = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-openai-key');
      
      if (error) {
        setResult({ error: error.message, type: 'supabase_error' });
      } else {
        setResult({ ...data, type: 'success' });
      }
    } catch (err) {
      setResult({ error: err.message, type: 'network_error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">OpenAI API Key Test</h3>
      
      <Button onClick={testOpenAI} disabled={loading} className="mb-4">
        {loading ? 'Testing...' : 'Test OpenAI API Key'}
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-muted rounded">
          <h4 className="font-medium mb-2">Result:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.type === 'success' && result.working && (
            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              ✅ OpenAI API is working correctly!
            </div>
          )}
          
          {result.error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
              ❌ {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}