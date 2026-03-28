
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export const MealsContent: React.FC = () => {
  const { t } = useTranslation("dashboard");
  
  return (
    <div className="space-y-4 text-white/90">
      <h3 className="text-lg font-bold text-center mb-6">{t('ratesCalculator.mealsModelTitle')}</h3>
      
      <div className="space-y-4">
        <p className="text-sm">Hotel-Living meal plans are designed for comfort and long-term stays, not luxury dining experiences.</p>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">SIMPLE, PRACTICAL MEAL APPROACH</p>
          <p className="text-sm">Focus on balanced, consistent meals that residents will enjoy throughout their stay.</p>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">OPERATIONAL ADVANTAGES</p>
          <div className="ml-4 text-sm space-y-1">
            <p>• Lower complexity in kitchen operations</p>
            <p>• Predictable costs and inventory management</p>
            <p>• Relaxed dining atmosphere</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-semibold text-fuchsia-300">COST EFFICIENCY</p>
          <p className="text-sm">Advance bookings allow for better planning and cost control.</p>
          <div className="ml-4 text-sm space-y-1">
            <p>• Known guest preferences and dietary requirements</p>
            <p>• Zero food waste through planned portions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
