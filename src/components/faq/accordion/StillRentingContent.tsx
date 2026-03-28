
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { StillRentingContentEN } from "./StillRentingContent.en";
import { StillRentingContentES } from "./StillRentingContent.es";
import { StillRentingContentPT } from "./StillRentingContent.pt";
import { StillRentingContentRO } from "./StillRentingContent.ro";

export function StillRentingContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <StillRentingContentEN />;
  if (language === 'es') return <StillRentingContentES />;
  if (language === 'pt') return <StillRentingContentPT />;
  if (language === 'ro') return <StillRentingContentRO />;
  
  // Default fallback to English
  return <StillRentingContentEN />;
}
