
import { format } from "date-fns";
import { formatCurrency } from "@/utils/dynamicPricing";
import { roundPriceUp } from "@/utils/pricingRules";

interface BookingSummaryCardProps {
  startDate: Date;
  endDate: Date;
  duration: number;
  dynamicPrice: number;
}

export function BookingSummaryCard({ startDate, endDate, duration, dynamicPrice }: BookingSummaryCardProps) {
  const roundedPrice = roundPriceUp(dynamicPrice);
  const tenPercent = roundedPrice * 0.1;
  return (
    <div className="rounded-lg bg-[#5C088F] p-4 text-white">
      <div className="flex justify-between mb-2">
        <span className="text-fuchsia-200">Check-in</span>
        <span>{format(startDate, "MMM d, yyyy")}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-fuchsia-200">Check-out</span>
        <span>{format(endDate, "MMM d, yyyy")}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-fuchsia-200">Duration</span>
        <span>{duration} days</span>
      </div>
      <div className="border-t border-fuchsia-900 my-2 pt-2"></div>
      <div className="flex justify-between font-bold">
        <span>Total price</span>
        <span className="text-gradient">{formatCurrency(roundedPrice)}</span>
      </div>
      <div className="flex justify-between font-bold mt-1">
        <span>Just pay 10% now</span>
        <span className="text-gradient">{formatCurrency(tenPercent)}</span>
      </div>
    </div>
  );
}

