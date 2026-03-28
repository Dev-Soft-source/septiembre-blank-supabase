
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast, toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

// Define the form validation schema
const advertisingFormSchema = z.object({
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  availableMonths: z.array(z.string()).min(2, { message: "Please select at least 2 months." }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue." }),
  }),
});

// Define the form values type
type AdvertisingFormValues = z.infer<typeof advertisingFormSchema>;

export default function AdvertisingContent() {
  const { toast: useToastRef } = useToast();
  const { profile, user } = useAuth();
  const { t } = useTranslation('advertising');
  
  // Available months for selection
  const availableMonths = [
    { key: "january", label: t('january') },
    { key: "february", label: t('february') },
    { key: "march", label: t('march') },
    { key: "april", label: t('april') },
    { key: "may", label: t('may') },
    { key: "june", label: t('june') },
    { key: "july", label: t('july') },
    { key: "august", label: t('august') },
    { key: "september", label: t('september') },
    { key: "october", label: t('october') },
    { key: "november", label: t('november') },
    { key: "december", label: t('december') }
  ];
  
  // Set up the form
  const form = useForm<AdvertisingFormValues>({
    resolver: zodResolver(advertisingFormSchema),
    defaultValues: {
      contactName: profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : "",
      contactEmail: user?.email || "",
      availableMonths: [],
      termsAccepted: false as any, // Use type assertion to bypass the type check initially
    },
  });

  // Form submission handler
  async function onSubmit(data: AdvertisingFormValues) {
    if (!user) {
      toast.error("You must be logged in to submit a promotion request.");
      return;
    }
    
    try {
      // Insert the data into the advertising_requests table
      const { error } = await supabase.from("advertising_requests").insert({
        user_id: user.id,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        available_months: data.availableMonths
      });

      if (error) {
        console.error("Error submitting promotion request:", error);
        toast.error("Failed to submit your request. Please try again.", {
          description: error.message
        });
        return;
      }
      
      toast.success("Promotion request submitted!", {
        description: "We'll review your request and contact you soon."
      });
      
      // Reset form fields except for contact information
      form.reset({
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        availableMonths: [],
        termsAccepted: false as any,
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 bg-[#7a0486]">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="w-4 h-4 text-fuchsia-300" />
          <h2 className="text-lg sm:text-xl font-bold">{t('title')}</h2>
        </div>
      </div>

      {/* Slogans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          t('headerSlogan1'),
          t('headerSlogan2'),
          t('headerSlogan3'),
          t('headerSlogan4')
        ].map((slogan, index) => (
          <div 
            key={index} 
            className="glass-card rounded-lg p-3 bg-[#5d0478] text-center flex items-center justify-center h-16"
          >
            <p className="text-xs sm:text-sm font-semibold text-fuchsia-100">{slogan}</p>
          </div>
        ))}
      </div>

      {/* Main Promotion Text */}
      <div className="glass-card rounded-2xl p-4 bg-[#7a0486]">
        <h3 className="text-sm sm:text-base font-semibold mb-3 text-fuchsia-100">{t('promotionOfferTitle')}</h3>
        
        <div className="space-y-3 text-fuchsia-100">
          <p className="text-xs sm:text-sm">{t('promotionOfferText1')}</p>
          <p className="text-xs sm:text-sm">{t('promotionOfferText2')}</p>
          <p className="text-xs sm:text-sm">{t('promotionOfferText3')}</p>
        </div>
      </div>

      {/* Signup Form */}
      <div className="glass-card rounded-2xl p-4 bg-[#7a0486]">
        <h3 className="text-sm sm:text-base font-semibold mb-4">{t('joinPromotionTitle')}</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Contact Name */}
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">{t('contactName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('contactNamePlaceholder')} {...field} className="text-xs sm:text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Contact Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">{t('contactEmail')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('contactEmailPlaceholder')} {...field} className="text-xs sm:text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Available Months */}
            <FormField
              control={form.control}
              name="availableMonths"
              render={() => (
                <FormItem>
                  <div className="mb-3">
                    <FormLabel className="text-xs sm:text-sm">{t('availableMonthsTitle')}</FormLabel>
                    <FormDescription className="text-fuchsia-300 text-xs">
                      {t('availableMonthsDescription')}
                    </FormDescription>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableMonths.map((month) => (
                      <FormField
                        key={month.key}
                        control={form.control}
                        name="availableMonths"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={month.key}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(month.key)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, month.key])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== month.key
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-xs sm:text-sm font-normal">
                                {month.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Terms Acceptance */}
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-xs sm:text-sm">
                      {t('termsAcceptance')}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-xs sm:text-sm"
            >
              <Check className="mr-2 h-3 w-3" /> {t('submitButton')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
