import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { createExcelFile } from '@/utils/lazyExcel';

interface ExportResult {
  success: boolean;
  filename: string;
  downloadUrl: string;
  storagePath: string;
  stats: {
    totalHotels: number;
    totalPackages: number;
    totalRecords: number;
    recordsPerHotel: number;
    durationsPerHotel: number;
    mealPlansPerDuration: number;
  };
  sampleRecord: any;
}

export const ExcelHotelGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const { toast } = useToast();

  const generateDataset = async () => {
    try {
      setIsGenerating(true);
      setExportResult(null);

      const { data, error } = await supabase.functions.invoke('export-hotel-dataset', {
        body: {}
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setExportResult(data);
        toast({
          title: "Dataset Generated Successfully",
          description: `Generated ${data.stats.totalRecords} records from ${data.stats.totalHotels} hotels. File saved to Supabase Storage.`,
        });
      } else {
        throw new Error(data.error || 'Export failed');
      }

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = () => {
    if (exportResult?.downloadUrl) {
      window.open(exportResult.downloadUrl, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" />
            Hotel Dataset Generator
          </CardTitle>
          <CardDescription>
            Generate and export a complete dataset of all 35 demo hotels with package information.
            The export includes all durations (8, 15, 22, 29 days) and meal plans for each hotel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={generateDataset} 
              disabled={isGenerating}
              className="flex items-center gap-2"
              size="lg"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating Dataset...' : 'Generate Complete Dataset'}
            </Button>
          </div>

          {exportResult && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Export Completed Successfully</CardTitle>
                <CardDescription>
                  Filename: <code className="bg-background px-2 py-1 rounded">{exportResult.filename}</code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Total Hotels</div>
                    <div className="text-2xl font-bold text-primary">{exportResult.stats.totalHotels}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Total Records</div>
                    <div className="text-2xl font-bold text-primary">{exportResult.stats.totalRecords}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Records per Hotel</div>
                    <div className="text-2xl font-bold text-primary">{exportResult.stats.recordsPerHotel}</div>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <div className="font-semibold mb-2">Dataset Structure:</div>
                  <ul className="text-sm space-y-1">
                    <li>• {exportResult.stats.durationsPerHotel} package durations per hotel (8, 15, 22, 29 days)</li>
                    <li>• {exportResult.stats.mealPlansPerDuration} meal plans per duration (Lodging Only, Breakfast, Half Board, Full Board)</li>
                    <li>• Prices for both double room and single room occupancy</li>
                    <li>• Real packages from database + Sacred pricing fallback</li>
                  </ul>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <div className="font-semibold mb-2">Sample Record:</div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(exportResult.sampleRecord, null, 2)}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={downloadFile} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download CSV File
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="font-semibold">Storage Path:</div>
                    <code className="bg-background px-2 py-1 rounded break-all">
                      {exportResult.storagePath}
                    </code>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="font-semibold text-amber-800 mb-1">Direct Download URL:</div>
                  <div className="text-xs break-all bg-white p-2 rounded border">
                    <a 
                      href={exportResult.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {exportResult.downloadUrl}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground">
            <div className="font-semibold mb-2">Export Details:</div>
            <ul className="space-y-1">
              <li>• Format: CSV (comma-separated values)</li>
              <li>• Language: English</li>
              <li>• Meal Plans: Lodging Only (40%), Breakfast (60%), Half Board (80%), Full Board (100%)</li>
              <li>• Pricing: USD, includes both double and single room rates</li>
              <li>• Source: Real database packages + Sacred pricing fallback</li>
              <li>• 🔒 Read-only export - no data modification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};