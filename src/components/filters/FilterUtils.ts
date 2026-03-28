// Import translation utilities
import { useTranslation } from "@/hooks/useTranslation";

// Countries - Updated to use ISO codes that match the database
export const availableCountries = [
  { value: "ES", label: "Spain 🇪🇸", translationKey: "countries.spain" },
  { value: "FR", label: "France 🇫🇷", translationKey: "countries.france" },
  { value: "IT", label: "Italy 🇮🇹", translationKey: "countries.italy" },
  { value: "US", label: "USA 🇺🇸", translationKey: "countries.usa" },
  { value: "EG", label: "Egypt 🇪🇬", translationKey: "countries.egypt" },
  { value: "TR", label: "Turkey 🇹🇷", translationKey: "countries.turkey" },
  { value: "GB", label: "United Kingdom 🇬🇧", translationKey: "countries.unitedKingdom" },
  { value: "DE", label: "Germany 🇩🇪", translationKey: "countries.germany" },
  { value: "PT", label: "Portugal 🇵🇹", translationKey: "countries.portugal" },
  { value: "GR", label: "Greece 🇬🇷", translationKey: "countries.greece" },
];

// Months with translation keys
export const months = [
  { value: "january", translationKey: "months.january" },
  { value: "february", translationKey: "months.february" },
  { value: "march", translationKey: "months.march" },
  { value: "april", translationKey: "months.april" },
  { value: "may", translationKey: "months.may" },
  { value: "june", translationKey: "months.june" },
  { value: "july", translationKey: "months.july" },
  { value: "august", translationKey: "months.august" },
  { value: "september", translationKey: "months.september" },
  { value: "october", translationKey: "months.october" },
  { value: "november", translationKey: "months.november" },
  { value: "december", translationKey: "months.december" },
];

// Theme categories
export const themeCategories = [
  "Art", "Business", "Culture", "Education", "Entertainment", 
  "Food and Drinks", "Health and Wellness", "History", "Hobbies", 
  "Languages", "Lifestyle", "Nature", "Personal Development", 
  "Relationships", "Science and Technology", "Social Impact", "Sports"
];

// Price ranges with translation keys
export const priceRanges = [
  { value: 1000, label: "Up to 1.000 $", translationKey: "priceRanges.upTo1000" },
  { value: 1500, label: "1.000 $ to 1.500 $", translationKey: "priceRanges.1000to1500" },
  { value: 2000, label: "1.500 $ to 2.000 $", translationKey: "priceRanges.1500to2000" },
  { value: 3000, label: "More than 2.000 $", translationKey: "priceRanges.moreThan2000" }
];

// Length of stay options
export const stayLengths = [
  { value: "1-month", label: "1 Month" },
  { value: "3-months", label: "3 Months" },
  { value: "6-months", label: "6 Months" },
  { value: "1-year", label: "1 Year" },
  { value: "long-term", label: "Long Term" }
];

// Property types
export const propertyTypes = [
  "Hotel", 
  "Resort", 
  "Boutique Hotel", 
  "Country House", 
  "Roadside Motel"
];

// Property styles
export const propertyStyles = [
  "classic",
  "classicElegant", 
  "modern",
  "fusion",
  "urban",
  "rural",
  "minimalist",
  "luxury"
];

// Location types
export const locationTypes = [
  "Beach", 
  "Mountain", 
  "City Center", 
  "Countryside", 
  "Forest", 
  "Desert", 
  "Island"
];

// Categories
export const categories = [
  "5-star", 
  "4-star", 
  "3-star", 
  "Budget", 
  "Luxury", 
  "Family-friendly", 
  "Adults-only"
];

// Import theme data for filtering
import { allThemes, themeCategories as themeCategoriesToFilter } from '@/utils/themes';

// Function to filter themes based on search query
export const filterThemesByQuery = (query: string) => {
  if (!query || query.trim() === '') {
    return allThemes;
  }
  
  const lowercaseQuery = query.toLowerCase();
  return allThemes.filter(theme => 
    theme.name.toLowerCase().includes(lowercaseQuery) || 
    (theme.category && theme.category.toLowerCase().includes(lowercaseQuery))
  );
};
