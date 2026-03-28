
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SocietyContentEN } from "./SocietyContent.en";
import { SocietyContentES } from "./SocietyContent.es";
import { SocietyContentPT } from "./SocietyContent.pt";
import { SocietyContentRO } from "./SocietyContent.ro";

export function SocietyContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <SocietyContentEN />;
  if (language === 'es') return <SocietyContentES />;
  if (language === 'pt') return <SocietyContentPT />;
  if (language === 'ro') return <SocietyContentRO />;
  
  // Default fallback to English
  return <SocietyContentEN />;
}
