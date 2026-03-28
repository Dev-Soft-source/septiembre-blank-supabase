
import React from "react";
import { formatCurrency } from "@/utils/dynamicPricing";

interface HotelPriceBreakdownProps {
  stayLengths: number[];
  rates: Record<string, number>;
  currency: string;
}

export function HotelPriceBreakdown({ stayLengths, rates, currency }: HotelPriceBreakdownProps) {
  return (
    <div className="bg-fuchsia-950/30 rounded-xl p-4 shadow text-sm text-purple-200 mb-8">
      <p>
        <span className="font-semibold">Stays available:</span> {stayLengths.join(", ").replace(/, ([^,]*)$/, " and $1")} days
      </p>
      <p>
        <span className="font-semibold">Rates:</span> From: {' '}
        {rates ? (
          stayLengths.map(duration => (
            rates[duration] ? 
            `${formatCurrency(rates[duration], currency)} (${duration} days)` : 
            null
          )).filter(Boolean).join(' · ')
        ) : (
          'Rates not available'
        )}
      </p>
    </div>
  );
}
