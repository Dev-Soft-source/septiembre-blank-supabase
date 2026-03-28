
import { FaqItem, FaqCategory } from "./types";
import { faqCategories } from "./faqCategories";
import { useTranslation } from "@/hooks/useTranslation";

// English imports (existing)
import { generalFaqs as generalFaqsEn } from "./faqData/generalFaqs";
import { bookingFaqs as bookingFaqsEn } from "./faqData/bookingFaqs";
import { stayFaqs as stayFaqsEn } from "./faqData/stayFaqs";
import { paymentFaqs as paymentFaqsEn } from "./faqData/paymentFaqs";
import { themesFaqs as themesFaqsEn } from "./faqData/themesFaqs";
import { lifestyleFaqs as lifestyleFaqsEn } from "./faqData/lifestyleFaqs";
import { seniorFaqs as seniorFaqsEn } from "./faqData/seniorFaqs";
import { communityFaqs as communityFaqsEn } from "./faqData/communityFaqs";
import { practicalFaqs as practicalFaqsEn } from "./faqData/practicalFaqs";

// Spanish imports
import { generalFaqs as generalFaqsEs } from "./faqData/es/generalFaqs";
import { bookingFaqs as bookingFaqsEs } from "./faqData/es/bookingFaqs";
import { stayFaqs as stayFaqsEs } from "./faqData/es/stayFaqs";
import { paymentFaqs as paymentFaqsEs } from "./faqData/es/paymentFaqs";
import { themesFaqs as themesFaqsEs } from "./faqData/es/themesFaqs";
import { lifestyleFaqs as lifestyleFaqsEs } from "./faqData/es/lifestyleFaqs";
import { seniorFaqs as seniorFaqsEs } from "./faqData/es/seniorFaqs";
import { communityFaqs as communityFaqsEs } from "./faqData/es/communityFaqs";
import { practicalFaqs as practicalFaqsEs } from "./faqData/es/practicalFaqs";

// Portuguese imports
import { generalFaqs as generalFaqsPt } from "./faqData/pt/generalFaqs";
import { bookingFaqs as bookingFaqsPt } from "./faqData/pt/bookingFaqs";
import { stayFaqs as stayFaqsPt } from "./faqData/pt/stayFaqs";
import { paymentFaqs as paymentFaqsPt } from "./faqData/pt/paymentFaqs";
import { themesFaqs as themesFaqsPt } from "./faqData/pt/themesFaqs";
import { lifestyleFaqs as lifestyleFaqsPt } from "./faqData/pt/lifestyleFaqs";
import { seniorFaqs as seniorFaqsPt } from "./faqData/pt/seniorFaqs";
import { communityFaqs as communityFaqsPt } from "./faqData/pt/communityFaqs";
import { practicalFaqs as practicalFaqsPt } from "./faqData/pt/practicalFaqs";

// Romanian imports
import { generalFaqs as generalFaqsRo } from "./faqData/ro/generalFaqs";
import { bookingFaqs as bookingFaqsRo } from "./faqData/ro/bookingFaqs";
import { stayFaqs as stayFaqsRo } from "./faqData/ro/stayFaqs";
import { paymentFaqs as paymentFaqsRo } from "./faqData/ro/paymentFaqs";
import { themesFaqs as themesFaqsRo } from "./faqData/ro/themesFaqs";
import { lifestyleFaqs as lifestyleFaqsRo } from "./faqData/ro/lifestyleFaqs";
import { seniorFaqs as seniorFaqsRo } from "./faqData/ro/seniorFaqs";
import { communityFaqs as communityFaqsRo } from "./faqData/ro/communityFaqs";
import { practicalFaqs as practicalFaqsRo } from "./faqData/ro/practicalFaqs";

export const useFaqData = () => {
  const { language } = useTranslation();
  
  const getTranslatedCategories = () => {
    if (language === 'es') {
      return [
        { id: "general", name: "General" },
        { id: "booking", name: "Reservas" },
        { id: "stay", name: "Durante tu estancia" },
        { id: "payment", name: "Pagos" },
        { id: "themes", name: "¿Afinidades?" },
        { id: "lifestyle", name: "¿Nómadas Digitales?" },
        { id: "senior", name: "¿Mayores?" },
        { id: "community", name: "¿Comunidad?" },
        { id: "practical", name: "¿Detalles Prácticos?" }
      ];
    }

    if (language === 'pt') {
      return [
        { id: "general", name: "Geral" },
        { id: "booking", name: "Reservas" },
        { id: "stay", name: "Durante sua estadia" },
        { id: "payment", name: "Pagamentos" },
        { id: "themes", name: "Afinidades?" },
        { id: "lifestyle", name: "Nômades Digitais?" },
        { id: "senior", name: "Idosos?" },
        { id: "community", name: "Comunidade?" },
        { id: "practical", name: "Detalhes Práticos?" }
      ];
    }

    if (language === 'ro') {
      return [
        { id: "general", name: "General" },
        { id: "booking", name: "Rezervări" },
        { id: "stay", name: "În timpul șederii" },
        { id: "payment", name: "Plăți" },
        { id: "themes", name: "Afinități?" },
        { id: "lifestyle", name: "Nomazi Digitali?" },
        { id: "senior", name: "Seniori?" },
        { id: "community", name: "Comunitate?" },
        { id: "practical", name: "Detalii Practice?" }
      ];
    }

    // English version with question formatting
    return [
      { id: "general", name: "General" },
      { id: "booking", name: "Booking" },
      { id: "stay", name: "During Your Stay" },
      { id: "payment", name: "Payment" },
      { id: "themes", name: "Affinities?" },
      { id: "lifestyle", name: "Digital Nomads?" },
      { id: "senior", name: "SENIOR?" },
      { id: "community", name: "Community?" },
      { id: "practical", name: "Practical Details?" }
    ];
  };

  const getFaqsByCategory = () => {
    if (language === 'es') {
      return {
        general: generalFaqsEs,
        booking: bookingFaqsEs,
        stay: stayFaqsEs,
        payment: paymentFaqsEs,
        themes: themesFaqsEs,
        lifestyle: lifestyleFaqsEs,
        senior: seniorFaqsEs,
        community: communityFaqsEs,
        practical: practicalFaqsEs
      };
    }

    if (language === 'pt') {
      return {
        general: generalFaqsPt,
        booking: bookingFaqsPt,
        stay: stayFaqsPt,
        payment: paymentFaqsPt,
        themes: themesFaqsPt,
        lifestyle: lifestyleFaqsPt,
        senior: seniorFaqsPt,
        community: communityFaqsPt,
        practical: practicalFaqsPt
      };
    }

    if (language === 'ro') {
      return {
        general: generalFaqsRo,
        booking: bookingFaqsRo,
        stay: stayFaqsRo,
        payment: paymentFaqsRo,
        themes: themesFaqsRo,
        lifestyle: lifestyleFaqsRo,
        senior: seniorFaqsRo,
        community: communityFaqsRo,
        practical: practicalFaqsRo
      };
    }

    // English version (default)
    return {
      general: generalFaqsEn,
      booking: bookingFaqsEn,
      stay: stayFaqsEn,
      payment: paymentFaqsEn,
      themes: themesFaqsEn,
      lifestyle: lifestyleFaqsEn,
      senior: seniorFaqsEn,
      community: communityFaqsEn,
      practical: practicalFaqsEn
    };
  };

  return {
    translatedCategories: getTranslatedCategories(),
    translatedFaqsByCategory: getFaqsByCategory()
  };
};
