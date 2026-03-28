
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { BenefitsHeaderEN } from "./BenefitsHeader.en";
import { BenefitsHeaderES } from "./BenefitsHeader.es";
import { BenefitsHeaderPT } from "./BenefitsHeader.pt";
import { BenefitsHeaderRO } from "./BenefitsHeader.ro";

export function BenefitsHeader() {
  const { language } = useTranslation();
  
  if (language === 'en') return <BenefitsHeaderEN />;
  if (language === 'es') return <BenefitsHeaderES />;
  if (language === 'pt') return <BenefitsHeaderPT />;
  if (language === 'ro') return <BenefitsHeaderRO />;
  
  // Default fallback to English
  return <BenefitsHeaderEN />;
}
