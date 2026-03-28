import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Flag, MapPin, Star, DollarSign, Calendar, Users, CheckCircle, XCircle, Loader2, Utensils } from "lucide-react";
interface BatchResult {
  success: boolean;
  message: string;
  results?: Array<{
    hotel: string;
    success?: boolean;
    error?: string;
    id?: string;
    city?: string;
    state?: string;
  }>;
  stats?: {
    total: number;
    successful: number;
    failed: number;
  };
}
export default function FernandoBatch15USHotels() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const handleCreateUSHotels = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      console.log('Starting 15 US hotels batch creation...');
      const {
        data,
        error
      } = await supabase.functions.invoke('batch-create-us-hotels', {
        body: {}
      });
      if (error) {
        console.error('Error calling batch-create-us-hotels:', error);
        setResult({
          success: false,
          message: 'Failed to create US hotels',
          stats: {
            total: 15,
            successful: 0,
            failed: 15
          }
        });
        return;
      }
      console.log('US hotels batch creation response:', data);
      setResult(data);
    } catch (error) {
      console.error('Exception during US hotels batch creation:', error);
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        stats: {
          total: 15,
          successful: 0,
          failed: 15
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-6">
      <Card className="bg-purple-700 border-purple-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-medium">
            <Flag className="w-5 h-5" />
            15 hoteles en Estados Unidos
          </CardTitle>
          <CardDescription className="text-white opacity-80 text-sm">
            Create 15 premium hotels across different US states with complete data, real images, and pricing packages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4" />
                Location Requirements
              </h4>
              <ul className="text-sm text-white opacity-80 space-y-1">
                <li>• All hotels in United States</li>
                <li>• Different states and cities</li>
                <li>• No repeated locations</li>
                <li>• Suburban/second-tier urban areas</li>
                <li>• Real addresses required</li>
              </ul>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2 text-base">
                <Star className="w-4 h-4" />
                Hotel Standards
              </h4>
              <ul className="text-sm text-white opacity-80 space-y-1">
                <li>• 3-star or 4-star hotels only</li>
                <li>• Only small chains (up to 5 hotels) are allowed. Large chains (Marriott, Hilton, etc.) are excluded.</li>
                <li>• Real hotel names and data</li>
                <li>• Authentic descriptions</li>
                <li>• 2+ real photos per hotel</li>
              </ul>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2 text-base">
                <Utensils className="w-4 h-4" />
                Meal Plan Rules
              </h4>
              <ul className="text-sm text-white opacity-80 space-y-1">
                <li>• Lower price ranges: Room Only or Bed & Breakfast</li>
                <li>• Higher price ranges: Half Board or Full Board</li>
                <li>• Automatic price-meal correlation</li>
                <li>• Validated during creation</li>
              </ul>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                Package Configuration
              </h4>
              <ul className="text-sm text-white opacity-80 space-y-1">
                <li>• Durations: 8, 15, 22, 29 days</li>
                <li>• Most packages: 22 & 29 days</li>
                <li>• 3-9 rooms per package</li>
                <li>• Logical theme/activity matching</li>
                <li>• Real availability dates</li>
              </ul>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4" />
              Pricing Structure (Per Person)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white opacity-80">
              <div>
                <div className="font-medium">7 nights</div>
                <div>Double: $450-700</div>
                <div>Single: $585-910</div>
              </div>
              <div>
                <div className="font-medium">14 nights</div>
                <div>Double: $850-1350</div>
                <div>Single: $1105-1755</div>
              </div>
              <div>
                <div className="font-medium">21 nights</div>
                <div>Double: $1200-1950</div>
                <div>Single: $1560-2535</div>
              </div>
              <div>
                <div className="font-medium">28 nights</div>
                <div>Double: $1600-2600</div>
                <div>Single: $2080-3380</div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <h4 className="font-medium text-white mb-2 text-base">🔐 Security Clause</h4>
            <p className="text-sm text-white opacity-80">
              This batch operation is fully isolated and will only create new hotel records under the specified conditions. 
              No existing data, styling, or functionality will be modified.
            </p>
          </div>

          {/* Action Button */}
          <Button onClick={handleCreateUSHotels} disabled={isLoading} className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30" size="lg">
            {isLoading ? <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating 15 US Hotels...
              </> : <>
                <Flag className="w-4 h-4 mr-2" />
                Execute: Create 15 US Hotels
              </>}
          </Button>

          {/* Results Display */}
          {result && <Card className={`border-2 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  Batch Execution Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </p>

                {result.stats && <div className="flex gap-4">
                    <Badge variant="outline" className="bg-white">
                      <Users className="w-3 h-3 mr-1" />
                      Total: {result.stats.total}
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Success: {result.stats.successful}
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 border-red-300">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed: {result.stats.failed}
                    </Badge>
                  </div>}

                {result.results && result.results.length > 0 && <div className="space-y-2">
                    <h4 className="font-medium">Hotel Creation Details:</h4>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {result.results.map((hotel, index) => <div key={index} className={`p-2 rounded text-sm border ${hotel.success ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800'}`}>
                          <div className="font-medium">{hotel.hotel}</div>
                          {hotel.success && hotel.city && hotel.state && <div className="text-xs opacity-75">
                              📍 {hotel.city}, {hotel.state} • ID: {hotel.id?.slice(-8)}
                            </div>}
                          {hotel.error && <div className="text-xs opacity-75">❌ {hotel.error}</div>}
                        </div>)}
                    </div>
                  </div>}
              </CardContent>
            </Card>}
        </CardContent>
      </Card>
    </div>;
}