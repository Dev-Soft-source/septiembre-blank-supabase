
import { useState } from "react";
import { useToast, toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiV2Client } from "@/api/v2/client";
import { ReferralFormValues } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { referralFormSchema } from "../schema";

export const useReferralSubmit = () => {
  const { toast: useToastRef } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up the form
  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      hotelName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      city: "",
      referralDate: new Date(),
      additionalInfo: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: ReferralFormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a hotel referral");
      return;
    }
    
    // Calculate the referral expiration date (15 days from referral date)
    const referralDate = new Date(data.referralDate);
    
    setIsSubmitting(true);
    
    try {
      // Generate idempotency key to prevent duplicate submissions
      const idempotencyKey = `referral-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Submit via API v2
      const response = await apiV2Client.createHotelReferral({
        hotel_name: data.hotelName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        city: data.city,
        additional_info: data.additionalInfo,
        referral_type: "three_free_nights",
        referral_date: referralDate.toISOString(),
      }, idempotencyKey);

      if (!response.success) {
        console.error("Error submitting hotel referral:", response.error);
        toast.error("Error saving referral", {
          description: response.error || "Failed to submit your referral. Please try again."
        });
        return;
      }
      
      // Calculate expiration date for display
      const expirationDate = new Date(referralDate);
      expirationDate.setDate(expirationDate.getDate() + 15);
      
      toast.success("Referral submitted!", {
        description: `Thank you for your referral. The hotel must register by ${expirationDate.toLocaleDateString()} for you to receive three free nights.`
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
