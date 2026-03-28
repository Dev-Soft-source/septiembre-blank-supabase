
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DynamicPricingBarProps {
  nightsSold: number;
  totalNights: number;
  priceIncrease: number;
}

export function DynamicPricingBar({ nightsSold, totalNights, priceIncrease }: DynamicPricingBarProps) {
  return (
    <div className="rounded-lg bg-[#5C088F] p-3 border border-fuchsia-800/30">
      <div className="flex items-center justify-between text-sm text-fuchsia-200 mb-1">
        <span>Dynamic pricing</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <Info className="w-4 h-4 ml-1 text-fuchsia-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-[#5C088F] font-semibold">
              This property utilizes dynamic pricing based on real-time demand. As availability decreases, rates may rise. Secure your reservation today to enjoy the lowest available rate
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="w-full bg-fuchsia-900/30 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 h-full rounded-full"
          style={{ width: `${Math.min(priceIncrease * 5, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
