
import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationViewProps {
  onSubmitAnother: () => void;
}

export function ConfirmationView({ onSubmitAnother }: ConfirmationViewProps) {
  return (
    <div className="max-w-2xl mx-auto bg-[#4b0456] p-8 rounded-lg mt-8">
      <div className="text-center p-8 bg-white/10 rounded-lg border border-white/20">
        <h2 className="text-3xl font-bold text-[#FFF9B0] mb-4">Thank you!</h2>
        <p className="text-slate-50 text-lg leading-relaxed">
          We've received your request and will get back to you shortly. You're one step closer to being part of the Hotel-Living movement!
        </p>
        <Button 
          onClick={onSubmitAnother}
          className="mt-6 bg-[#FFF9B0] hover:bg-[#FFF9B0]/90 text-[#4b0456] font-semibold py-3"
        >
          Submit Another Application
        </Button>
      </div>
    </div>
  );
}
