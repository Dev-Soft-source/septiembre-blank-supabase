import React, { useState, useEffect } from "react";
import { HotelDetailProps } from "@/types/hotel/detail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, Share2, MapPin, Star, Sparkles, Users, Wifi, Car, Coffee, Utensils, Clock, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { useUnifiedTranslations } from "@/hooks/useUnifiedTranslations";
import { useHotelContentTranslation } from "@/hooks/useHotelContentTranslation";
import { HotelLocationMap } from "./HotelLocationMap";
import { AvailabilityPackages } from "./AvailabilityPackages/AvailabilityPackages";
import { MonthlyPriceDisplay } from "./MonthlyPriceDisplay";
import { useMonthlyPriceFromPackages } from "@/hooks/useMonthlyPriceFromPackages";

interface HotelDetailContentProps {
  hotel: HotelDetailProps;
  isLoading?: boolean;
}

export function HotelDetailContentEnhanced({ hotel, isLoading }: HotelDetailContentProps) {
  const { t, language } = useTranslationWithFallback('hotel-detail');
  const { data: hotelFeatureOptions = [] } = useUnifiedTranslations('hotel_features');
  const { data: roomFeatureOptions = [] } = useUnifiedTranslations('room_features');
  const { monthlyPrice: packageMonthlyPrice } = useMonthlyPriceFromPackages(hotel?.id || "", "USD");
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [windowWidth, setWindowWidth] = useState(1024);

  // Use the new hotel content translation hook
  const translatedContent = useHotelContentTranslation({
    ideal_guests: hotel?.ideal_guests,
    atmosphere: hotel?.atmosphere,
    perfect_location: hotel?.perfect_location,
    description: hotel?.description
  });

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Staggered animation
  useEffect(() => {
    if (!isLoading && hotel) {
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((section, index) => {
        setTimeout(() => {
          setVisibleSections(prev => [...prev, section]);
        }, index * 150);
      });
    }
  }, [isLoading, hotel]);

  // Enhanced loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-900/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="space-y-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-8 animate-pulse shadow-lg border border-purple-600/20">
                <div className="h-8 bg-purple-400/30 rounded-lg w-3/4 mb-4"></div>
                <div className="h-64 bg-purple-400/20 rounded-xl mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-purple-400/30 rounded w-full"></div>
                  <div className="h-4 bg-purple-400/30 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-900/30 relative">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Hotel not found</h1>
            <p className="text-white/70">The hotel you're looking for could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const sectionClass = (index: number) => `
    transform transition-all duration-700 ease-out
    ${visibleSections.includes(index) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
  `;

  // Helper functions for dynamic content
  const getMainImage = () => {
    if (hotel.hotel_images?.length > 0) {
      return hotel.hotel_images[0].image_url;
    }
    return hotel.main_image_url || '/placeholder.svg';
  };

  // Helper function to format address without duplication
  const formatAddress = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCountry = (country: string) => {
    if (country.toUpperCase() === 'US') {
      return 'United States';
    }
    return formatAddress(country);
  };

  const getFormattedAddressDisplay = () => {
    const formattedCity = formatAddress(hotel.city);
    const formattedCountry = formatCountry(hotel.country);
    const formattedAddress = hotel.address ? formatAddress(hotel.address) : null;
    
    if (!formattedAddress) {
      return `${formattedCity}, ${formattedCountry}`;
    }
    
    // Check if address already contains city or country to avoid duplication
    const addressLower = formattedAddress.toLowerCase();
    const cityLower = formattedCity.toLowerCase();
    const countryLower = formattedCountry.toLowerCase();
    
    // If address already contains both city and country, return just the address
    if (addressLower.includes(cityLower) && addressLower.includes(countryLower)) {
      return formattedAddress;
    }
    
    // If address contains city but not country
    if (addressLower.includes(cityLower) && !addressLower.includes(countryLower)) {
      return `${formattedAddress}, ${formattedCountry}`;
    }
    
    // If address contains country but not city (unlikely but possible)
    if (!addressLower.includes(cityLower) && addressLower.includes(countryLower)) {
      return `${formattedCity}, ${formattedAddress}`;
    }
    
    // Default: address doesn't contain city or country, show all
    return `${formattedAddress}, ${formattedCity}, ${formattedCountry}`;
  };

  // Function to get only street address without city/country
  const getStreetAddressOnly = () => {
    if (!hotel.address) {
      return '';
    }
    
    const formattedAddress = formatAddress(hotel.address);
    const addressLower = formattedAddress.toLowerCase();
    const cityLower = hotel.city.toLowerCase();
    const countryLower = hotel.country.toLowerCase();
    
    // Remove city and country from address if they exist
    let streetAddress = formattedAddress;
    
    // Remove country first (longer strings first to avoid partial matches)
    if (addressLower.includes(countryLower)) {
      const countryIndex = addressLower.indexOf(countryLower);
      streetAddress = streetAddress.substring(0, countryIndex).trim();
    }
    
    // Remove city
    if (streetAddress.toLowerCase().includes(cityLower)) {
      const cityIndex = streetAddress.toLowerCase().indexOf(cityLower);
      streetAddress = streetAddress.substring(0, cityIndex).trim();
    }
    
    // Clean up any trailing commas or spaces
    streetAddress = streetAddress.replace(/[,\s]+$/, '');
    
    return streetAddress;
  };

  const formatPropertyTypeStayText = () => {
    const propertyType = hotel.property_type || t('detail.hotel');
    const style = hotel.property_style || '';
    const stayLengths = hotel.stay_lengths || [];
    const mealPlans = hotel.meal_plans || [];
    const hasLaundryIncluded = hotel.laundry_service?.available || false;
    
    const lines = [];
    
    // First line
    let firstLine = `Este ${propertyType.toLowerCase()}`;
    if (style) {
      firstLine += ` es de estilo ${style.toLowerCase()}`;
    }
    lines.push(firstLine);
    
    // Second line
    if (stayLengths.length > 0) {
      const lengthsText = stayLengths.join(', ').replace(/, ([^,]*)$/, ' y $1');
      lines.push(`ofrece estancias de ${lengthsText} días`);
    }
    
    // Third line
    if (mealPlans.length > 0 && !mealPlans.some(plan => plan.toLowerCase().includes('solo alojamiento') || plan.toLowerCase().includes('accommodation only'))) {
      lines.push(`con ${mealPlans[0].toLowerCase()}`);
    } else {
      lines.push('con alojamiento');
    }
    
    // Fourth line
    if (hasLaundryIncluded) {
      lines.push('y servicio de lavandería incluido');
    } else {
      lines.push('y servicio de lavandería disponible');
    }
    
    return lines;
  };

  const getProportionalPriceText = () => {
    if (hotel.price_per_month && typeof hotel.price_per_month === 'number') {
      return {
        line1: "El precio mensual",
        line2: "proporcional es de",
        line3: `USD ${hotel.price_per_month.toLocaleString()}`
      };
    }
    return null;
  };

  const getSelectedFeatures = (features: Record<string, boolean> | undefined, type: 'hotel' | 'room') => {
    if (!features) return [];
    const selectedFeatureKeys = Object.entries(features)
      .filter(([_, isSelected]) => isSelected)
      .map(([feature]) => feature);
    // Use unified translation system
    const featureMap = type === 'hotel' ? 
      new Map(hotelFeatureOptions.map(option => [option.value, option.label])) :
      new Map(roomFeatureOptions.map(option => [option.value, option.label]));

    return selectedFeatureKeys.map(feature => {
      // Try to find exact match first
      const exactMatch = featureMap.get(feature.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_'));
      if (exactMatch) return exactMatch;
      
      // Convert Spanish feature to English key and try again
      const englishKey = feature
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_');
      
      const keyMatch = featureMap.get(englishKey);
      return keyMatch || feature; // Fallback to original
    });
  };

  // Updated function to get translated content from our translation hook
  const getTranslatedContent = (fieldName: string): string => {
    return translatedContent[fieldName as keyof typeof translatedContent] || '';
  };

  // Calculate dynamic widths for highlight boxes to balance line count
  const calculateHighlightWidths = (highlights: string[]) => {
    if (highlights.length === 0) return [];
    
    const containerWidth = Math.min(windowWidth - 80, 1200); // Max container width
    const minWidth = 140;
    const maxWidth = 300;
    
    // Calculate text lengths
    const textLengths = highlights.map(text => text.length);
    const totalTextLength = textLengths.reduce((sum, length) => sum + length, 0);
    
    // Find the longest text and calculate its target width
    const maxTextLength = Math.max(...textLengths);
    const longestTextIndex = textLengths.indexOf(maxTextLength);
    
    // Calculate proportional widths
    let widths = textLengths.map(length => {
      const proportion = length / totalTextLength;
      let width = Math.max(minWidth, containerWidth * proportion);
      return Math.min(width, maxWidth);
    });
    
    // Ensure the longest text gets adequate width (target ~4 lines)
    const longestTextTargetWidth = Math.min(maxWidth, Math.max(220, maxTextLength * 2.5));
    widths[longestTextIndex] = longestTextTargetWidth;
    
    // Redistribute remaining space proportionally
    const usedWidth = widths.reduce((sum, width) => sum + width, 0);
    const availableWidth = containerWidth - (highlights.length - 1) * 10; // subtract gaps
    
    if (usedWidth > availableWidth) {
      // Scale down proportionally if total exceeds container
      const scale = availableWidth / usedWidth;
      widths = widths.map(width => Math.max(minWidth, width * scale));
    }
    
    return widths;
  };

  const generateHotelHighlights = () => {
    const highlights = [];

    // Check for custom highlights (for demo pages)
    if (hotel.custom_highlights && hotel.custom_highlights.length > 0) {
      return hotel.custom_highlights;
    }
    // 1. Property type and style - Always visible
    if (hotel.property_type || hotel.property_style) {
      highlights.push(
        t("Type is " + hotel.property_type +' and Style is '+ hotel.property_style)
      );
    } else {
      // Default fallback 
      highlights.push(t('hotelDetail.highlights.defaultProperty'));
    }
    
    // 2. Stay duration - Always visible
    if (hotel.stay_lengths) {
      //const lengths = hotel.stay_lengths.join(` ${t('hotelDetail.and')} `);
      highlights.push(
        t('hotelDetail.highlights.stayDuration', { days: hotel.stay_lengths })
      );
    } else {
      // Default fallback
      highlights.push(t('hotelDetail.highlights.defaultStayDuration'));
    }
    
    // 3. Meal plans/Room type - Always visible
    const mealPlan = hotel.meal_plans;
    if (mealPlan && !mealPlan.includes('solo alojamiento') && !mealPlan.includes('accommodation only') && !mealPlan.includes('room only')) {
      highlights.push(
        t('hotelDetail.highlights.mealPlanIncluded', { plan: "'" + mealPlan + "'"})
      );
    } else {
      highlights.push(t('hotelDetail.highlights.accommodationOnly'));
    }
    
    // 4. Laundry service - Always visible (alternate between included/external for demo)
    const hotelIdNum = parseInt(hotel.id.replace(/\D/g, '')) || 0;
    const hasLaundryIncluded = hotelIdNum % 2 === 0; // Alternate based on hotel ID
    
    if (hasLaundryIncluded) {
      highlights.push(t('hotelDetail.highlights.laundryIncluded'));
    } else {
      highlights.push(t('hotelDetail.highlights.laundryAvailable'));
    }
    
    // 5. Monthly price - Always visible (use package-based calculation)
    if (packageMonthlyPrice && packageMonthlyPrice > 0) {
      highlights.push(
        t('hotelDetail.highlights.monthlyPrice', { 
          price: packageMonthlyPrice.toLocaleString() 
        })
      );
    } else if (hotel.price_per_month && typeof hotel.price_per_month === 'number') {
      // Fallback to old price_per_month only if package calculation fails
      highlights.push(
        t('hotelDetail.highlights.monthlyPrice', { 
          price: hotel.price_per_month.toLocaleString() 
        })
      );
    } else {
      // Default fallback
      highlights.push(t('hotelDetail.highlights.defaultPrice'));
    }
        
    // 6. Affinities - Always visible with safe extraction
    // const affinities = Array.isArray(hotel?.hotel_themes) 
    //   ? hotel.hotel_themes
    //       .filter(themeData => 
    //         themeData && 
    //         typeof themeData === 'object' && 
    //         themeData.themes && 
    //         typeof themeData.themes === 'object' && 
    //         themeData.themes.name && 
    //         typeof themeData.themes.name === 'string'
    //       )
    //       .map(theme => theme.themes?.name)
    //       .filter(Boolean)
    //   : [];
      
    let affinitiesContent = '';
    // if (affinities.length > 0) {
    //   // Format as sentence continuation: all lowercase except when joining with "and"
    //   affinitiesContent = affinities
    //     .map(affinity => affinity?.toLowerCase() || '')
    //     .filter(Boolean)
    //     .join(', ')
    //     .replace(/, ([^,]*)$/, ` ${t('hotelDetail.and')} $1`);
    // } else {
    //   // Default content if no affinities
    //   affinitiesContent = t('hotelDetail.highlights.defaultAffinities');
    // }
    if(hotel?.hotel_themes){
      affinitiesContent = hotel?.hotel_themes.toString();
      highlights.push(`${t('hotelDetail.affinitiesText')} ${affinitiesContent}`);
    }else
      affinitiesContent = t('hotelDetail.highlights.defaultAffinities');
      highlights.push(affinitiesContent);      
    
    // // 7. Activities - Always visible with safe extraction
    // const activities = Array.isArray(hotel?.hotel_activities) 
    //   ? hotel.hotel_activities
    //       .filter(activityData => 
    //         activityData && 
    //         typeof activityData === 'object' && 
    //         activityData.activities && 
    //         typeof activityData.activities === 'object' && 
    //         activityData.activities.name && 
    //         typeof activityData.activities.name === 'string'
    //       )
    //       .map(activity => activity.activities?.name)
    //       .filter(Boolean)
    //   : [];
    // let activitiesContent = '';
    // if (activities.length > 0) {
    //   // Format as sentence continuation: all lowercase except when joining with "and"
    //   activitiesContent = activities
    //     .map(activity => activity?.toLowerCase() || '')
    //     .filter(Boolean)
    //     .join(', ')
    //     .replace(/, ([^,]*)$/, ` ${t('hotelDetail.and')} $1`);
    // } else {
    //   // Default content if no activities
    //   activitiesContent = t('hotelDetail.highlights.defaultActivities');
    // }
    let activitiesContent = "";
    if(hotel?.activities.length > 0 ) {
      hotel.activities.forEach((item,index)=>{
        activitiesContent += item
        if(index < hotel.activities.length - 1)  activitiesContent+=", "
      })
      highlights.push(`${t('hotelDetail.activitiesText')} ${activitiesContent}`);
    }else{      
      activitiesContent = t('hotelDetail.highlights.defaultActivities');
      highlights.push(activitiesContent);
    }      
    
    // Ensure exactly 7 highlights
    return highlights.slice(0, 7);
  };

  return (
    <div className="min-h-screen relative">
      {/* Blue glow background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.1),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
      
      <div className="container mx-auto px-4 py-8 relative z-10 space-y-6">
        
        {/* 1️⃣ IMAGE - Main hotel photo with overlay */}
        <div 
          className={`${sectionClass(0)}`}
          style={{
            background: 'linear-gradient(180deg, #3B6DB3 0%, #1F3A78 50%, #0A0A3B 100%)',
            borderRadius: '1rem',
            padding: '1rem'
          }}
        >
          <div className="relative h-[50vh] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={getMainImage()}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Hotel Name, Stars and Address Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-1.5">
                {/* Hotel Name */}
                <h1 
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    WebkitTextStroke: '1.5px rgba(126, 38, 166, 0.7)',
                    marginBottom: '6px'
                  }}
                >
                  {hotel.name}
                </h1>
                
                {/* Star Rating */}
                {hotel.category && (
                  <div 
                    style={{
                      fontSize: '42px',
                      color: '#D7CC00',
                      textAlign: 'center',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      marginBottom: '6px'
                    }}
                  >
                    {"★".repeat(Math.min(hotel.category, 5))}
                  </div>
                )}
                
                {/* Street Address Only */}
                {getStreetAddressOnly() && (
                  <p 
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      marginBottom: '8px'
                    }}
                  >
                    {getStreetAddressOnly()}
                  </p>
                )}
                
                {/* City - Country */}
                <p 
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {formatAddress(hotel.city)} - {formatCountry(hotel.country)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2️⃣ HOTEL HIGHLIGHTS SECTION */}
        <div className={`${sectionClass(1)}`}>
          {(() => {
            const highlights = generateHotelHighlights();
            const widths = calculateHighlightWidths(highlights);
            
            return (
              <div 
                className="hotel-highlights-container"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexWrap: 'nowrap',
                  gap: '10px'
                }}
              >
                {highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="text-center"
                    style={{
                      background: '#6C1395',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      flex: '1 1 auto',
                      minWidth: `${widths[index] || 140}px`,
                      maxWidth: '300px',
                      width: `${widths[index] || 140}px`,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}
                  >
                    {/* Green check icon centered on top */}
                    <div 
                      className="flex justify-center"
                      style={{ marginBottom: '5px' }}
                    >
                      <CheckCircle 
                        className="w-5 h-5" 
                        style={{ color: '#22c55e' }}
                      />
                    </div>
                    
                    {/* Text centered below icon */}
                    <p 
                      style={{
                        fontSize: `${Math.max(14, Math.min(18, 18 - Math.max(0, highlights.length - 4)))}px`,
                        fontWeight: '500',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        lineHeight: '1.3',
                        margin: '0',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}
                    >
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* 3️⃣ THREE DESCRIPTION BOXES - Always show all three */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${sectionClass(2)}`}>
          {/* Ideal for guests who */}
          <div className="bg-[#6C1395] break-words backdrop-blur-sm rounded-2xl p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20">
            <h3 className="text-base font-semibold text-purple-200 mb-2">
              {t('hotelDetail.idealForGuests')}
            </h3>
            <p className="text-base text-white leading-relaxed">
              {getTranslatedContent('ideal_guests') || t('hotelDetail.highlights.defaultIdealGuests')}
            </p>
          </div>
          
          {/* The atmosphere is */}
          <div className="bg-[#6C1395]  break-words backdrop-blur-sm rounded-2xl p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20">
            <h3 className="text-base font-semibold text-purple-200 mb-2">
              {t('hotelDetail.atmosphere')}
            </h3>
            <p className="text-base text-white leading-relaxed">
              {getTranslatedContent('atmosphere') || t('hotelDetail.highlights.defaultAtmosphere')}
            </p>
          </div>
          
          {/* The location is perfect for */}
          <div className="bg-[#6C1395]  break-words backdrop-blur-sm rounded-2xl p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20">
            <h3 className="text-base font-semibold text-purple-200 mb-2">
              {t('hotelDetail.perfectLocation')}
            </h3>
            <p className="text-base text-white leading-relaxed">
              {getTranslatedContent('perfect_location') || t('hotelDetail.highlights.defaultPerfectLocation')}
            </p>
          </div>
        </div>

        {/* 4️⃣ ABOUT OUR HOTEL DESCRIPTION - Always show */}
        <div className={`bg-[#6C1395] backdrop-blur-sm rounded-2xl p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20 ${sectionClass(3)}`}>
          <p className="text-base text-white leading-relaxed break-words overflow-wrap-anywhere">
            {getTranslatedContent('description') || t('hotelDetail.highlights.defaultDescription')}
          </p>
        </div>

        {/* 5️⃣ THREE-COLUMN LAYOUT: Hotel Features | Google Map | Room Features */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${sectionClass(4)}`}>
          {/* Left: Hotel Features */}
          {getSelectedFeatures(hotel.features_hotel, 'hotel').length > 0 && (
            <div className="bg-[#6C1395] backdrop-blur-sm rounded-2xl p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20">
              <h3 className="text-base font-bold text-white mb-3 text-center">
                {t('hotelDetail.hotelFeatures')}
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {getSelectedFeatures(hotel.features_hotel, 'hotel').slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="capitalize text-sm">{index + 1} : {hotel.features_hotel[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Center: Location */}
          {(hotel.city || hotel.country) && (
            <div className="bg-white rounded-2xl p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20">
              <h2 className="text-base font-bold text-gray-800 mb-3 text-center">{t('hotelDetail.location')}</h2>
              <HotelLocationMap
                address={hotel.address}
                city={hotel.city}
                country={hotel.country}
                latitude={typeof hotel.latitude === 'number' ? hotel.latitude : undefined}
                longitude={typeof hotel.longitude === 'number' ? hotel.longitude : undefined}
                hotelName={hotel.name}
              />
            </div>
          )}

          {/* Right: Room Features */}
          <div className="bg-[#6C1395] backdrop-blur-sm rounded-2xl break-words p-4 shadow-[0_8px_25px_rgba(59,130,246,0.25),0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] border border-blue-400/20">
            <h3 className="text-base font-bold text-white mb-3 text-center">
              {t('hotelDetail.roomFeatures')}
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {getSelectedFeatures(hotel.features_room, 'room').length > 0 ? 
                getSelectedFeatures(hotel.features_room, 'room').slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="capitalize text-sm">{index + 1} : {hotel.features_room[index]}</span>
                  </div>
                )) : (
                  <div className="text-center text-white/70 text-sm">
                    <p>{hotel.amenities}</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>

        {/* 6️⃣ AVAILABILITY PACKAGES */}
        <div className={`${sectionClass(5)}`}>
          <AvailabilityPackages 
            hotelId={hotel.id} 
            hotelName={hotel.name} 
            pricePerMonth={hotel.price_per_month}
            pricingMatrix={(hotel as any).pricingmatrix || (hotel as any).pricingMatrix || []}
            hotelCategory={hotel.category || 3}
          />
        </div>

        {/* PROPORTIONAL NOTE AT BOTTOM */}
        <div className="text-center text-sm text-purple-200 mt-8">
          {t('hotelDetail.proportionalNote')}
        </div>

      </div>
    </div>
  );
}