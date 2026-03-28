
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { CostTableImage } from "./CostTableImage";
import { UtilitiesContent } from "./UtilitiesContent";
import { CleaningContent } from "./CleaningContent";
import { MealsContent } from "./MealsContent";

export const CostSubTabs: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="utilities" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-purple-900/30">
        <TabsTrigger 
          value="utilities" 
          className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-xs"
        >
          {t('dashboard.ratesCalculator.utilities')}
        </TabsTrigger>
        <TabsTrigger 
          value="cleaning" 
          className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-xs"
        >
          {t('dashboard.ratesCalculator.cleaning')}
        </TabsTrigger>
        <TabsTrigger 
          value="meals" 
          className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-xs"
        >
          {t('dashboard.ratesCalculator.meals')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="utilities">
        <div className="glass-card rounded-lg p-6 text-center text-white/80 border-fuchsia-500/20 bg-[#5f098a]">
          <UtilitiesContent />
          <div className="mt-6">
            <CostTableImage 
              src="/lovable-uploads/589c396e-8094-48ec-956c-aeb87a21450a.png"
              alt="Utilities Cost Breakdown Table"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cleaning">
        <div className="glass-card rounded-lg p-6 text-center text-white/80 border-fuchsia-500/20 bg-[#5f098a]">
          <CleaningContent />
          <div className="mt-6">
            <CostTableImage 
              src="/lovable-uploads/589c396e-8094-48ec-956c-aeb87a21450a.png"
              alt="Cleaning & Laundry Costs Table"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="meals">
        <div className="glass-card rounded-lg p-6 text-center text-white/80 border-fuchsia-500/20 bg-[#5f098a]">
          <MealsContent />
          <div className="mt-6">
            <CostTableImage 
              src="/lovable-uploads/589c396e-8094-48ec-956c-aeb87a21450a.png"
              alt="Meal Plan Cost Table"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
