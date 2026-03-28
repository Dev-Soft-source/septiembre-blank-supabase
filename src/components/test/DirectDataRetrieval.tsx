import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export function DirectDataRetrieval() {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDirectCall = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Making direct call to import-hotel-data function...');
      
      const { data: result, error: fnError } = await supabase.functions.invoke('import-hotel-data', {
        body: {}
      });

      if (fnError) {
        console.error('Function error:', fnError);
        setError(fnError.message);
        return;
      }

      console.log('Function result:', result);
      
      if (result?.sqlContent) {
        setData(result.sqlContent);
        console.log('=== AVAILABILITY PACKAGES DATA ===');
        console.log(result.sqlContent);
        console.log('=== END DATA ===');
      } else {
        setError('No SQL content found in response');
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <h2 className="text-lg font-semibold mb-4">Direct Data Retrieval</h2>
      <Button onClick={handleDirectCall} disabled={loading}>
        {loading ? 'Loading...' : 'Get Availability Data'}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {data && (
        <div className="mt-4">
          <h3 className="font-semibold">SQL Data:</h3>
          <textarea 
            className="w-full h-96 p-4 border rounded mt-2 font-mono text-sm"
            value={data}
            readOnly
          />
        </div>
      )}
    </Card>
  );
}