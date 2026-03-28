
import { format, parseISO } from "date-fns";

export const formatCurrency = (amount: number, currency: string = "USD") => {
  // Apply proper price rounding - prices must end in 0, 5, or 9
  const roundedAmount = applyPriceRounding(amount);
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency,
    maximumFractionDigits: 0 
  }).format(roundedAmount);
};

/**
 * Price Rounding Rules - prices must end in 0, 5, or 9
 */
function applyPriceRounding(price: number): number {
  const rounded = Math.round(price);
  const lastDigit = rounded % 10;
  
  // If already ends in 0, 5, or 9, return as is
  if ([0, 5, 9].includes(lastDigit)) {
    return rounded;
  }
  
  // Round to nearest valid ending
  if (lastDigit <= 2) {
    return rounded - lastDigit; // Round down to 0
  } else if (lastDigit <= 6) {
    return rounded + (5 - lastDigit); // Round to 5
  } else {
    return rounded + (9 - lastDigit); // Round to 9
  }
}

export const formatDate = (dateString: string) => {
  try {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error parsing date:', error);
    return dateString;
  }
};
