
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HotelReviewsProps } from "@/types/hotel";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  // User details - these will be added via join
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export function HotelReviews({ hotelId, averageRating = 0, isLoading: externalLoading }: HotelReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch reviews for the specific hotel
  useEffect(() => {
    const fetchReviews = async () => {
      if (!hotelId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:profiles(first_name, last_name, avatar_url)
          `)
          .eq('hotel_id', hotelId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform data to flatten the profiles information
        const transformedData = data.map((review: any) => {
          return {
            ...review,
            first_name: review.profiles?.first_name || 'Anonymous',
            last_name: review.profiles?.last_name || 'User',
            avatar_url: review.profiles?.avatar_url
          };
        });
        
        setReviews(transformedData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast({
          title: "Error loading reviews",
          description: "Could not load reviews for this hotel.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [hotelId, toast]);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Render stars for a rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? "fill-fuchsia-400 text-fuchsia-400" : "text-foreground/30"}`} 
      />
    ));
  };
  
  // If external loading state is provided and true, show loading state
  if (externalLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border-b border-fuchsia-900/10 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-16 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Guest Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-foreground/70">
            {averageRating.toFixed(1)} / 5 ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-foreground/70">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-fuchsia-900/10 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold overflow-hidden">
                    {review.avatar_url ? (
                      <img src={review.avatar_url} alt={review.first_name} className="w-full h-full object-cover" />
                    ) : (
                      review.first_name?.[0] || 'A'
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{review.first_name} {review.last_name?.[0] || ''}.</h3>
                    <p className="text-sm text-foreground/60">{formatDate(review.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-foreground/80 whitespace-pre-line">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-foreground/60">
          <p>No reviews yet for this hotel.</p>
          <p className="text-sm mt-1">Be the first to leave a review!</p>
        </div>
      )}
    </div>
  );
}
