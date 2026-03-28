
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CommuterContentEN } from "./CommuterContent.en";
import { CommuterContentES } from "./CommuterContent.es";
import { CommuterContentPT } from "./CommuterContent.pt";
import { CommuterContentRO } from "./CommuterContent.ro";

export function CommuterContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <CommuterContentEN />;
  if (language === 'es') return <CommuterContentES />;
  if (language === 'pt') return <CommuterContentPT />;
  if (language === 'ro') return <CommuterContentRO />;
  
  // Default fallback to English
  return <CommuterContentEN />;
}
