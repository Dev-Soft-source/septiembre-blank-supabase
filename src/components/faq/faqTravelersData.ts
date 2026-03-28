
import { FaqItem, FaqCategory } from "./types";
import { generalFaqs } from "./faqData/generalFaqs";
import { bookingFaqs } from "./faqData/bookingFaqs";
import { stayFaqs } from "./faqData/stayFaqs";
import { paymentFaqs } from "./faqData/paymentFaqs";
import { themesFaqs } from "./faqData/themesFaqs";
import { lifestyleFaqs } from "./faqData/lifestyleFaqs";
import { seniorFaqs } from "./faqData/seniorFaqs";
import { communityFaqs } from "./faqData/communityFaqs";
import { practicalFaqs } from "./faqData/practicalFaqs";

// Benefits list for travelers
export const benefitsTravelersList = [
  "Flexible accommodation solutions for any lifestyle",
  "All-inclusive pricing with no hidden fees",
  "Built-in communities and networking opportunities",
  "Professional workspaces and reliable WiFi",
  "Housekeeping and maintenance included",
  "Access to amenities and local experiences"
];

// FAQ categories for travelers
export const faqTravelersCategories: FaqCategory[] = [
  { id: "general", name: "General" },
  { id: "booking", name: "Booking?" },
  { id: "stay", name: "During Your Stay?" },
  { id: "payment", name: "Payment?" },
  { id: "themes", name: "Affinities?" },
  { id: "lifestyle", name: "Digital Nomads?" },
  { id: "senior", name: "SENIOR?" },
  { id: "community", name: "Community?" },
  { id: "practical", name: "Practical Details?" }
];

// FAQ content organized by category for travelers
export const faqTravelersByCategory: Record<string, FaqItem[]> = {
  general: generalFaqs,
  booking: bookingFaqs,
  stay: stayFaqs,
  payment: paymentFaqs,
  themes: themesFaqs,
  lifestyle: lifestyleFaqs,
  senior: seniorFaqs,
  community: communityFaqs,
  practical: practicalFaqs
};
