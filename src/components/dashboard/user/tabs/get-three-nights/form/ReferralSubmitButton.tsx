
import React from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferralSubmitButtonProps {
  isSubmitting?: boolean;
}

export const ReferralSubmitButton: React.FC<ReferralSubmitButtonProps> = ({
  isSubmitting = false,
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
      disabled={isSubmitting}
    >
      <Gift className="mr-2 h-4 w-4" /> 
      {isSubmitting ? "Submitting..." : "Submit Referral for Free Nights"}
    </Button>
  );
};
