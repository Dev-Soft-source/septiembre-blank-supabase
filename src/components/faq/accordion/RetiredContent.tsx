
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { RetiredContentEN } from "./RetiredContent.en";
import { RetiredContentES } from "./RetiredContent.es";
import { RetiredContentPT } from "./RetiredContent.pt";
import { RetiredContentRO } from "./RetiredContent.ro";

export function RetiredContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <RetiredContentEN />;
  if (language === 'es') return <RetiredContentES />;
  if (language === 'pt') return <RetiredContentPT />;
  if (language === 'ro') return <RetiredContentRO />;
  
  // Default fallback to English
  return <RetiredContentEN />;
}
