
import { useState } from "react";
import { useToast, toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiV2Client } from "@/api/v2/client";
import { RecommendHotelFormValues } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recommendHotelSchema } from "../schema";

export const useRecommendHotelSubmit = () => {
  const { toast: useToastRef } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up the form
  const form = useForm<RecommendHotelFormValues>({
    resolver: zodResolver(recommendHotelSchema),
    defaultValues: {
      hotelName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      city: "",
      additionalInfo: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: RecommendHotelFormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a hotel recommendation");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate idempotency key to prevent duplicate submissions
      const idempotencyKey = `recommend-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Submit via API v2
      const response = await apiV2Client.createHotelReferral({
        hotel_name: data.hotelName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        city: data.city,
        additional_info: data.additionalInfo,
      }, idempotencyKey);

      if (!response.success) {
        console.error("Error submitting hotel recommendation:", response.error);
        toast.error("Failed to submit your recommendation", {
          description: response.error || "Please try again"
        });
        return;
      }
      
      toast.success("Recommendation submitted!", {
        description: "Thank you for your recommendation. We'll contact the hotel and notify you of the outcome."
      });
      
      form.reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
