
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import SimpleTabContent from "../SimpleTabContent";

export default function PaymentsContent() {
  const { t } = useTranslation('dashboard/user');
  
  return (
    <SimpleTabContent 
      title={t('userDashboard.payments.title')}
      description={t('userDashboard.payments.subtitle')}
    />
  );
}
