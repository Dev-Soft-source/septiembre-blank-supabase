import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { importAvailabilityPackagesFromStorage } from '@/utils/importHotelData';

export function TestAvailabilityImport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await importAvailabilityPackagesFromStorage();
      setData(result);
      console.log('Retrieved data:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Import error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <h2 className="text-lg font-semibold mb-4">Test Availability Packages Import</h2>
      <Button onClick={handleImport} disabled={loading}>
        {loading ? 'Loading...' : 'Import Availability Packages'}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {data && (
        <div className="mt-4">
          <h3 className="font-semibold">Retrieved Data:</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}