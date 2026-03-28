
import React from "react";
import { formatCurrency } from "@/utils/dynamicPricing";
import { parseRatesData, calculateLowestMonthlyRatePerPerson } from "../utils/ratesParser";
import { useTranslatedPricing } from "@/hooks/useTranslatedSystem";
import { formatHotelPrice, calculateMonthlyFromPackages } from "@/utils/hotelPricing";
import { useMonthlyPriceFromPackages } from "@/hooks/useMonthlyPriceFromPackages";

interface HotelCardPriceProps {
  rates?: Record<string, number>;
  pricePerMonth?: number;
  currency: string;
  hotelId?: string;
}

export const HotelCardPrice: React.FC<HotelCardPriceProps> = ({
  rates,
  pricePerMonth,
  currency = "USD",
  hotelId
}) => {
  const { formatPrice, priceOnRequest } = useTranslatedPricing();
  
  // Get monthly price calculated from actual packages
  const { formattedPrice: packageBasedPrice, hasPackages } = useMonthlyPriceFromPackages(
    hotelId || '', 
    "USD" // Use USD as currency for packages
  );
  // Display rates using EXCLUSIVELY package-based calculation
  const displayRates = () => {
    // Use ONLY package-based calculation - no fallbacks to old rates system
    if (hasPackages && packageBasedPrice !== "Price on request") {
      return packageBasedPrice;
    }
    
    // If no packages available, show price on request
    return priceOnRequest();
  };

  const formatPriceDisplay = () => {
    const fullPrice = displayRates();
    
    if (fullPrice === "Price on request" || fullPrice.includes("Price on request")) {
      return {
        price: "Price on request",
        suffix: ""
      };
    }
    
    // Split the price from "per month" to avoid duplication
    const parts = fullPrice.split(' per month');
    return {
      price: parts[0], // e.g., "From €1,320.00"
      suffix: parts.length > 1 ? "per month" : "" // Only show if present in original
    };
  };

  const { price, suffix } = formatPriceDisplay();

  return (
    <div className="text-center text-white">
      <div className="text-lg font-bold">
        {price}
      </div>
      {suffix && (
        <div className="text-sm text-white/90 mt-1">
          {suffix}
        </div>
      )}
    </div>
  );
};
