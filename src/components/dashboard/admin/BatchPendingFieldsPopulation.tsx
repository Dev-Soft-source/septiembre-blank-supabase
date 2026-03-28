
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, CheckCircle, AlertCircle } from "lucide-react";

interface ProcessingStats {
  totalPending: number;
  processed: number;
  fieldsFilledCount: number;
  errors: string[];
  completionRate: number;
}

export function BatchPendingFieldsPopulation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const { toast } = useToast();

  const handleBatchProcess = async () => {
    setIsProcessing(true);
    setStats(null);

    try {
      const { data, error } = await supabase.functions.invoke('batch-populate-pending-fields', {
        body: { 
          action: 'process_pending_fields',
          // Enhanced field population parameters
          categoryRange: { min: 3, max: 4 }, // Limit to 3-4 stars
          excludeLuxuryBrands: true,
          ensureAllFieldsPopulated: true,
          requiredFields: [
            'description',
            'ideal_guests', 
            'atmosphere',
            'perfect_location',
            'property_type',
            'style',
            'features_hotel',
            'features_room',
            'meal_plans',
            'room_types',
            'rates',
            'available_months',
            'address',
            'contact_name',
            'contact_email'
          ]
        }
      });

      if (error) {
        throw error;
      }

      setStats(data.stats);
      
      toast({
        title: "Batch Processing Complete",
        description: `Processed ${data.stats.processed} properties with ${data.stats.completionRate}% field completion rate.`,
      });

    } catch (error) {
      console.error('Batch processing error:', error);
      toast({
        title: "Processing Failed",
        description: "An error occurred during batch processing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#7a0486]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-semibold">
            <Play className="w-5 h-5" />
            Batch Fill Pending Fields
          </CardTitle>
          <CardDescription className="text-white/80">
            Automatically fill empty fields in pending properties with complete data for 3-4 star hotels only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#5A1876]/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Enhanced Field Population Rules:</h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Hotel Category: Limited to 3-4 stars only</li>
              <li>• Room Types: Always "double" with proper occupancy</li>
              <li>• Base Prices: €1200-1600 (mid-range pricing)</li>
              <li>• Dynamic Pricing: Enabled with 20% cap</li>
              <li>• Meal Plans: "Half board" or "Breakfast included"</li>
              <li>• Property Types: Hotel, Boutique Hotel, Inn</li>
              <li>• Complete descriptions and location details</li>
              <li>• Full contact information</li>
              <li>• Comprehensive amenities lists</li>
              <li>• Exclude luxury brands and 5-star properties</li>
            </ul>
          </div>

          <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30">
            <h4 className="text-green-200 font-medium mb-2">Quality Standards:</h4>
            <ul className="text-green-200/80 text-sm space-y-1">
              <li>• 100% field completion target</li>
              <li>• Realistic mid-market hotel data</li>
              <li>• No premium or luxury properties</li>
              <li>• Proper validation of all generated content</li>
            </ul>
          </div>

          <Button
            onClick={handleBatchProcess}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Mid-Range Hotels...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Complete All Fields (3-4 Star Hotels Only)
              </>
            )}
          </Button>

          {stats && (
            <div className="space-y-3">
              <div className="bg-[#5A1876]/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Processing Results
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Total Pending:</span>
                    <span className="text-white ml-2 font-medium">{stats.totalPending}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Properties Processed:</span>
                    <span className="text-white ml-2 font-medium">{stats.processed}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Fields Filled:</span>
                    <span className="text-white ml-2 font-medium">{stats.fieldsFilledCount}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Completion Rate:</span>
                    <span className="text-white ml-2 font-medium">{stats.completionRate}%</span>
                  </div>
                </div>
              </div>

              {stats.errors.length > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    Errors ({stats.errors.length})
                  </h4>
                  <ul className="text-red-300 text-sm space-y-1">
                    {stats.errors.slice(0, 5).map((error, index) => (
                      <li key={`pending-error-${index}`}>• {error}</li>
                    ))}
                    {stats.errors.length > 5 && (
                      <li className="text-red-400">... and {stats.errors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
