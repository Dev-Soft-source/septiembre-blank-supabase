import { AvailabilityPackage } from '@/types/availability-package';
import { calculateNormalizedMonthlyPrice } from '@/utils/demoPricing';

/**
 * Calculates the monthly price (29-day equivalent) from available packages
 * following the corrected business logic requirements:
 * 
 * 1. Find the longest duration among ALL available packages
 * 2. From packages with that longest duration, take the lowest price
 * 3. Always calculate per person in double room
 * 4. If duration is not 29 days, calculate proportionally to 29 days
 * 
 * @param packages - Array of availability packages
 * @returns The calculated monthly price in USD per person (double room), or null if no packages available
 */
export function calculateMonthlyPriceFromPackages(packages: AvailabilityPackage[]): number | null {
  if (!packages || packages.length === 0) {
    console.log('📊 No packages available for monthly price calculation');
    return null;
  }

  // Filter for valid double room packages with positive prices
  const validPackages = packages.filter(pkg => {
    return pkg.current_price_usd > 0 && 
           pkg.duration_days > 0 &&
           (pkg.room_type?.toLowerCase().includes('double') || !pkg.room_type) && // Default to double room if not specified
           (pkg.occupancy_mode === 'per_person' || !pkg.occupancy_mode); // Ensure per person pricing
  });

  if (validPackages.length === 0) {
    return null;
  }

  // Step 1: Find the longest duration among ALL packages
  const longestDuration = Math.max(...validPackages.map(pkg => pkg.duration_days));

  // Step 2: Get all packages with the longest duration
  const longestPackages = validPackages.filter(pkg => pkg.duration_days === longestDuration);


  // Step 3: From packages with longest duration, take the lowest price
  const selectedPackage = longestPackages.reduce((lowest, current) => 
    current.current_price_usd < lowest.current_price_usd ? current : lowest
  );

  // Step 4: Calculate normalized 29-day monthly price using demo pricing logic
  let monthlyPrice: number;

  if (selectedPackage.duration_days === 29) {
    // If it's exactly 29 days, use the price as-is
    monthlyPrice = selectedPackage.current_price_usd;
  } else {
    // Use normalized pricing logic that accounts for demo pricing rules
    const roomType = selectedPackage.room_type?.toLowerCase().includes('single') ? 'single' : 'double';
    monthlyPrice = calculateNormalizedMonthlyPrice(
      selectedPackage.current_price_usd, 
      selectedPackage.duration_days, 
      roomType
    );
  }

  return monthlyPrice;
}

/**
 * Format the monthly price with "from" prefix and currency
 * @param price - Price in the package currency or null
 * @param currency - Currency code (default: "USD", but EUR expected from packages)
 * @returns Formatted price string
 */
export function formatMonthlyPriceFromPackages(price: number | null, currency: string = "USD"): string {
  if (!price || price <= 0) {
    return "Price on request";
  }

  // Use the price as-is for USD display
  const displayPrice = price;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  });

  const formattedPrice = `From ${formatter.format(displayPrice)} per month`;
  return formattedPrice;
}