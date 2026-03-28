import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Mail, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityPackage } from "@/types/availability-package";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: AvailabilityPackage | null;
  hotelName: string;
}

export function WaitlistModal({
  isOpen,
  onClose,
  package: selectedPackage,
  hotelName
}: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!selectedPackage) return null;

  const handleSubmit = async () => {
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please provide both your name and email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store waitlist entry (using existing user_notifications table structure)
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          hotel_id: selectedPackage.hotel_id,
          user_id: null, // Anonymous waitlist entry
          type: 'package_waitlist',
          is_active: true
        });

      if (error) {
        throw error;
      }

      // Log waitlist entry for hotel owner reference
      console.log('Waitlist entry created:', {
        packageId: selectedPackage.id,
        hotelId: selectedPackage.hotel_id,
        guestName: name,
        guestEmail: email,
        packageDates: `${selectedPackage.start_date} to ${selectedPackage.end_date}`
      });

      toast({
        title: "Added to Waitlist!",
        description: `We'll notify you if rooms become available for ${hotelName}.`,
      });

      // Reset form and close modal
      setEmail("");
      setName("");
      onClose();

    } catch (error: any) {
      console.error('Waitlist submission error:', error);
      toast({
        title: "Waitlist Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Join Waitlist
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Details */}
          <div className="bg-secondary/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {hotelName}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(selectedPackage.start_date), 'MMM dd')} - {format(new Date(selectedPackage.end_date), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div className="text-sm text-red-400 font-medium">
              Currently Sold Out ({selectedPackage.duration_days} days)
            </div>
          </div>

          {/* Waitlist Info */}
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <h4 className="font-medium mb-1">Get Notified</h4>
                <p className="text-blue-200/80">
                  We'll email you immediately if a room becomes available for these dates.
                  No spam, just availability updates.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="waitlist-name">Your Name *</Label>
              <Input
                id="waitlist-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="waitlist-email">Email Address *</Label>
              <Input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !name || !email}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}