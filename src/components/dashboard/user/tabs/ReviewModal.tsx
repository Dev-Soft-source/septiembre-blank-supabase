
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export const ReviewModal = ({ isOpen, onClose, booking }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [recommended, setRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user || !booking || rating === 0) {
      toast({
        title: "Invalid submission",
        description: "Please provide a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('reviews')
        .insert({
          hotel_id: booking.hotel_id,
          user_id: user.id,
          rating,
          comment: comment.trim() || null,
          recommended
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });

      onClose();
      // Reset form
      setRating(0);
      setComment("");
      setRecommended(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <Star
          key={index}
          className={`w-8 h-8 cursor-pointer transition-colors ${
            isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#5A0080] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Rate Your Stay</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              {booking?.hotels?.name || 'Hotel'}
            </h3>
            <p className="text-fuchsia-200 text-sm">
              {booking?.hotels ? `${booking.hotels.city}, ${booking.hotels.country}` : 'Location'}
            </p>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-fuchsia-200 mb-2">
              How would you rate your stay?
            </label>
            <div className="flex items-center gap-1">
              {renderStars()}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-fuchsia-200 mb-2">
              Share your experience (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your stay..."
              className="bg-fuchsia-950/30 border-fuchsia-900/20 text-white placeholder:text-fuchsia-300/50"
              rows={3}
            />
          </div>

          {/* Recommendation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommend"
              checked={recommended}
              onCheckedChange={(checked) => setRecommended(checked as boolean)}
              className="border-fuchsia-400 data-[state=checked]:bg-fuchsia-600"
            />
            <label
              htmlFor="recommend"
              className="text-sm text-fuchsia-200 cursor-pointer"
            >
              Would you recommend this hotel to guests with your affinities?
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
