
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { TermsConditionsContentEN } from "./TermsConditionsContent.en";
import { TermsConditionsContentES } from "./TermsConditionsContent.es";
import { TermsConditionsContentPT } from "./TermsConditionsContent.pt";
import { TermsConditionsContentRO } from "./TermsConditionsContent.ro";

export function TermsConditionsContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <TermsConditionsContentEN />;
  if (language === 'es') return <TermsConditionsContentES />;
  if (language === 'pt') return <TermsConditionsContentPT />;
  if (language === 'ro') return <TermsConditionsContentRO />;
  
  // Default fallback to English
  return <TermsConditionsContentEN />;
}
