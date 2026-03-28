import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useHotelEditing } from '../property/hooks/useHotelEditing';
import { PropertyFormData } from '../property/hooks/usePropertyFormData';
import { supabase } from '@/integrations/supabase/client';
import { useCheckpointAutoSave } from '@/hooks/useCheckpointAutoSave';
import { useDataPreservation } from '@/hooks/useDataPreservation';
import { useSubmissionStability } from '@/hooks/useSubmissionStability';
import { SubmissionStatus } from './components/SubmissionStatus';

import { HotelBasicInfoSection } from './sections/HotelBasicInfoSection';
import { HotelClassificationSection } from './sections/HotelClassificationSection';
import { PropertyTypeSection } from './sections/PropertyTypeSection';
import { PropertyStyleSection } from './sections/PropertyStyleSection';
import { HotelDescriptionSection } from './sections/HotelDescriptionSection';
import { RoomDescriptionSection } from './sections/RoomDescriptionSection';
import { CompletePhraseSection } from './sections/CompletePhraseSection';
import { HotelFeaturesSection } from './sections/HotelFeaturesSection';
import { RoomFeaturesSection } from './sections/RoomFeaturesSection';
import { ActivitiesSection } from './sections/ActivitiesSection';
import { ClientAffinitiesSection } from './sections/ClientAffinitiesSection';
import { CheckInDaySection } from './sections/CheckInDaySection';
import { MealPlanSection } from './sections/MealPlanSection';

import { StayLengthsSection } from './sections/StayLengthsSection';
import { AvailabilityPackagesSection } from './sections/AvailabilityPackagesSection';
import { HotelPackageManagerSection } from './sections/HotelPackageManagerSection';
import { PricingMatrixSection } from './sections/PricingMatrixSection';
import { TermsConditionsSection } from './sections/TermsConditionsSection';

const hotelRegistrationSchema = z.object({
  // Only hotel name is truly required for backend submission
  hotelName: z.string().min(1, 'Hotel name is required'),
  address: z.string().optional(),
  
  // All other fields are optional for submission but may be marked as required in UI
  totalRooms: z.number().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  
  // Contact Info
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  
  // Classification
  classification: z.string().optional(),
  
  // Property Details
  propertyType: z.string().optional(),
  propertyStyle: z.string().optional(),
  hotelDescription: z.string().optional(),
  roomDescription: z.string().optional(),
  idealGuests: z.string().optional(),
  atmosphere: z.string().optional(),
  location: z.string().optional(),
  
  // Features
  hotelFeatures: z.array(z.string()).default([]),
  roomFeatures: z.array(z.string()).default([]),
  
  // Activities and Affinities
  activities: z.array(z.string()).default([]),
  clientAffinities: z.array(z.string()).default([]),
  
  // Accommodation Terms
  checkInDay: z.string().optional(),
  mealPlan: z.string().optional(),
  stayLengths: z.array(z.enum(['8', '15', '22', '29'])).default([]),
  
  // Services
  weeklyLaundryIncluded: z.boolean().default(false),
  externalLaundryAvailable: z.boolean().default(false),
  
  // Availability
  numberOfRooms: z.string().optional(),
  
  // Pricing
  pricingMatrix: z.array(z.any()).default([]),
  price_per_month: z.number().optional(),
  
  // Terms
  termsAccepted: z.boolean().default(false),
  availabilityPackages: z.array(z.object({
    id: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    duration: z.number(),
    availableRooms: z.number().min(1)
//    occupancyMode: z.enum(['single', 'double']).default('double'),
//    basePriceUsd: z.number().min(1)
  })).default([])
});

export type HotelRegistrationFormData = z.infer<typeof hotelRegistrationSchema>;

interface NewHotelRegistrationFormProps {
  editingHotelId?: string;
  onComplete?: () => void;
}

export const NewHotelRegistrationForm = ({ editingHotelId, onComplete }: NewHotelRegistrationFormProps = {}) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isEditing = !!editingHotelId;
  
  // Form validation is now handled ONLY by the Zod schema
  // No legacy validation layers


  // Use data preservation system
  const {
    submissionState,
    submitWithPreservation,
    retryFailedSubmission,
    clearFailedSubmission,
    loadFailedSubmission,
    getFailedSubmissionSummary
  } = useDataPreservation();

  // Add stability features
  const {
    submissionState: stabilityState,
    lockState,
    submitWithStabilityChecks,
    retryWithBackoff,
    deleteWithCleanup,
    resetSubmissionState
  } = useSubmissionStability({ hotelId: editingHotelId });
  
  const form = useForm<HotelRegistrationFormData>({
    resolver: zodResolver(hotelRegistrationSchema),
    defaultValues: {
      stayLengths: [],
      activities: [],
      clientAffinities: [],
      hotelFeatures: [],
      roomFeatures: [],      
      pricingMatrix: [],
      availabilityPackages: [],
      weeklyLaundryIncluded: false,
      externalLaundryAvailable: false,
      termsAccepted: false
    }
  });

  // Convert form data to PropertyFormData for auto-save and submission
  const convertToPropertyFormData = (data: HotelRegistrationFormData): PropertyFormData => ({
    hotelName: data.hotelName,
    propertyType: data.propertyType,
    description: data.hotelDescription,
    idealGuests: data.idealGuests,
    atmosphere: data.atmosphere,
    perfectLocation: data.location,
    style: data.propertyStyle,
    country: data.country,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    contactName: data.email ? 
      `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 'Hotel Contact' :
      'Hotel Contact',
    contactEmail: data.email,
    contactPhone: data.phone,
    category: data.classification,
    stayLengths: data.stayLengths.map(length => parseInt(length)),
    mealPlans: [data.mealPlan].filter(Boolean),
    roomTypes: [{ description: data.roomDescription }].filter(rt => rt.description),
    themes: data.clientAffinities || [], // FIX: Use only clientAffinities for themes
    activities: data.activities || [], // FIX: Ensure array fallback
    faqs: [],
    terms: '',
    termsAccepted: data.termsAccepted,
    hotelImages: [],
    mainImageUrl: '',
    preferredWeekday: data.checkInDay,
    featuresHotel: data.hotelFeatures.reduce((acc, feature) => ({ ...acc, [feature]: true }), {}),
    featuresRoom: data.roomFeatures.reduce((acc, feature) => ({ ...acc, [feature]: true }), {}),
    available_months: data.availabilityPackages?.map(pkg => {
      const month = new Date(pkg.startDate).toLocaleString('default', { month: 'long' }).toLowerCase();
      return month;
    }) || [],
    rates: {},
    currency: 'USD',
    enablePriceIncrease: false,
    priceIncreaseCap: 20,
    pricingMatrix: data.pricingMatrix || [],
    checkinDay: data.checkInDay,
    stayDurations: data.stayLengths.map(length => parseInt(length)),
    availabilityPackages: data.availabilityPackages || []
  });

  // Load existing hotel data for editing
  const { isLoading: isLoadingHotelData } = useHotelEditing({
    editingHotelId,
    setFormData: (updater) => {
      const newData = updater({} as PropertyFormData);
    
      // Convert PropertyFormData back to HotelRegistrationFormData
      form.reset({
        hotelName: newData.hotelName,
        address: newData.address,
        city: newData.city,
        postalCode: newData.postalCode,
        country: newData.country,
        email: newData.contactEmail,
        phone: newData.contactPhone,
        classification: newData.category,
        propertyType: newData.propertyType,
        propertyStyle: newData.style,
        hotelDescription: newData.description,
        idealGuests: newData.idealGuests,
        atmosphere: newData.atmosphere,
        location: newData.perfectLocation,
        hotelFeatures: Object.keys(newData.featuresHotel || {}).filter(key => newData.featuresHotel?.[key]),
        roomFeatures: Object.keys(newData.featuresRoom || {}).filter(key => newData.featuresRoom?.[key]),
        activities: newData.activities || [],
        clientAffinities: newData.themes || [],
        availabilityPackages: newData.availabilityPackages || [],
        checkInDay: newData.preferredWeekday,
        stayLengths: (newData.stayLengths || []).map(length => length.toString()) as ('8' | '15' | '22' | '29')[],
        pricingMatrix: newData.pricingMatrix || []
      });
    },
    setCurrentStep: () => {} // Not needed for this form
  });

  // Checkpoint-based auto-save functionality
  const formData = form.watch();
  const autoSave = useCheckpointAutoSave(formData, true);

  // Track if draft has already been restored to prevent multiple attempts
  const [isDraftRestored, setIsDraftRestored] = React.useState(false);
  const [lastCheckpointSave, setLastCheckpointSave] = React.useState<number>(0);

  // Load draft data when user becomes available (critical for data recovery after browser closure)
  useEffect(() => {
    const loadSavedDraft = async () => {
      try {
        const draft = autoSave.loadDraft();
        if (draft && autoSave.hasValidDraftData && autoSave.hasValidDraftData(draft)) {
          console.log('[HOTEL-REGISTRATION] Loading saved draft data after session restoration');
          // Restore form values from draft
          draft['availabilityPackages'] = null;
          Object.keys(draft).forEach(key => {
            if (key !== 'timestamp' && key !== 'version' && key !== 'photoUrls' && draft[key] !== undefined) {
              form.setValue(key as any, draft[key]);              
            }
          });

          toast({
            title: "Draft Restored",
            description: "You must define the sections from 13) 'AVAILABLE STAY LENGTHS'",
            variant: "destructive",
            duration: 6000
          });
          
          setIsDraftRestored(true);
        }
      } catch (error) {
        console.error('[HOTEL-REGISTRATION] Failed to load draft:', error);
      }
    };

    // Only try to load draft once when auth becomes ready and draft hasn't been restored yet
    if ((user?.id || session?.user?.id) && !submissionState.submissionComplete && !isDraftRestored) {
      // There is a critical issue in AvailabilityPackagesSection.tsx. In refreshing case, error appear.
      loadSavedDraft(); 
    }
  }, [user?.id, session?.user?.id, autoSave.loadDraft, autoSave.hasValidDraftData, form, toast, submissionState.submissionComplete, isDraftRestored]);

  // Checkpoint auto-save effect - saves at sections 6 and 12
  useEffect(() => {
    const userId = user?.id || session?.user?.id;
    if (!userId || !autoSave.isEnabled) {
      return;
    }

    // Check if we should save at checkpoint 6 (after ROOM DESCRIPTION)
    if (autoSave.checkSectionCompletion(6) && lastCheckpointSave < 6) {
      autoSave.saveAtCheckpoint('Section 6 - Room Description');
      setLastCheckpointSave(6);
    }
    
    // Check if we should save at checkpoint 12 (after MEAL PLANS)
    if (autoSave.checkSectionCompletion(12) && lastCheckpointSave < 12) {
      autoSave.saveAtCheckpoint('Section 12 - Meal Plans');
      setLastCheckpointSave(12);
    }
  }, [formData, user?.id, session?.user?.id, autoSave, lastCheckpointSave]);

  // Load any failed submission on component mount and clear stuck states
  React.useEffect(() => {
    loadFailedSubmission();
    
    // Clear any stuck submission states on mount
    if (submissionState.isSubmitting || stabilityState.isSubmitting) {
      console.log('[HOTEL-REGISTRATION] Clearing stuck submission states on mount');
      resetSubmissionState();
      setIsSubmitting(false);
    }
  }, [loadFailedSubmission, resetSubmissionState]);

  // Step navigation function (removed duplicate - using one below)

  const onSubmit = async (data: HotelRegistrationFormData) => {
    setIsSubmitting(true);
   // Only check hotel name requirement - all other validations removed
    if (!data.hotelName?.trim()) {
      console.log('[HOTEL-REGISTRATION] Submission blocked - hotel name required');
      toast({
        title: t('error'),
        description: t('validation.hotelNameRequired'),
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    // Clear any stuck states before starting submission
    if (submissionState.isSubmitting || stabilityState.isSubmitting) {
      console.log('[HOTEL-REGISTRATION] Clearing stuck submission states before submission');
      resetSubmissionState();
    }
    // Save final checkpoint before submission
    await autoSave.saveAtCheckpoint('Final Submission');
    
    // get country_id from country
    if(!data.country){
      toast({
        title: "Country Error",
        description: "Please enter the country name.",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    const { data: countryData, error: countryError } = await supabase
      .from('countries')
      .select('id')
      .eq('name_en', data.country)
      .single();

    if (countryError) {
      toast({
        title: "Country Error",
        description: "'" + data.country + "'" + " doesnot exist in the database",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    // convert stayLength array to string
    let stayLength = "";
    if(data.stayLengths){
      data.stayLengths?.map((length, index) =>{
        stayLength += length;
        if(index < data.stayLengths.length - 1) stayLength += ', '
      })
    }  
    // get available Months from available_packages
    const available = data.availabilityPackages?.map(pkg => {      
       const month = new Date(pkg.startDate).toLocaleString('default', { month: 'long' }).toLowerCase();
        return month.toString();
    })
    const uniqueMonths = [...new Set(available)];

    // get property_type_id before submission
    if(!data.propertyType){
      toast({
        title: "PropertyType Error",
        description: "Please define PropertyType",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }
    
    const{ data: property_type_data, error, propertyErro } = await supabase
      .from('property_types')
      .select('id')
      .eq('name_en', data.propertyType || '')
      .single();

      const hotelData = {
      owner_id: null, // user?.id,  Set to authenticated user - no role check needed
      name: data.hotelName,
//      total_rooms: data.totalRooms,
      description: data.hotelDescription,
      country_id: countryData.id || null,
      city: data.city,
      address: data.address,
      zip_code: data.postalCode,
      contact_name: data.email ? 
        `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 'Hotel Contact' :
        'Hotel Contact',
      contact_email: data.email || user?.email || '',
      contact_phone: data.phone,
      property_type_id: property_type_data?.id || '',
      property_style: data.propertyStyle || '',
      category: data.classification ? parseInt(data.classification) : 1,
      ideal_guests: data.idealGuests,
      atmosphere_description: data.atmosphere,
      perfect_location: data.location,
      amenities: data.roomDescription,
      weekly_laundry_included: data.weeklyLaundryIncluded,
      external_laundry_available: data.externalLaundryAvailable,
      // FIX: Properly map stay lengths as integer array
      stay_lengths: stayLength,//data.stayLengths?.map(length => parseInt(length)) || [],
      // FIX: Properly map meal plan
      meal_plans: data.mealPlan ? data.mealPlan.toString() : [],
//      features_hotel: data.hotelFeatures?.reduce((acc, feature) => ({ ...acc, [feature]: true }), {}) || {},
//      features_room: data.roomFeatures?.reduce((acc, feature) => ({ ...acc, [feature]: true }), {}) || {},
      available_months: uniqueMonths || '',
      main_image_url: '', // Keep empty if no images uploaded
      price_per_month: data.price_per_month || 0,
//      terms: data.termsAccepted ? 'Terms accepted on ' + new Date().toISOString() : '',
      // FIX: Properly map check-in day
      check_in_weekday: data.checkInDay || 'Monday',
      // FIX: Add pricing matrix
//      pricingmatrix: data.pricingMatrix || []
    };    
    
    // FIX: Prepare related data with proper mapping
    const availabilityPackages = await Promise.all(data.availabilityPackages?.map(async pkg => {
      // Use hotel-defined pricing only - no matrix calculation
      return {
        start_date: pkg.startDate.toLocaleDateString().split('T')[0],
        end_date: pkg.endDate.toLocaleDateString().split('T')[0],
        duration_days: pkg.duration,
        total_rooms: pkg.availableRooms,
        rooms: pkg.availableRooms
 //       occupancy_mode: 'double',
 //       base_price_usd: 1000, //  pkg.basePriceUsd || 1000,  Use hotel-defined price
//      current_price_usd: 1000,   pkg.basePriceUsd || 1000
      };
    }) || []);        

    // No images for registration - photos will be submitted via email
    const hotelImages: any[] = [];
    // get ids of the Themes table using name 
    const resultTheme = [];
    if(data.clientAffinities.length > 0)
    {
      const{ data: theme_data, error, themeErro } = await supabase
      .from('themes')
      .select('id, name') 

      data.clientAffinities.filter(ele =>{
        const findElement = theme_data.find(item => item.name === ele)
        if(findElement) resultTheme.push(findElement['id'])
      });
      
    }else{
      toast({
        title: "clientAffinities Error",
        description: "You must select at least 5 clientAffinities",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }
        
    // get ids of the Activities table using name
    const resultActivities = [];
    if(data.activities.length > 0){
      const{ data: activities_data, error, ectivitiesErro} = await supabase
      .from('activities')
      .select('id, name_en')

      data.activities.filter(ele =>{
        const findElement = activities_data.find(item => item.name_en === ele)
        if(findElement) resultActivities.push(findElement['id']);
      } );
    }else
    {
      toast({
        title: "Activities Error",
        description: "You must select Activities",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }
    
    // get ids of the Hotel features table using name
    const resultFeatures = [];
    if(data.hotelFeatures.length > 0){
      const{ data: features_data, error, featuresErro} = await supabase
      .from('features')
      .select('id, name_en')

      data.hotelFeatures.filter(ele =>{
        const findElement = features_data.find(item => item.name_en === ele)
        if(findElement) resultFeatures.push(findElement['id']);
      } );
    }else
    {
      toast({
        title: "Hotel Features Error",
        description: "You must select Hotel Features",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    // get ids of the Room features table using name
    const resultRooms = [];
    if(data.roomFeatures.length > 0){
      const{ data: rooms_data, error, roomsErro} = await supabase
      .from('rooms')
      .select('id, name_en')
      data.roomFeatures.filter(ele =>{
        const findElement = rooms_data.find(item => item.name_en === ele)        
        if(findElement) resultRooms.push(findElement['id']);
      } );
    }else
    {
      toast({
        title: "Room Features Error",
        description: "You must select Room Features",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }
    
    // get the element of the Availability packages
    const resultAvailability = []; // existing array
    const mappedPackages = availabilityPackages.map((pkg) => ({
      start_date: pkg.start_date.toString(),
      end_date: pkg.end_date.toString(),
      rooms: pkg.rooms,
      duration_days: pkg.duration_days,
      duration: pkg.duration_days,
      total_rooms: pkg.total_rooms,
      base_price: 823,
      base_price_usd: 0,
      round_step: 5,
      price_increase_pct: 20,
      dynamic_increment: 20,
    }));
    // Add all mapped packages into resultAvailability
    resultAvailability.push(...mappedPackages);
    
    // Submit using stability system with comprehensive checks
    try {
      const result = await submitWithStabilityChecks(data, async () => {
        // FIX: Call edge function directly with proper data structure
        const { data: result, error } = await supabase.functions.invoke('submit-hotel-registration', {
          body: {
            hotel_data: hotelData,
            availability_packages: resultAvailability,
            hotel_images: hotelImages,
            hotel_themes: resultTheme,
            hotel_activities: resultActivities,
            hotel_features: resultFeatures,
            hotel_rooms: resultRooms,
//            dev_mode: true
          }
        });
        
        if (error) {
          console.error('[HOTEL-REGISTRATION] Edge function error:', error);
          setIsSubmitting(false);
          throw error;
        }
        
        if (!result?.success) {
          console.error('[HOTEL-REGISTRATION] Registration failed:', result);
          setIsSubmitting(false);
          throw new Error(result?.error?.message?.en || 'Hotel registration failed');
        }
        
        // Trigger admin notification
        try {
          const { error: notifyError } = await supabase.functions.invoke('notify-admin-on-hotel-submission', {
            body: {
              hotel_id: result.hotel_id,
              hotel_name: hotelData.name
            }
          });          

        } catch (notifyError) {
          console.error('[HOTEL-REGISTRATION] Admin notification error:', notifyError);
        }
        setIsSubmitting(false);
        return result;
      });

      if (result.success) {
        setShowSuccessMessage(true);
        setIsSubmitting(false);
        // Clear auto-save draft on successful submission
        autoSave.clearDraft();
        
        toast({
          title: "✅ Registration Completed ",
          description: "Your hotel registration has been successfully submitted to Supabase.",
          duration: 3000
        });
        if (onComplete) {
          onComplete();
        }
      } else {
        // Error handling is managed by the data preservation system
        // User will see the retry interface automatically
        console.log('[HOTEL-REGISTRATION] Submission failed, data preserved for retry:', result.error);
        toast({
          title: "Submission Error",
          description: result.error || "Your data has been safely preserved. Use the retry button below to attempt submission again.",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error: any) {
      // SURGICAL FIX: Catch any validation errors and show user-facing messages
      console.error('[HOTEL-REGISTRATION] Submission error caught:', error);
      setIsSubmitting(false);
      // Check if it's an image validation error
      if (error.message && error.message.includes('Image upload failures')) {
        toast({
          title: "Image Upload Issue",
          description: "Some images are still processing. Please wait a moment and try submitting again, or try re-uploading any failed images.",
          variant: "destructive",
          duration: 5000
        });
      } else {
        toast({
          title: "Submission Failed",
          description: error.message || "An unexpected error occurred. Please try again or contact support if the issue persists.",
          variant: "destructive",
          duration: 5000
        });
      }
    }
  };

  function alignToMonday(date: string): string {
    const d = new Date(date);
    // 1 = Monday in JS (0 = Sunday)
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  const handleRetrySubmission = async () => {
    try {
      const result = await retryFailedSubmission();
      
      if (result.success) {
        toast({
          title: "Registration Completed ✅",
          description: "Your hotel registration has been successfully submitted to Supabase after retry.",
          duration: 3000
        });
        
        autoSave.clearDraft();
        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          title: "Retry Failed",
          description: "The retry attempt failed. Your data remains safely stored for future attempts.",
          variant: "destructive",
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: "Retry Error",
        description: "An error occurred during retry. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };
  const handleClearFailedSubmission = () => {
    clearFailedSubmission();
    toast({
      title: "Data Cleared",
      description: "Saved submission data has been cleared from local storage.",
      duration: 3000
    });
  };

  // Fixed scroll to step utility - ensures correct step navigation
  const scrollToStep = (stepValue: string) => {
    setTimeout(() => {
      // First try to find the accordion item by value attribute
      let targetElement = document.querySelector(`[value="${stepValue}"]`);
      
      // If not found, try the radix accordion selector
      if (!targetElement) {
        targetElement = document.querySelector(`[data-value="${stepValue}"]`);
      }
      
      // If still not found, try finding by accordion item selector
      if (!targetElement) {
        targetElement = document.querySelector(`div[data-radix-accordion-item] [data-value="${stepValue}"]`);
      }
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const allAccordionItems = document.querySelectorAll('[data-radix-accordion-item]');
        for (const item of allAccordionItems) {
          if (item.getAttribute('value') === stepValue || item.querySelector(`[value="${stepValue}"]`)) {
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
          }
        }
      }
    }, 200); // Increased timeout to ensure DOM updates
  };

  return (
    <div className="max-w-4xl mx-auto p-6 hotel-registration-form">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg border border-purple-500 relative">
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl font-bold"
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
          <h3 className="text-xl font-bold text-white mb-3">¡Ha completado su registro!</h3>
          <p className="text-white text-base leading-relaxed">
            Ahora es imprescindible que nos envíe fotografías de su establecimiento (mínimo 10), y de las 
            habitaciones (mínimo 5). Tamaño máximo por foto: 1 MB, formato JPG, PNG o WEBP. Envíelas ahora a{' '}
            <span className="font-semibold underline">contact@hotel-living.com</span>. ¡Sin fotos no es posible 
            publicar su propiedad, llenar sus habitaciones vacías y multiplicar sus beneficios!
          </p>
        </div>
      )}
  
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion 
            type="single" 
            collapsible
            className="space-y-4"
            onValueChange={(value) => {
              if (value) {
                scrollToStep(value);
              }
            }}
          >
            <HotelBasicInfoSection form={form} />
            <HotelClassificationSection form={form} />
            <PropertyTypeSection form={form} />
            <PropertyStyleSection form={form} />
            <HotelDescriptionSection form={form} />
            <RoomDescriptionSection form={form} />
            <CompletePhraseSection form={form} />
            <HotelFeaturesSection form={form} />
            <RoomFeaturesSection form={form} />
            <ClientAffinitiesSection form={form} />
            <ActivitiesSection form={form} />
            <MealPlanSection form={form} />
            <StayLengthsSection form={form} />
            <CheckInDaySection form={form} />
            <AvailabilityPackagesSection form={form} />
            
            {/* Advanced Package Management - Only for Editing */}
            <HotelPackageManagerSection form={form} editingHotelId={editingHotelId} />
            <PricingMatrixSection form={form} />
          </Accordion>
          
          <TermsConditionsSection form={form} />
          
          {/* Submission Status Display */}
          <SubmissionStatus
            submissionState={submissionState}
            failedSubmissionSummary={getFailedSubmissionSummary()}
            onRetry={handleRetrySubmission}
            onClearFailed={handleClearFailedSubmission}
          />

          {/* Form validation errors are shown by individual form fields via Zod schema */}
          
          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button 
              type="submit" 
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!form.watch('hotelName')?.trim() || isSubmitting}
            >
              {(() => {                
                if (isSubmitting) return 'Processing...';
                if (!form.watch('hotelName')?.trim()) return 'Enter Hotel Name to Submit';
                return 'Add Property';
              })()}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
