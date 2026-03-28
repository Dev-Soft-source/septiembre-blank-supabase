// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Country list - matching the existing format from the app
const countries = [
  "Spain", "Portugal", "France", "Italy", "Germany", "United Kingdom", 
  "Netherlands", "Belgium", "Austria", "Switzerland", "Greece", "Croatia",
  "Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Denmark",
  "Sweden", "Norway", "Finland", "Ireland", "Luxembourg", "Slovenia", 
  "Slovakia", "Estonia", "Latvia", "Lithuania", "Malta", "Cyprus"
];

interface Hotel {
  id: string;
  country: string;
  city: string;
  name: string;
}

const hotelSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  name: z.string().min(1, "Hotel name is required"),
});

const referralSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankCountry: z.string().min(1, "Bank country is required"),
  ibanAccount: z.string().min(1, "IBAN/Account number is required"),
  swiftBic: z.string().optional(),
});

type HotelFormData = z.infer<typeof hotelSchema>;
type ReferralFormData = z.infer<typeof referralSchema>;

export function HotelReferralsContent() {
  const { t, language } = useTranslation("dashboard/general");
  const { profile } = useAuth();
  
  // Debug logging
  console.log("🔍 HotelReferralsContent DEBUG:", {
    language,
    titleKey: 'referrals.title',
    titleValue: t('referrals.title'),
    eligibilityKey: 'referrals.eligibilityText', 
    eligibilityValue: t('referrals.eligibilityText')
  });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hotelForm = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
  });

  const referralForm = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
  });

  const addHotel = (data: HotelFormData) => {
    const newHotel: Hotel = {
      id: Date.now().toString(),
      country: data.country,
      city: data.city,
      name: data.name,
    };
    setHotels([...hotels, newHotel]);
    hotelForm.reset();
  };

  const removeHotel = (id: string) => {
    setHotels(hotels.filter(hotel => hotel.id !== id));
  };

  const onSubmit = async (data: ReferralFormData) => {
    if (hotels.length === 0) {
      toast.error(t('referrals.validation.hotelsRequired'));
      return;
    }

    if (!profile?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('hotel_referrals_submissions')
        .insert({
          user_id: profile.id,
          full_name: data.fullName,
          bank_name: data.bankName,
          bank_country: data.bankCountry,
          iban_account: data.ibanAccount,
          swift_bic: data.swiftBic || null,
          hotels: hotels.map(hotel => ({
            country: hotel.country,
            city: hotel.city,
            name: hotel.name
          }))
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Hotel referrals submitted successfully!");
    } catch (error) {
      console.error('Error submitting referrals:', error);
      toast.error("Failed to submit referrals. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="border-green-400/20 bg-[#5c0869] glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              {t('referrals.confirmationTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-300">
              {t('referrals.confirmationMessage')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-[#5c0869] glass-card border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
            <span>{t('referrals.icon')}</span>
            <span>{t('referrals.title')}</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base leading-relaxed text-white/80 space-y-3">
            <p className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{t('referrals.eligibilityIcon')}</span>
              <span className="text-xs sm:text-sm">{t('referrals.eligibilityText')}</span>
            </p>
            
            <p className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{t('referrals.processIcon')}</span>
              <span className="text-xs sm:text-sm">{t('referrals.processText')}</span>
            </p>
            
            <p className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{t('referrals.rewardsIcon')}</span>
              <span className="text-xs sm:text-sm">{t('referrals.rewardsText')}</span>
            </p>
            
            <p className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{t('referrals.confidentialityIcon')}</span>
              <span className="text-xs sm:text-sm">{t('referrals.confidentialityText')}</span>
            </p>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Hotel Submission Form */}
      <Card className="bg-[#5c0869] glass-card border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-base">{t('referrals.hotelSubmission')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={hotelForm.handleSubmit(addHotel)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="country" className="text-white text-xs sm:text-sm">{t('referrals.country')}</Label>
                <Select onValueChange={(value) => hotelForm.setValue('country', value)}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue placeholder={t('referrals.country')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country} className="text-xs sm:text-sm">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hotelForm.formState.errors.country && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.countryRequired')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="city" className="text-white text-xs sm:text-sm">{t('referrals.city')}</Label>
                <Input
                  id="city"
                  {...hotelForm.register('city')}
                  placeholder={t('referrals.city')}
                  className="text-xs sm:text-sm"
                />
                {hotelForm.formState.errors.city && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.cityRequired')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name" className="text-white text-xs sm:text-sm">{t('referrals.hotelName')}</Label>
                <Input
                  id="name"
                  {...hotelForm.register('name')}
                  placeholder={t('referrals.hotelName')}
                  className="text-xs sm:text-sm"
                />
                {hotelForm.formState.errors.name && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.hotelNameRequired')}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto text-xs sm:text-sm">
              <Plus className="w-3 h-3 mr-2" />
              {t('referrals.addAnother')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Submitted Hotels Table */}
      {hotels.length > 0 && (
        <Card className="bg-[#5c0869] glass-card border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white text-sm sm:text-base">{t('referrals.submittedHotels')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white text-xs sm:text-sm">{t('referrals.country')}</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm">{t('referrals.city')}</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm">{t('referrals.hotelName')}</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="text-white text-xs sm:text-sm">{hotel.country}</TableCell>
                    <TableCell className="text-white text-xs sm:text-sm">{hotel.city}</TableCell>
                    <TableCell className="text-white text-xs sm:text-sm">{hotel.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHotel(hotel.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Payment Information Form */}
      <Card className="bg-[#5c0869] glass-card border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-base">{t('referrals.paymentInfo')}</CardTitle>
          <CardDescription className="text-white/80 text-xs sm:text-sm">
            {t('referrals.paymentInfoDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={referralForm.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fullName" className="text-white text-xs sm:text-sm">{t('referrals.fullName')}</Label>
                <Input
                  id="fullName"
                  {...referralForm.register('fullName')}
                  placeholder={t('referrals.fullName')}
                  className="text-xs sm:text-sm"
                />
                {referralForm.formState.errors.fullName && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.fullNameRequired')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bankName" className="text-white text-xs sm:text-sm">{t('referrals.bankName')}</Label>
                <Input
                  id="bankName"
                  {...referralForm.register('bankName')}
                  placeholder={t('referrals.bankName')}
                  className="text-xs sm:text-sm"
                />
                {referralForm.formState.errors.bankName && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.bankNameRequired')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bankCountry" className="text-white text-xs sm:text-sm">{t('referrals.bankCountry')}</Label>
                <Select onValueChange={(value) => referralForm.setValue('bankCountry', value)}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue placeholder={t('referrals.bankCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country} className="text-xs sm:text-sm">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {referralForm.formState.errors.bankCountry && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.bankCountryRequired')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ibanAccount" className="text-white text-xs sm:text-sm">{t('referrals.ibanAccount')}</Label>
                <Input
                  id="ibanAccount"
                  {...referralForm.register('ibanAccount')}
                  placeholder={t('referrals.ibanAccount')}
                  className="text-xs sm:text-sm"
                />
                {referralForm.formState.errors.ibanAccount && (
                  <p className="text-xs text-red-400 mt-1">
                    {t('referrals.validation.ibanRequired')}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="swiftBic" className="text-white text-xs sm:text-sm">{t('referrals.swiftBic')}</Label>
                <Input
                  id="swiftBic"
                  {...referralForm.register('swiftBic')}
                  placeholder={t('referrals.swiftBic')}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full text-xs sm:text-sm" 
              disabled={isSubmitting || hotels.length === 0}
            >
              {isSubmitting ? "Submitting..." : t('referrals.submitReferral')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}