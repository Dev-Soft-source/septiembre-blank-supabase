import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export function SqlFileReader() {
  const [sqlContents, setSqlContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sqlFiles = [
    'hotels_rows.sql',
    'hotel_images_rows.sql',
    'hotel_themes_rows.sql', 
    'hotel_activities_rows.sql',
    'hotel_translations_rows.sql',
    'availability_packages_rows.sql'
  ];

  const readAllSqlFiles = async () => {
    setLoading(true);
    setError(null);
    const contents: Record<string, string> = {};

    try {
      for (const fileName of sqlFiles) {
        console.log(`Reading ${fileName}...`);
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('Hotel-Data')
          .download(fileName);

        if (fileError) {
          console.error(`Error reading ${fileName}:`, fileError);
          continue;
        }

        const sqlContent = await fileData.text();
        contents[fileName] = sqlContent;
        console.log(`=== ${fileName.toUpperCase()} ===`);
        console.log(sqlContent);
        console.log(`=== END ${fileName.toUpperCase()} ===\n`);
      }

      setSqlContents(contents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <h2 className="text-xl font-bold mb-4">SQL File Reader</h2>
      <Button onClick={readAllSqlFiles} disabled={loading}>
        {loading ? 'Reading Files...' : 'Read All SQL Files'}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {Object.keys(sqlContents).length > 0 && (
        <div className="mt-6 space-y-4">
          {Object.entries(sqlContents).map(([fileName, content]) => (
            <div key={fileName} className="border rounded p-4">
              <h3 className="font-semibold text-lg mb-2">{fileName}</h3>
              <textarea 
                className="w-full h-64 p-2 font-mono text-sm border rounded resize-none"
                value={content}
                readOnly
              />
              <div className="mt-2 text-sm text-gray-600">
                Characters: {content.length}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}