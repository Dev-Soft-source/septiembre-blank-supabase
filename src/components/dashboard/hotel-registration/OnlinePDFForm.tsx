// @ts-nocheck  
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, FileText, Save, Send } from 'lucide-react';
import { generateCompletedFormPDF } from '@/utils/pdfFormGenerator';
import { useThemesWithTranslations } from '@/hooks/useThemesWithTranslations';
import { useActivitiesDataWithLanguage } from '@/hooks/useActivitiesDataWithLanguage';

interface OnlinePDFFormProps {
  onClose?: () => void;
}

interface PDFFormData {
  // Basic Information
  hotel_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  
  // Classification and Property Details
  classification: number;
  property_type: string;
  property_style: string;
  
  // Descriptions
  hotel_description: string;
  room_description: string;
  ideal_guests: string;
  atmosphere: string;
  perfect_location: string;
  
  // Features and Activities
  hotel_features: string[];
  room_features: string[];
  client_affinities: string[];
  activities: string[];
  
  // Services
  meal_plan: string;
  laundry_service: string;
  
  // Availability
  stay_lengths: number[];
  check_in_day: string;
  
  // Availability packages
  availability_packages: Array<{
    start_date: string;
    end_date: string;
    rooms: number;
  }>;
  
  // Pricing matrix
  pricing_matrix: {
    [key: string]: { double: number; single: number };
  };
  
  // Terms and signature
  terms_accepted: boolean;
  signature_name: string;
  signature_position: string;
  signature_date: string;
}

export const OnlinePDFForm: React.FC<OnlinePDFFormProps> = ({ onClose }) => {
  const { t, language } = useTranslation('dashboard/hotel-registration');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [availabilityPackages, setAvailabilityPackages] = useState<Array<{
    start_date: string;
    end_date: string;
    rooms: number;
  }>>([]);
  
  // Fetch real data from database
  const { data: themes = [], isLoading: themesLoading } = useThemesWithTranslations();
  const { data: activities = [], isLoading: activitiesLoading } = useActivitiesDataWithLanguage();

  const form = useForm<PDFFormData>({
    defaultValues: {
      hotel_name: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
      contact_email: '',
      contact_phone: '',
      classification: 3,
      property_type: '',
      property_style: '',
      hotel_description: '',
      room_description: '',
      ideal_guests: '',
      atmosphere: '',
      perfect_location: '',
      hotel_features: [],
      room_features: [],
      client_affinities: [],
      activities: [],
      meal_plan: '',
      laundry_service: '',
      stay_lengths: [],
      check_in_day: '',
      availability_packages: [],
      pricing_matrix: {},
      terms_accepted: false,
      signature_name: '',
      signature_position: '',
      signature_date: new Date().toISOString().split('T')[0]
    }
  });

  const watchedStayLengths = form.watch('stay_lengths');

  // Options data
  const propertyTypes = [
    { value: 'hotel', label: t('propertyType.hotel', 'Hotel') },
    { value: 'boutique_hotel', label: t('propertyType.boutiqueHotel', 'Boutique Hotel') },
    { value: 'resort', label: t('propertyType.resort', 'Resort') },
    { value: 'rural_house', label: t('propertyType.ruralHouse', 'Rural House') },
    { value: 'hostel', label: t('propertyType.hostel', 'Hostel') }
  ];

  const propertyStyles = [
    { value: 'classic', label: t('propertyStyle.classic', 'Classic') },
    { value: 'classic_elegant', label: t('propertyStyle.classicElegant', 'Classic Elegant') },
    { value: 'modern', label: t('propertyStyle.modern', 'Modern') },
    { value: 'fusion', label: t('propertyStyle.fusion', 'Fusion') },
    { value: 'urban', label: t('propertyStyle.urban', 'Urban') },
    { value: 'rural', label: t('propertyStyle.rural', 'Rural') },
    { value: 'minimalist', label: t('propertyStyle.minimalist', 'Minimalist') },
    { value: 'luxury', label: t('propertyStyle.luxury', 'Luxury') }
  ];

  const mealPlans = [
    { value: 'room_only', label: t('mealPlans.roomOnly', 'Room Only') },
    { value: 'breakfast', label: t('mealPlans.breakfast', 'Breakfast Included') },
    { value: 'half_board', label: t('mealPlans.halfBoard', 'Half Board') },
    { value: 'full_board', label: t('mealPlans.fullBoard', 'Full Board') },
    { value: 'all_inclusive', label: t('mealPlans.allInclusive', 'All Inclusive') }
  ];

  const laundryOptions = [
    { value: 'included', label: t('pdfForm.laundryIncluded', 'Included in price') },
    { value: 'external', label: t('pdfForm.laundryExternal', 'Not included. Can redirect to external service') }
  ];

  const stayLengthOptions = [8, 15, 22, 29];
  
  const weekdays = [
    { value: 'monday', label: t('checkInDay.monday', 'Monday') },
    { value: 'tuesday', label: t('checkInDay.tuesday', 'Tuesday') },
    { value: 'wednesday', label: t('checkInDay.wednesday', 'Wednesday') },
    { value: 'thursday', label: t('checkInDay.thursday', 'Thursday') },
    { value: 'friday', label: t('checkInDay.friday', 'Friday') },
    { value: 'saturday', label: t('checkInDay.saturday', 'Saturday') },
    { value: 'sunday', label: t('checkInDay.sunday', 'Sunday') }
  ];

  // Extract data from database responses
  const hotelFeatures = [
    { id: 'wifi', name: t('hotelFeatures.wifi', 'Wi-Fi') },
    { id: 'pool', name: t('hotelFeatures.pool', 'Swimming Pool') },
    { id: 'gym', name: t('hotelFeatures.gym', 'Fitness Center') },
    { id: 'spa', name: t('hotelFeatures.spa', 'Spa') },
    { id: 'restaurant', name: t('hotelFeatures.restaurant', 'Restaurant') },
    { id: 'bar', name: t('hotelFeatures.bar', 'Bar') },
    { id: 'business_center', name: t('hotelFeatures.businessCenter', 'Business Center') },
    { id: 'meeting_rooms', name: t('hotelFeatures.meetingRooms', 'Meeting Rooms') },
    { id: 'laundry', name: t('hotelFeatures.laundry', 'Laundry Service') },
    { id: 'room_service', name: t('hotelFeatures.roomService', 'Room Service') },
    { id: 'concierge', name: t('hotelFeatures.concierge', 'Concierge Service') },
    { id: 'parking', name: t('hotelFeatures.parking', 'Parking') },
    { id: 'elevator', name: t('hotelFeatures.elevator', 'Elevator') },
    { id: 'reception_24h', name: t('hotelFeatures.reception24h', '24h Reception') },
    { id: 'garden', name: t('hotelFeatures.garden', 'Garden') },
    { id: 'terrace', name: t('hotelFeatures.terrace', 'Terrace') },
    { id: 'conference_room', name: t('hotelFeatures.conferenceRoom', 'Conference Room') },
    { id: 'luggage_storage', name: t('hotelFeatures.luggageStorage', 'Luggage Storage') }
  ];
  
  const roomFeatures = [
    { id: 'air_conditioning', name: t('roomFeatures.airConditioning', 'Air Conditioning') },
    { id: 'heating', name: t('roomFeatures.heating', 'Heating') },
    { id: 'balcony', name: t('roomFeatures.balcony', 'Balcony') },
    { id: 'kitchenette', name: t('roomFeatures.kitchenette', 'Kitchenette') },
    { id: 'minibar', name: t('roomFeatures.minibar', 'Minibar') },
    { id: 'safe', name: t('roomFeatures.safe', 'Safe') },
    { id: 'tv', name: t('roomFeatures.tv', 'Television') },
    { id: 'desk', name: t('roomFeatures.desk', 'Work Desk') },
    { id: 'wardrobe', name: t('roomFeatures.wardrobe', 'Wardrobe') },
    { id: 'private_bathroom', name: t('roomFeatures.privateBathroom', 'Private Bathroom') },
    { id: 'hair_dryer', name: t('roomFeatures.hairDryer', 'Hair Dryer') },
    { id: 'iron', name: t('roomFeatures.iron', 'Iron') },
    { id: 'coffee_maker', name: t('roomFeatures.coffeeMaker', 'Coffee Maker') },
    { id: 'blackout_curtains', name: t('roomFeatures.blackoutCurtains', 'Blackout Curtains') },
    { id: 'city_view', name: t('roomFeatures.cityView', 'City View') },
    { id: 'sea_view', name: t('roomFeatures.seaView', 'Sea View') },
    { id: 'mountain_view', name: t('roomFeatures.mountainView', 'Mountain View') },
    { id: 'garden_view', name: t('roomFeatures.gardenView', 'Garden View') }
  ];
  
  const clientAffinities = themes || [];
  const availableActivities = activities || [];

  const addAvailabilityPackage = () => {
    if (availabilityPackages.length < 10) {
      setAvailabilityPackages([...availabilityPackages, { start_date: '', end_date: '', rooms: 1 }]);
    }
  };

  const updateAvailabilityPackage = (index: number, field: string, value: any) => {
    const updated = [...availabilityPackages];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilityPackages(updated);
    form.setValue('availability_packages', updated);
  };

  const removeAvailabilityPackage = (index: number) => {
    const updated = availabilityPackages.filter((_, i) => i !== index);
    setAvailabilityPackages(updated);
    form.setValue('availability_packages', updated);
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const formData = form.getValues();
      
      const { error } = await supabase.from('pdf_form_submissions').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...formData,
        status: 'draft',
        language_code: language,
        submission_method: 'online_form'
      });

      if (error) throw error;
      toast.success(t('pdfForm.draftSaved', 'Draft saved successfully'));
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(t('pdfForm.saveFailed', 'Failed to save draft'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: PDFFormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from('pdf_form_submissions').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...data,
        status: 'pending',
        language_code: language,
        submission_method: 'online_form'
      });

      if (error) throw error;
      
      toast.success(t('pdfForm.submissionSuccess', 'Form submitted successfully'));
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('pdfForm.submissionError', 'Failed to submit form'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const formData = form.getValues();
      generateCompletedFormPDF(formData, language as 'es' | 'en');
      toast.success(t('pdfForm.pdfGenerated', 'PDF generated successfully'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('pdfForm.pdfError', 'Failed to generate PDF'));
    }
  };

  const sections = [
    { title: t('pdfForm.basicInfo', 'Basic Information'), key: 'basic' },
    { title: t('pdfForm.classification', 'Classification & Property'), key: 'classification' },
    { title: t('pdfForm.descriptions', 'Descriptions'), key: 'descriptions' },
    { title: t('pdfForm.features', 'Features & Activities'), key: 'features' },
    { title: t('pdfForm.services', 'Services'), key: 'services' },
    { title: t('pdfForm.availability', 'Availability'), key: 'availability' },
    { title: t('pdfForm.pricing', 'Pricing'), key: 'pricing' },
    { title: t('pdfForm.terms', 'Terms & Signature'), key: 'terms' }
  ];

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="hotel_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.hotelName', 'Hotel Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/10 border-white/30 text-white placeholder:text-white/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.address', 'Complete Address')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-white/10 border-white/30 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t('pdfForm.city', 'City')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 border-white/30 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t('pdfForm.postalCode', 'Postal Code')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 border-white/30 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t('pdfForm.country', 'Country')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 border-white/30 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t('pdfForm.email', 'Contact Email')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="bg-white/10 border-white/30 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.phone', 'Contact Phone')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/10 border-white/30 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1: // Classification & Property
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.classification', 'Hotel Classification (1★ to 5★)')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      className="flex space-x-4"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                          <label htmlFor={`rating-${rating}`} className="text-white">
                            {'★'.repeat(rating)}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.propertyType', 'Property Type')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder={t('pdfForm.selectPropertyType', 'Select property type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.propertyStyle', 'Property Style')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder={t('pdfForm.selectPropertyStyle', 'Select property style')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2: // Descriptions
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="hotel_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.hotelDescription', 'Hotel Description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-white/10 border-white/30 text-white min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.roomDescription', 'Room Description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-white/10 border-white/30 text-white min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ideal_guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.idealGuests', 'Ideal for guests who...')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/10 border-white/30 text-white" 
                           placeholder={t('pdfForm.idealGuestsPlaceholder', 'seek adventure, families, business travelers')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="atmosphere"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.atmosphere', 'The atmosphere is...')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/10 border-white/30 text-white" 
                           placeholder={t('pdfForm.atmospherePlaceholder', 'relaxing, vibrant, peaceful, luxurious')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="perfect_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.perfectLocation', 'Our location is perfect for...')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/10 border-white/30 text-white" 
                           placeholder={t('pdfForm.perfectLocationPlaceholder', 'stunning views, city center access, beach proximity')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3: // Features & Activities
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="hotel_features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-semibold">{t('hotelFeatures.title', 'Hotel Features')}</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto bg-white/5 p-4 rounded-lg">
                      {hotelFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`hotel-feature-${feature.id}`}
                            checked={field.value?.includes(feature.name)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = field.value || [];
                              if (checked) {
                                field.onChange([...currentFeatures, feature.name]);
                              } else {
                                field.onChange(currentFeatures.filter(f => f !== feature.name));
                              }
                            }}
                          />
                          <label htmlFor={`hotel-feature-${feature.id}`} className="text-white text-sm">
                            {feature.name}
                          </label>
                        </div>
                      ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-semibold">{t('roomFeatures.title', 'Room Features')}</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto bg-white/5 p-4 rounded-lg">
                      {roomFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`room-feature-${feature.id}`}
                            checked={field.value?.includes(feature.name)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = field.value || [];
                              if (checked) {
                                field.onChange([...currentFeatures, feature.name]);
                              } else {
                                field.onChange(currentFeatures.filter(f => f !== feature.name));
                              }
                            }}
                          />
                          <label htmlFor={`room-feature-${feature.id}`} className="text-white text-sm">
                            {feature.name}
                          </label>
                        </div>
                      ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_affinities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-semibold">{t('clientAffinities.title', 'Client Affinities')}</FormLabel>
                  <p className="text-white/70 text-sm mb-4">{t('clientAffinities.informativeText', 'We have preselected general affinities that do not require hotel involvement to help you complete this step quickly.')}</p>
                  {themesLoading ? (
                    <div className="text-white/70">{t('clientAffinities.loading', 'Loading client types...')}</div>
                  ) : (
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto bg-white/5 p-4 rounded-lg">
                      {clientAffinities.map((affinity) => (
                        <div key={affinity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`affinity-${affinity.id}`}
                            checked={field.value?.includes(affinity.name)}
                            onCheckedChange={(checked) => {
                              const currentAffinities = field.value || [];
                              if (checked) {
                                field.onChange([...currentAffinities, affinity.name]);
                              } else {
                                field.onChange(currentAffinities.filter(a => a !== affinity.name));
                              }
                            }}
                          />
                          <label htmlFor={`affinity-${affinity.id}`} className="text-white text-sm">
                            {affinity.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg font-semibold">{t('activities.title', 'Activities')}</FormLabel>
                  <p className="text-white/70 text-sm mb-4">{t('activities.informativeText', 'Please select at least 4 activities for your hotel.')}</p>
                  {activitiesLoading ? (
                    <div className="text-white/70">{t('activities.loading', 'Loading activities...')}</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto bg-white/5 p-4 rounded-lg">
                      {availableActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`activity-${activity.id}`}
                            checked={field.value?.includes(activity.name)}
                            onCheckedChange={(checked) => {
                              const currentActivities = field.value || [];
                              if (checked) {
                                field.onChange([...currentActivities, activity.name]);
                              } else {
                                field.onChange(currentActivities.filter(a => a !== activity.name));
                              }
                            }}
                          />
                          <label htmlFor={`activity-${activity.id}`} className="text-white text-sm">
                            {activity.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4: // Services
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="meal_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.mealPlan', 'Meal Plan')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder={t('pdfForm.selectMealPlan', 'Select meal plan')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mealPlans.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="laundry_service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.laundryService', 'Laundry Service')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder={t('pdfForm.selectLaundryService', 'Select laundry service')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {laundryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5: // Availability
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="stay_lengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.stayLengths', 'Stay Lengths Available')}</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stayLengthOptions.map((length) => (
                      <div key={length} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stay-length-${length}`}
                          checked={field.value?.includes(length)}
                          onCheckedChange={(checked) => {
                            const currentLengths = field.value || [];
                            if (checked) {
                              field.onChange([...currentLengths, length]);
                            } else {
                              field.onChange(currentLengths.filter(l => l !== length));
                            }
                          }}
                        />
                        <label htmlFor={`stay-length-${length}`} className="text-white text-sm">
                          {length} {t('pdfForm.days', 'days')}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_in_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.checkInDay', 'Preferred Check-in Day')}</FormLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {weekdays.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={day.value} id={`day-${day.value}`} />
                        <label htmlFor={`day-${day.value}`} className="text-white text-sm">
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-white">{t('pdfForm.availabilityPackages', 'Availability Packages')}</FormLabel>
                {availabilityPackages.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAvailabilityPackage}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {t('pdfForm.addPackage', 'Add Package')}
                  </Button>
                )}
              </div>
              
              {availabilityPackages.map((pkg, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-white/5 rounded-lg">
                  <Input
                    type="date"
                    value={pkg.start_date}
                    onChange={(e) => updateAvailabilityPackage(index, 'start_date', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                    placeholder={t('pdfForm.startDate', 'Start Date')}
                  />
                  <Input
                    type="date"
                    value={pkg.end_date}
                    onChange={(e) => updateAvailabilityPackage(index, 'end_date', e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                    placeholder={t('pdfForm.endDate', 'End Date')}
                  />
                  <Input
                    type="number"
                    min="1"
                    value={pkg.rooms}
                    onChange={(e) => updateAvailabilityPackage(index, 'rooms', parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/30 text-white"
                    placeholder={t('pdfForm.rooms', 'Rooms')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAvailabilityPackage(index)}
                    className="border-red-400 text-red-400 hover:bg-red-400/10"
                  >
                    {t('pdfForm.remove', 'Remove')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Pricing
        return (
          <div className="space-y-6">
            <FormLabel className="text-white text-lg">{t('pdfForm.pricingMatrix', 'Pricing Matrix (EUR per person)')}</FormLabel>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-white/30 p-3 text-white bg-white/10">
                      {t('pdfForm.stayLength', 'Stay Length')}
                    </th>
                    <th className="border border-white/30 p-3 text-white bg-white/10">
                      {t('pdfForm.doubleRoom', 'Double Room')}
                    </th>
                    <th className="border border-white/30 p-3 text-white bg-white/10">
                      {t('pdfForm.singleRoom', 'Single Room')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {watchedStayLengths?.map((length) => (
                    <tr key={length}>
                      <td className="border border-white/30 p-3 text-white bg-white/5">
                        {length} {t('pdfForm.days', 'days')}
                      </td>
                      <td className="border border-white/30 p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-white/10 border-white/30 text-white"
                          value={form.watch(`pricing_matrix.${length}.double`) || ''}
                          onChange={(e) => {
                            const currentMatrix = form.getValues('pricing_matrix') || {};
                            form.setValue(`pricing_matrix.${length}.double`, parseFloat(e.target.value) || 0);
                          }}
                        />
                      </td>
                      <td className="border border-white/30 p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-white/10 border-white/30 text-white"
                          value={form.watch(`pricing_matrix.${length}.single`) || ''}
                          onChange={(e) => {
                            const currentMatrix = form.getValues('pricing_matrix') || {};
                            form.setValue(`pricing_matrix.${length}.single`, parseFloat(e.target.value) || 0);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!watchedStayLengths || watchedStayLengths.length === 0) && (
              <p className="text-white/60 text-sm">
                {t('pdfForm.selectStayLengthsFirst', 'Please select stay lengths in the Availability section first.')}
              </p>
            )}
          </div>
        );

      case 7: // Terms & Signature
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="terms_accepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      {t('pdfForm.acceptTerms', 'I accept the terms and conditions')}
                    </FormLabel>
                     <p className="text-white/60 text-sm">
                       {t('pdfForm.termsDescription', 'By checking this box, you agree to our terms of service and privacy policy. Send to: contact@hotel-living.com')}
                     </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="signature_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t('pdfForm.signatureName', 'Full Name')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 border-white/30 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signature_position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t('pdfForm.signaturePosition', 'Position/Title')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/10 border-white/30 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="signature_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('pdfForm.signatureDate', 'Date')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="bg-white/10 border-white/30 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return (
          <div className="text-white text-center py-8">
            <p>{t('pdfForm.sectionInProgress', 'Section in progress...')}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full p-2 md:p-4 lg:p-6">
      <div className="bg-[#7E00B3]/90 backdrop-blur-sm rounded-lg text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white glow">
                {t('pdfForm.title', 'Hotel Registration Form')}
              </h1>
              <p className="text-white/80 mt-2 text-lg">
                {t('pdfForm.subtitle', 'Complete this form online and download your PDF copy')}
              </p>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                ✕
              </Button>
            )}
          </div>
          
          {/* Section Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {sections.map((section, index) => (
                <button
                  key={section.key}
                  onClick={() => setCurrentSection(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    index === currentSection
                      ? 'bg-[#70009E] text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-white/20 rounded-full h-2">
            <div
              className="bg-[#70009E] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8" style={{ minHeight: '600px' }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="min-h-[400px]">
                {renderSection()}
              </div>

              {/* Navigation and actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-white/30">
                <div className="flex gap-2">
                  {currentSection > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      {t('pdfForm.previous', 'Previous')}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t('pdfForm.saveDraft', 'Save Draft')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('pdfForm.downloadPDF', 'Download PDF')}
                  </Button>

                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                      className="bg-[#70009E] hover:bg-[#70009E]/80 text-white"
                    >
                      {t('pdfForm.next', 'Next')}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#70009E] hover:bg-[#70009E]/80 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting 
                        ? t('pdfForm.submitting', 'Submitting...') 
                        : t('pdfForm.submitForm', 'Submit Form')
                      }
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};