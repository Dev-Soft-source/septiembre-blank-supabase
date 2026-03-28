import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { Loader2, CheckCircle, AlertCircle, Package } from 'lucide-react';

interface PackageCreationResult {
  hotelId: string;
  hotelName: string;
  packagesCreated: number;
  errors: string[];
}

interface CreationSummary {
  hotelsProcessed: number;
  packagesCreated: number;
  hotelsSkipped: number;
}

export const FernandoPackageCreator: React.FC = () => {
  const { t } = useTranslationWithFallback('admin');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PackageCreationResult[] | null>(null);
  const [summary, setSummary] = useState<CreationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runPackageCreator = async () => {
    setIsRunning(true);
    setResults(null);
    setSummary(null);
    setError(null);

    try {
      console.log('🚀 Starting Package Creator...');
      
      const { data, error: functionError } = await supabase.functions.invoke('create-missing-packages');

      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Package creation failed');
      }

      console.log('✅ Package creation completed:', data);
      setResults(data.results || []);
      setSummary(data.summary || null);
      
    } catch (err) {
      console.error('❌ Package Creator Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (packagesCreated: number, errors: string[]) => {
    if (errors.length > 0) return 'destructive';
    if (packagesCreated > 0) return 'default';
    return 'secondary';
  };

  const getStatusIcon = (packagesCreated: number, errors: string[]) => {
    if (errors.length > 0) return <AlertCircle className="h-4 w-4" />;
    if (packagesCreated > 0) return <CheckCircle className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t('packageCreator.title', 'Missing Package Creator')}
          </CardTitle>
          <CardDescription>
            {t('packageCreator.description', 'Create missing availability packages for hotels that have none in the database')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runPackageCreator} 
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('packageCreator.running', 'Creating Missing Packages...')}
              </>
            ) : (
              t('packageCreator.runButton', 'Create Missing Packages')
            )}
          </Button>

          {/* Summary */}
          {summary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.hotelsProcessed}</div>
                <div className="text-sm text-blue-600">{t('packageCreator.hotelsProcessed', 'Hotels Processed')}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.packagesCreated}</div>
                <div className="text-sm text-green-600">{t('packageCreator.packagesCreated', 'Packages Created')}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{summary.hotelsSkipped}</div>
                <div className="text-sm text-gray-600">{t('packageCreator.hotelsSkipped', 'Hotels Skipped')}</div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-semibold">{t('packageCreator.error', 'Error')}</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {results && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t('packageCreator.results', 'Creation Results')}
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <div key={result.hotelId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{result.hotelName}</div>
                      <div className="text-sm text-gray-600">
                        {t('packageCreator.packagesCreated', 'Packages Created')}: {result.packagesCreated}
                      </div>
                      {result.errors.length > 0 && (
                        <div className="text-sm text-red-600">
                          {t('packageCreator.errors', 'Errors')}: {result.errors.length}
                        </div>
                      )}
                    </div>
                    <Badge variant={getStatusColor(result.packagesCreated, result.errors)}>
                      {getStatusIcon(result.packagesCreated, result.errors)}
                      {result.packagesCreated > 0 ? t('packageCreator.success', 'Success') : 
                       result.errors.length > 0 ? t('packageCreator.failed', 'Failed') : 
                       t('packageCreator.skipped', 'Skipped')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};