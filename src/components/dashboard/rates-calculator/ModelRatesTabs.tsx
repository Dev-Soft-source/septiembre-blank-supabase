import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ModelRatesTabs as ModelRatesTabsEN } from "./ModelRatesTabs.en";
import { ModelRatesTabs as ModelRatesTabsES } from "./ModelRatesTabs.es";
import { ModelRatesTabs as ModelRatesTabsPT } from "./ModelRatesTabs.pt";
import { ModelRatesTabs as ModelRatesTabsRO } from "./ModelRatesTabs.ro";

export const ModelRatesTabs: React.FC = () => {
  const { language } = useTranslation();

  if (language === 'en') return <ModelRatesTabsEN />;
  if (language === 'es') return <ModelRatesTabsES />;
  if (language === 'pt') return <ModelRatesTabsPT />;
  if (language === 'ro') return <ModelRatesTabsRO />;
  
  // Default fallback to English
  return <ModelRatesTabsEN />;
};
