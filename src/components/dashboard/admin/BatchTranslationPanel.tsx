
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, CheckCircle } from "lucide-react";
import { useBatchTranslation } from "@/hooks/useBatchTranslation";

export default function BatchTranslationPanel() {
  const { loading, progress, startBatchTranslation, getTranslationStats } = useBatchTranslation();
  const [stats, setStats] = useState<{
    totalHotels: number;
    translatedHotels: number;
    pendingTranslations: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const translationStats = await getTranslationStats();
      setStats(translationStats);
    };
    fetchStats();
  }, [getTranslationStats]);

  const handleStartTranslation = async () => {
    try {
      await startBatchTranslation();
      // Refresh stats after translation
      const translationStats = await getTranslationStats();
      setStats(translationStats);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Batch Translation Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Manage hotel translations across multiple languages (Spanish, Portuguese, Romanian).
              This will translate ALL pending hotel content including names, descriptions, and other text fields.
            </p>

            {stats && (
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalHotels}</div>
                  <div className="text-sm text-blue-800">Total Hotels</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.translatedHotels}</div>
                  <div className="text-sm text-green-800">Translated Hotels</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingTranslations}</div>
                  <div className="text-sm text-orange-800">Pending Translations</div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleStartTranslation}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? 'Processing All Translations...' : 'Start Complete Translation Process'}
            </Button>

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  🔄 Processing ALL pending hotel translations...
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  This will continue until all hotels are translated. Please wait.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {progress && (
        <Card>
          <CardHeader className="bg-purple-800 text-white">
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-white">Complete Translation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2">
                <p className="text-blue-800 font-medium">
                  {progress.success ? '✅ Complete Success' : '❌ Failed'}
                </p>
                <p className="text-blue-700">
                  Processed: {progress.processed} hotels
                </p>
                <p className="text-blue-700">
                  Errors: {progress.errors}
                </p>
                <p className="text-blue-700">
                  Total: {progress.total}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {progress.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
