import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw, DollarSign, Hotel, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

interface CorrectionResult {
  hotelId: string;
  hotelName: string;
  correctedPackages: number;
  errors: string[];
  warnings: string[];
}

interface CorrectionSummary {
  hotelsProcessed: number;
  packagesChecked: number;
  packagesCorrected: number;
}

export default function FernandoPriceCorrector() {
  const { t } = useTranslationWithFallback('admin');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CorrectionResult[]>([]);
  const [summary, setSummary] = useState<CorrectionSummary | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runGlobalCorrector = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    try {
      toast.info('🚀 Starting Global Price Corrector...', {
        description: 'This may take a few minutes to process all hotels.',
      });

      const response = await fetch('https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/global-price-corrector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run price corrector');
      }

      if (data.success) {
        setResults(data.results || []);
        setSummary(data.summary);
        setLastRun(new Date().toLocaleString());
        
        toast.success(t('priceCorrector.success'), {
          description: t('priceCorrector.successDescription', { 
            count: data.summary.packagesCorrected, 
            hotels: data.summary.hotelsProcessed 
          }),
        });
      } else {
        throw new Error(data.error || 'Price correction failed');
      }
    } catch (error) {
      console.error('Price corrector error:', error);
      toast.error(t('priceCorrector.failed'), {
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('priceCorrector.title')}</h1>
          <p className="text-white/80 mt-2">
            {t('priceCorrector.description')}
          </p>
        </div>
        
        <Button
          onClick={runGlobalCorrector}
          disabled={isRunning}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              {t('priceCorrector.running')}
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5 mr-2" />
              {t('priceCorrector.runButton')}
            </>
          )}
        </Button>
      </div>

      {/* Sacred Pricing Table Info */}
      <Card className="bg-white/10 border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          {t('priceCorrector.rules.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
          <div>
            <h3 className="font-medium mb-2">{t('priceCorrector.rules.mealPlans')}</h3>
            <ul className="space-y-1 text-sm">
              <li>• {t('priceCorrector.rules.accommodationOnly')}</li>
              <li>• {t('priceCorrector.rules.breakfast')}</li>
              <li>• {t('priceCorrector.rules.halfBoard')}</li>
              <li>• {t('priceCorrector.rules.fullBoard')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">{t('priceCorrector.rules.priceEndings')}</h3>
            <ul className="space-y-1 text-sm">
              <li>• {t('priceCorrector.rules.endingsRule')}</li>
              <li>• {t('priceCorrector.rules.categoryBased')}</li>
              <li>• {t('priceCorrector.rules.durations')}</li>
              <li>• {t('priceCorrector.rules.occupancy')}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-500/20 border-blue-500/50 p-4">
            <div className="flex items-center">
              <Hotel className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-blue-200 text-sm">{t('priceCorrector.stats.hotelsProcessed')}</p>
                <p className="text-white text-2xl font-bold">{summary.hotelsProcessed}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-yellow-500/20 border-yellow-500/50 p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-yellow-200 text-sm">{t('priceCorrector.stats.packagesChecked')}</p>
                <p className="text-white text-2xl font-bold">{summary.packagesChecked}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-green-500/20 border-green-500/50 p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-green-200 text-sm">{t('priceCorrector.stats.packagesCorrected')}</p>
                <p className="text-white text-2xl font-bold">{summary.packagesCorrected}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {lastRun && (
        <div className="text-white/60 text-sm">
          {t('priceCorrector.lastRun', { date: lastRun })}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{t('priceCorrector.results.title')}</h2>
          
          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={result.hotelId} className="bg-white/10 border-white/20 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{result.hotelName}</h3>
                    <p className="text-white/70 text-sm">Hotel ID: {result.hotelId}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result.correctedPackages > 0 && (
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                        {result.correctedPackages} {t('priceCorrector.results.corrected')}
                      </span>
                    )}
                    {result.errors.length > 0 && (
                      <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                        {result.errors.length} {t('priceCorrector.results.errors')}
                      </span>
                    )}
                  </div>
                </div>

                {result.warnings.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-white/90 font-medium mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                      {t('priceCorrector.results.correctionsApplied')}
                    </h4>
                    <ul className="space-y-1">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx} className="text-white/70 text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div>
                    <h4 className="text-white/90 font-medium mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-red-400" />
                      {t('priceCorrector.results.errorsFound')}
                    </h4>
                    <ul className="space-y-1">
                      {result.errors.map((error, idx) => (
                        <li key={idx} className="text-red-300 text-sm">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}