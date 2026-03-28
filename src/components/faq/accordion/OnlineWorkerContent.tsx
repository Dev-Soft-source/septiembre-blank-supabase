
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { OnlineWorkerContentEN } from "./OnlineWorkerContent.en";
import { OnlineWorkerContentES } from "./OnlineWorkerContent.es";
import { OnlineWorkerContentPT } from "./OnlineWorkerContent.pt";
import { OnlineWorkerContentRO } from "./OnlineWorkerContent.ro";

export function OnlineWorkerContent() {
  const { language } = useTranslation();
  
  if (language === 'en') return <OnlineWorkerContentEN />;
  if (language === 'es') return <OnlineWorkerContentES />;
  if (language === 'pt') return <OnlineWorkerContentPT />;
  if (language === 'ro') return <OnlineWorkerContentRO />;
  
  // Default fallback to English
  return <OnlineWorkerContentEN />;
}
