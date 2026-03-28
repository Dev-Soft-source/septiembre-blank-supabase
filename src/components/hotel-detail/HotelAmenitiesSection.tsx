
import React from "react";
import { BankingInfo, LaundryService } from "@/types/hotel/detail";

interface HotelAmenitiesSectionProps {
  bankingInfo?: BankingInfo;
  laundryService?: LaundryService;
  additionalAmenities?: string[];
  specialFeatures?: string[];
  accessibilityFeatures?: string[];
  checkInInstructions?: string | null;
  localRecommendations?: string | null;
  houseRules?: string[];
  cancellationPolicy?: string | null;
}

export function HotelAmenitiesSection({
  bankingInfo,
  laundryService,
  additionalAmenities,
  specialFeatures,
  accessibilityFeatures,
  checkInInstructions,
  localRecommendations,
  houseRules,
  cancellationPolicy
}: HotelAmenitiesSectionProps) {
  const hasContent = bankingInfo || laundryService || additionalAmenities?.length || 
                     specialFeatures?.length || accessibilityFeatures?.length || 
                     checkInInstructions || localRecommendations || houseRules?.length || 
                     cancellationPolicy;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Hotel Amenities & Services</h2>
      
      {/* Laundry Service */}
      {laundryService?.available && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Laundry Service</h3>
          <div className="text-white/80 space-y-1">
            {laundryService.self_service && <p>• Self-service laundry available</p>}
            {laundryService.full_service && <p>• Full-service laundry available</p>}
            {laundryService.external_redirect && (
              <p>• External service: <a href={laundryService.external_redirect} className="text-blue-300 hover:text-blue-200 underline" target="_blank" rel="noopener noreferrer">View Details</a></p>
            )}
            {laundryService.pricing && <p>• Pricing: {laundryService.pricing}</p>}
          </div>
        </div>
      )}

      {/* Additional Amenities */}
      {additionalAmenities && additionalAmenities.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Additional Amenities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {additionalAmenities.map((amenity, index) => (
              <div key={index} className="text-white/80">• {amenity}</div>
            ))}
          </div>
        </div>
      )}

      {/* Special Features */}
      {specialFeatures && specialFeatures.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Special Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {specialFeatures.map((feature, index) => (
              <div key={index} className="text-white/80">• {feature}</div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      {accessibilityFeatures && accessibilityFeatures.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Accessibility Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {accessibilityFeatures.map((feature, index) => (
              <div key={index} className="text-white/80">• {feature}</div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in Instructions */}
      {checkInInstructions && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Check-in Instructions</h3>
          <p className="text-white/80 whitespace-pre-wrap">{checkInInstructions}</p>
        </div>
      )}

      {/* Local Recommendations */}
      {localRecommendations && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Local Recommendations</h3>
          <p className="text-white/80 whitespace-pre-wrap">{localRecommendations}</p>
        </div>
      )}

      {/* House Rules */}
      {houseRules && houseRules.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">House Rules</h3>
          <div className="space-y-1">
            {houseRules.map((rule, index) => (
              <div key={index} className="text-white/80">• {rule}</div>
            ))}
          </div>
        </div>
      )}

      {/* Cancellation Policy */}
      {cancellationPolicy && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Cancellation Policy</h3>
          <p className="text-white/80 whitespace-pre-wrap">{cancellationPolicy}</p>
        </div>
      )}
    </div>
  );
}
