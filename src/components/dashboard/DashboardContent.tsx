
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { DashboardContentEN } from './DashboardContent.en';
import { DashboardContentES } from './DashboardContent.es';
import { DashboardContentPT } from './DashboardContent.pt';
import { DashboardContentRO } from './DashboardContent.ro';

interface DashboardContentProps {
  setActiveTab?: (tab: string) => void;
}

export const DashboardContent = ({ setActiveTab }: DashboardContentProps = {}) => {
  const { language } = useTranslation();
  
  if (language === 'en') return <DashboardContentEN setActiveTab={setActiveTab} />;
  if (language === 'es') return <DashboardContentES setActiveTab={setActiveTab} />;
  if (language === 'pt') return <DashboardContentPT setActiveTab={setActiveTab} />;
  if (language === 'ro') return <DashboardContentRO setActiveTab={setActiveTab} />;
  
  // Default fallback to English
  return <DashboardContentEN setActiveTab={setActiveTab} />;
};

export default DashboardContent;
