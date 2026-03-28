
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Camera, CheckCircle, AlertCircle, Bed } from "lucide-react";

interface RoomImageStats {
  totalHotels: number;
  processedHotels: number;
  imagesAdded: number;
  errors: string[];
  hotelProgress: string[];
}

export function BatchRoomImages() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<RoomImageStats | null>(null);
  const { toast } = useToast();

  const handleBatchRoomImages = async () => {
    setIsProcessing(true);
    setStats(null);

    try {
      const { data, error } = await supabase.functions.invoke('batch-populate-room-images', {
        body: { 
          action: 'populate_room_images',
          maxHotels: 20,
          imagesPerHotel: 2
        }
      });

      if (error) {
        throw error;
      }

      setStats(data.stats);
      
      toast({
        title: "Room Images Population Complete",
        description: `Added ${data.stats.imagesAdded} room images to ${data.stats.processedHotels} hotels.`,
      });

    } catch (error) {
      console.error('Batch room images error:', error);
      toast({
        title: "Room Images Failed",
        description: "An error occurred during room image population. Please try again.",
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
          <CardTitle className="text-white flex items-center gap-2 font-semibold">
            <Camera className="w-5 h-5" />
            Batch Room Images
          </CardTitle>
          <CardDescription className="text-white/80">
            Populate room images for hotels using AI-generated or curated room photos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#5A1876]/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Room Image Parameters:
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Maximum Hotels: 20</li>
              <li>• Images per Hotel: 2</li>
              <li>• Total Images: 40 maximum</li>
              <li>• Target: Hotels without room images</li>
              <li>• Source: Curated room photo collections</li>
            </ul>
          </div>

          <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-600/30">
            <h4 className="text-amber-200 font-medium mb-2">Important Notes:</h4>
            <ul className="text-amber-200/80 text-sm space-y-1">
              <li>• This batch should run AFTER hotel creation and hotel images</li>
              <li>• Will automatically select the first 20 hotels needing room images</li>
              <li>• Room images will be added to hotel galleries</li>
            </ul>
          </div>

          <Button
            onClick={handleBatchRoomImages}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Room Images...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Add Room Images to 20 Hotels
              </>
            )}
          </Button>

          {stats && (
            <div className="space-y-3">
              <div className="bg-[#5A1876]/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Room Images Results
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Hotels Processed:</span>
                    <span className="text-white ml-2 font-medium">{stats.processedHotels}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Images Added:</span>
                    <span className="text-white ml-2 font-medium">{stats.imagesAdded}</span>
                  </div>
                </div>

                {stats.hotelProgress.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-white/80 text-sm mb-2">Hotels Updated:</h5>
                    <div className="text-xs text-white/60 space-y-1">
                      {stats.hotelProgress.slice(0, 10).map((hotel, index) => (
                        <div key={`hotel-${index}`}>• {hotel}</div>
                      ))}
                      {stats.hotelProgress.length > 10 && (
                        <div className="text-white/40">... and {stats.hotelProgress.length - 10} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {stats.errors.length > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    Errors ({stats.errors.length})
                  </h4>
                  <ul className="text-red-300 text-sm space-y-1">
                    {stats.errors.slice(0, 5).map((error, index) => (
                      <li key={`room-error-${index}`}>• {error}</li>
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
