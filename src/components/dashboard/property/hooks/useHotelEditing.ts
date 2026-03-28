
import { useEffect } from "react";
import { useHotelDetail } from "@/hooks/useHotelDetail";
import { PropertyFormData } from "./usePropertyFormData";

interface UseHotelEditingProps {
  editingHotelId?: string | null;
  setFormData: (updater: (prev: PropertyFormData) => PropertyFormData) => void;
  setCurrentStep: (step: number) => void;
}

export const useHotelEditing = ({ 
  editingHotelId, 
  setFormData, 
  setCurrentStep 
}: UseHotelEditingProps) => {
  const { data: hotelData, isLoading } = useHotelDetail(editingHotelId);

  useEffect(() => {
    if (editingHotelId && hotelData && !isLoading) {
      console.log("Loading hotel data for editing:", hotelData);
      console.log("Hotel themes raw data:", hotelData.hotel_themes);
      console.log("Hotel activities raw data:", (hotelData as any).hotel_activities);
      
      // Extract theme IDs correctly - they should be direct theme_id values
      const themes = Array.isArray(hotelData.hotel_themes)
//        ? hotelData.hotel_themes.map(ht => ht.theme_id).filter(Boolean)
        ? hotelData.hotel_themes.map(ht => ht).filter(Boolean)
        : [];
      console.log("Extracted theme IDs:", themes);
      
      // Extract activity IDs correctly - they should be direct activity_id values  
      const activities = (hotelData as any).hotel_activities?.map((ha: any) => ha.activity_id).filter(Boolean) || [];
      console.log("Extracted activity IDs:", activities);

      console.log("Dynamic pricing values:", {
        enablePriceIncrease: hotelData.enablePriceIncrease,
        enable_price_increase: hotelData.enable_price_increase,
        priceIncreaseCap: hotelData.priceIncreaseCap,
        price_increase_cap: hotelData.price_increase_cap
      });

      setFormData(prev => ({
        ...prev,
        hotelName: hotelData.name || '',
        description: hotelData.description || '',
        country: hotelData.country || '',
        city: hotelData.city || '',
        address: hotelData.address || '',
        // Use snake_case version if available, fallback to empty string
        postalCode: (hotelData as any).postal_code || '',
        latitude: hotelData.latitude || null,
        longitude: hotelData.longitude || null,
        category: hotelData.category?.toString() || '',
        propertyType: hotelData.property_type || '',
        style: hotelData.property_style || '',
        // Use camelCase properties that exist in HotelDetailProps
        idealGuests: hotelData.idealGuests || (hotelData as any).ideal_guests || '',
        atmosphere: hotelData.atmosphere || '',
        perfectLocation: hotelData.perfectLocation || (hotelData as any).perfect_location || '',
        // Contact info might not be in HotelDetailProps, use type assertion
        contactName: (hotelData as any).contact_name || '',
        contactEmail: (hotelData as any).contact_email || '',
        contactPhone: (hotelData as any).contact_phone || '',
        stayLengths: hotelData.stay_lengths || [],
        mealPlans: hotelData.meal_plans || [],
        roomTypes: hotelData.room_types || [],
        // FAQs might not be in HotelDetailProps, use type assertion
        faqs: (hotelData as any).faqs || [],
        terms: hotelData.terms || '',
        preferredWeekday: hotelData.preferredWeekday || 'Monday',
        featuresHotel: hotelData.features_hotel || {},
        featuresRoom: hotelData.features_room || {},
        available_months: hotelData.available_months || [],
        rates: hotelData.rates || {},
        mainImageUrl: hotelData.main_image_url || '',
        // Load dynamic pricing values - try both camelCase and snake_case
        enablePriceIncrease: hotelData.enablePriceIncrease ?? hotelData.enable_price_increase ?? false,
        priceIncreaseCap: hotelData.priceIncreaseCap ?? hotelData.price_increase_cap ?? 20,
        // Use the corrected theme and activity IDs
        themes: themes,
        activities: activities,
        hotelImages: hotelData.hotel_images?.map(img => ({
          id: img.id,
          url: img.image_url,
          isMain: img.is_main
        })) || []
      }));

      console.log("Form data themes set to:", themes);
      console.log("Form data activities set to:", activities);

      setCurrentStep(1);
    }
  }, [editingHotelId, hotelData, isLoading, setFormData, setCurrentStep]);

  return { isLoading };
};
