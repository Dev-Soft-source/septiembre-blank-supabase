
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecommendedHotels } from '@/hooks/useRecommendedHotels';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const RecommendedHotels: React.FC = () => {
  const { hotels: recommendedHotels, loading, error } = useRecommendedHotels();
  
  const hideHotel = (hotelId: string) => {
    // Feature discontinued - placeholder function
    console.log('Hide hotel feature discontinued:', hotelId);
  };
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl text-white">Recommended for You</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendedHotels.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl text-white">Recommended for You</CardTitle>
        </CardHeader>
        <div className="text-center py-8 text-white/80">
          <p>No recommendations available yet.</p>
          <p className="text-sm mt-2">Update your profile affinities to get personalized suggestions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-xl text-white">Recommended for You</CardTitle>
        <p className="text-white/80 text-sm">You might also like...</p>
      </CardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={hotel.main_image_url || hotel.hotel_images?.[0]?.image_url || "/placeholder.svg"} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-[#68178D]/50 hover:bg-[#68178D]/70 text-white"
                onClick={() => hideHotel(hotel.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-white">
                {hotel.name}
              </h3>
              
              <div className="flex items-center text-sm text-white/70 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {hotel.city}, {hotel.country}
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-white">
                  From ${hotel.price_per_month}/month
                </p>
              </div>

              {hotel.recommendation_reason && (
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-fuchsia-600/30 text-fuchsia-200 border-fuchsia-400/30">
                    {hotel.recommendation_reason.length > 30 
                      ? `${hotel.recommendation_reason.substring(0, 30)}...`
                      : hotel.recommendation_reason
                    }
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-white/50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{hotel.recommendation_reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                
                <Button
                  size="sm"
                  className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
