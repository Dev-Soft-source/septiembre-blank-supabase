
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Images, AlertCircle, CheckCircle } from 'lucide-react';

export function BatchImagePopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState<{
    processed: number;
    total: number;
    current?: string;
  }>({ processed: 0, total: 0 });
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleBatchPopulation = async () => {
    setIsPopulating(true);
    setProgress({ processed: 0, total: 0 });
    setResults(null);

    try {
      toast({
        title: "Starting Batch Image Population",
        description: "This may take several minutes. Please don't close this page.",
      });

      const { data, error } = await supabase.functions.invoke('batch-populate-all-hotel-images', {
        body: {}
      });

      if (error) throw error;

      setResults(data);
      
      toast({
        title: "Batch Population Complete",
        description: `Successfully processed ${data.successCount} hotels. ${data.failureCount} failures.`,
      });

    } catch (error: any) {
      console.error('Error in batch population:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to populate hotel images",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      toast({
        title: "Cleaning up duplicates",
        description: "Removing duplicate images across hotels...",
      });

      const { data, error } = await supabase.functions.invoke('cleanup-duplicate-images', {
        body: {}
      });

      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: `Removed ${data.imagesRemoved || 0} duplicate images.`,
      });

    } catch (error: any) {
      console.error('Error in cleanup:', error);
      toast({
        title: "Cleanup Error",
        description: error.message || "Failed to cleanup duplicates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-purple-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Images className="w-5 h-5" />
            Hotel Image Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleBatchPopulation}
              disabled={isPopulating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isPopulating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Populating Images...
                </>
              ) : (
                <>
                  <Images className="w-4 h-4 mr-2" />
                  Populate All Hotel Images
                </>
              )}
            </Button>

            <Button
              onClick={handleCleanupDuplicates}
              variant="outline"
              className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Cleanup Duplicates
            </Button>
          </div>

          {isPopulating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Processing hotels...</span>
                <span>{progress.processed}/{progress.total}</span>
              </div>
              <Progress 
                value={progress.total > 0 ? (progress.processed / progress.total) * 100 : 0} 
                className="bg-purple-800/30"
              />
              {progress.current && (
                <p className="text-sm text-purple-300">
                  Currently processing: {progress.current}
                </p>
              )}
            </div>
          )}

          {results && (
            <div className="bg-purple-800/30 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Population Results
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-purple-300">Processed</div>
                  <div className="text-white font-semibold">{results.processed}</div>
                </div>
                <div>
                  <div className="text-purple-300">Successful</div>
                  <div className="text-green-400 font-semibold">{results.successCount}</div>
                </div>
                <div>
                  <div className="text-purple-300">Failed</div>
                  <div className="text-red-400 font-semibold">{results.failureCount}</div>
                </div>
                <div>
                  <div className="text-purple-300">Total Images</div>
                  <div className="text-white font-semibold">{results.finalStats?.totalImages || 0}</div>
                </div>
              </div>
              <div className="text-sm text-purple-200">
                {results.finalStats?.hotelsWithImages}/{results.finalStats?.totalHotels} hotels now have images
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
