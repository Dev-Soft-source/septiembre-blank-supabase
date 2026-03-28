
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { UtilitiesContent } from "./UtilitiesContent";
import { CleaningContent } from "./CleaningContent";
import { MealsContent } from "./MealsContent";

export const TotalCostContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <UtilitiesContent />
      <div className="border-t border-white/20"></div>
      <CleaningContent />
      <div className="border-t border-white/20"></div>
      <MealsContent />
    </div>
  );
};
