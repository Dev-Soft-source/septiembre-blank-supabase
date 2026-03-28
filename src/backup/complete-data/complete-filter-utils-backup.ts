// COMPLETE FILTER UTILS AND STATIC DATA BACKUP

// Countries - Complete list of 60 countries from useFilterData
export const COMPLETE_COUNTRIES_LIST = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' }
];

// Currency Options
export const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" }
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
  { value: "december", translationKey: "months.december" }
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

// Theme categories for filtering
export const themeCategories = [
  "Art", "Business", "Culture", "Education", "Entertainment", 
  "Food and Drinks", "Health and Wellness", "History", "Hobbies", 
  "Languages", "Lifestyle", "Nature", "Personal Development", 
  "Relationships", "Science and Technology", "Social Impact", "Sports"
];

// Booking durations
export const durations = [
  { id: 1, value: 8 },
  { id: 2, value: 16 }, 
  { id: 3, value: 24 },
  { id: 4, value: 32 }
];

// Weekdays constant
export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Countries from FilterUtils (with ISO codes)
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
  { value: "GR", label: "Greece 🇬🇷", translationKey: "countries.greece" }
];