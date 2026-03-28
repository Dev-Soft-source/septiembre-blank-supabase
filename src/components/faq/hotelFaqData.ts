import { FaqCategory } from "./types";
import { useTranslation } from "@/hooks/useTranslation";

// Spanish imports
import { benefitsFaqs as benefitsFaqsEs } from "./hotel-categories/es/benefitsFaqs";
import { modelsFaqs as modelsFaqsEs } from "./hotel-categories/es/modelsFaqs";
import { revenueFaqs as revenueFaqsEs } from "./hotel-categories/es/revenueFaqs";
import { guestsFaqs as guestsFaqsEs } from "./hotel-categories/es/guestsFaqs";
import { seniorsFaqs as seniorsFaqsEs } from "./hotel-categories/es/seniorsFaqs";
import { affinitiesFaqs as affinitiesFaqsEs } from "./hotel-categories/es/affinitiesFaqs";
import { operationFaqs as operationFaqsEs } from "./hotel-categories/es/operationFaqs";
import { integrationFaqs as integrationFaqsEs } from "./hotel-categories/es/integrationFaqs";
import { marketingFaqs as marketingFaqsEs } from "./hotel-categories/es/marketingFaqs";
import { paymentFaqs as paymentFaqsEs } from "./hotel-categories/es/paymentFaqs";

// English imports
import { benefitsFaqs as benefitsFaqsEn } from "./hotel-categories/en/benefitsFaqs";
import { modelsFaqs as modelsFaqsEn } from "./hotel-categories/en/modelsFaqs";
import { revenueFaqs as revenueFaqsEn } from "./hotel-categories/en/revenueFaqs";
import { guestsFaqs as guestsFaqsEn } from "./hotel-categories/en/guestsFaqs";
import { seniorsFaqs as seniorsFaqsEn } from "./hotel-categories/en/seniorsFaqs";
import { affinitiesFaqs as affinitiesFaqsEn } from "./hotel-categories/en/affinitiesFaqs";
import { operationFaqs as operationFaqsEn } from "./hotel-categories/en/operationFaqs";
import { integrationFaqs as integrationFaqsEn } from "./hotel-categories/en/integrationFaqs";
import { marketingFaqs as marketingFaqsEn } from "./hotel-categories/en/marketingFaqs";
import { paymentFaqs as paymentFaqsEn } from "./hotel-categories/en/paymentFaqs";

// Portuguese imports  
import { benefitsFaqs as benefitsFaqsPt } from "./hotel-categories/pt/benefitsFaqs";
import { modelsFaqs as modelsFaqsPt } from "./hotel-categories/pt/modelsFaqs";
import { revenueFaqs as revenueFaqsPt } from "./hotel-categories/pt/revenueFaqs";
import { guestsFaqs as guestsFaqsPt } from "./hotel-categories/pt/guestsFaqs";
import { seniorsFaqs as seniorsFaqsPt } from "./hotel-categories/pt/seniorsFaqs";
import { affinitiesFaqs as affinitiesFaqsPt } from "./hotel-categories/pt/affinitiesFaqs";
import { operationFaqs as operationFaqsPt } from "./hotel-categories/pt/operationFaqs";
import { integrationFaqs as integrationFaqsPt } from "./hotel-categories/pt/integrationFaqs";
import { marketingFaqs as marketingFaqsPt } from "./hotel-categories/pt/marketingFaqs";
import { paymentFaqs as paymentFaqsPt } from "./hotel-categories/pt/paymentFaqs";

// Romanian imports
import { benefitsFaqs as benefitsFaqsRo } from "./hotel-categories/ro/benefitsFaqs";
import { modelsFaqs as modelsFaqsRo } from "./hotel-categories/ro/modelsFaqs";
import { revenueFaqs as revenueFaqsRo } from "./hotel-categories/ro/revenueFaqs";
import { guestsFaqs as guestsFaqsRo } from "./hotel-categories/ro/guestsFaqs";
import { seniorsFaqs as seniorsFaqsRo } from "./hotel-categories/ro/seniorsFaqs";
import { affinitiesFaqs as affinitiesFaqsRo } from "./hotel-categories/ro/affinitiesFaqs";
import { operationFaqs as operationFaqsRo } from "./hotel-categories/ro/operationFaqs";
import { integrationFaqs as integrationFaqsRo } from "./hotel-categories/ro/integrationFaqs";
import { marketingFaqs as marketingFaqsRo } from "./hotel-categories/ro/marketingFaqs";
import { paymentFaqs as paymentFaqsRo } from "./hotel-categories/ro/paymentFaqs";

export const useHotelFaqCategories = (): FaqCategory[] => {
  const { language } = useTranslation();
  
  const categoryTranslations = {
    en: {
      benefits: "BENEFITS",
      models: "MODEL", 
      revenue: "SALES",
      guests: "GUESTS",
      seniors: "SENIORS",
      affinities: "AFFINITIES",
      operation: "OPERATION",
      integration: "INTEGRATION", 
      marketing: "MARKETING",
      payment: "PAYMENT"
    },
    es: {
      benefits: "BENEFICIOS",
      models: "MODELO",
      revenue: "VENTAS", 
      guests: "CLIENTES",
      seniors: "MAYORES",
      affinities: "AFINIDADES",
      operation: "OPERACIÓN",
      integration: "INTEGRACIÓN",
      marketing: "MARKETING",
      payment: "PAGO"
    },
    pt: {
      benefits: "BENEFÍCIOS",
      models: "MODELO",
      revenue: "VENDAS",
      guests: "CLIENTES", 
      seniors: "IDOSOS",
      affinities: "AFINIDADES",
      operation: "OPERAÇÃO",
      integration: "INTEGRAÇÃO",
      marketing: "MARKETING", 
      payment: "PAGAMENTO"
    },
    ro: {
      benefits: "BENEFICII",
      models: "MODEL",
      revenue: "VÂNZĂRI",
      guests: "OASPEȚI",
      seniors: "SENIORI", 
      affinities: "AFINITĂȚI",
      operation: "OPERARE",
      integration: "INTEGRARE",
      marketing: "MARKETING",
      payment: "PLATĂ"
    }
  };
  
  const translations = categoryTranslations[language as keyof typeof categoryTranslations] || categoryTranslations.en;
  
  const categories = [
    { id: "benefits", name: translations.benefits },
    { id: "models", name: translations.models },
    { id: "revenue", name: translations.revenue },
    { id: "guests", name: translations.guests },
    { id: "seniors", name: translations.seniors },
    { id: "affinities", name: translations.affinities },
    { id: "operation", name: translations.operation },
    { id: "integration", name: translations.integration },
    { id: "marketing", name: translations.marketing },
    { id: "payment", name: translations.payment }
  ];
  
  return categories;
};

export const useHotelFaqsByCategory = () => {
  const { language } = useTranslation();
  
  // Return language-specific content
  switch (language) {
    case 'en':
      return {
        benefits: benefitsFaqsEn,
        models: modelsFaqsEn,
        revenue: revenueFaqsEn,
        guests: guestsFaqsEn,
        seniors: seniorsFaqsEn,
        affinities: affinitiesFaqsEn,
        operation: operationFaqsEn,
        integration: integrationFaqsEn,
        marketing: marketingFaqsEn,
        payment: paymentFaqsEn
      };
    case 'pt':
      return {
        benefits: benefitsFaqsPt,
        models: modelsFaqsPt,
        revenue: revenueFaqsPt,
        guests: guestsFaqsPt,
        seniors: seniorsFaqsPt,
        affinities: affinitiesFaqsPt,
        operation: operationFaqsPt,
        integration: integrationFaqsPt,
        marketing: marketingFaqsPt,
        payment: paymentFaqsPt
      };
    case 'ro':
      return {
        benefits: benefitsFaqsRo,
        models: modelsFaqsRo,
        revenue: revenueFaqsRo,
        guests: guestsFaqsRo,
        seniors: seniorsFaqsRo,
        affinities: affinitiesFaqsRo,
        operation: operationFaqsRo,
        integration: integrationFaqsRo,
        marketing: marketingFaqsRo,
        payment: paymentFaqsRo
      };
    default: // Spanish (es)
      return {
        benefits: benefitsFaqsEs,
        models: modelsFaqsEs,
        revenue: revenueFaqsEs,
        guests: guestsFaqsEs,
        seniors: seniorsFaqsEs,
        affinities: affinitiesFaqsEs,
        operation: operationFaqsEs,
        integration: integrationFaqsEs,
        marketing: marketingFaqsEs,
        payment: paymentFaqsEs
      };
  }
};
