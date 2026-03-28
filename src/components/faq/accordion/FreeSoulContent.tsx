
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { FreeSoulContentEN } from "./FreeSoulContent.en";
import { FreeSoulContentES } from "./FreeSoulContent.es";
import { FreeSoulContentPT } from "./FreeSoulContent.pt";
import { FreeSoulContentRO } from "./FreeSoulContent.ro";

export function FreeSoulContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <FreeSoulContentEN />;
  if (language === 'es') return <FreeSoulContentES />;
  if (language === 'pt') return <FreeSoulContentPT />;
  if (language === 'ro') return <FreeSoulContentRO />;
  
  // Default fallback to English
  return <FreeSoulContentEN />;
}
