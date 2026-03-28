
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { WelcomeOverviewContentEN } from "./WelcomeOverviewContent.en";
import { WelcomeOverviewContentES } from "./WelcomeOverviewContent.es";
import { WelcomeOverviewContentPT } from "./WelcomeOverviewContent.pt";
import { WelcomeOverviewContentRO } from "./WelcomeOverviewContent.ro";

export const WelcomeOverviewContent: React.FC = () => {
  const { language } = useTranslation();
  
  if (language === 'en') return <WelcomeOverviewContentEN />;
  if (language === 'es') return <WelcomeOverviewContentES />;
  if (language === 'pt') return <WelcomeOverviewContentPT />;
  if (language === 'ro') return <WelcomeOverviewContentRO />;
  
  // Default fallback to English
  return <WelcomeOverviewContentEN />;
};
