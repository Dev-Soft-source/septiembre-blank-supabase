
interface PricingMatrixItem {
  roomType: string;
  stayLength: string | number;
  mealPlan: string;
  price: number;
}

interface BuildPricingMatrixParams {
  roomTypes: any[]; // Formatted with .name and .rates
  stayLengths: number[];
  mealPlans: { id: string; label: string }[];
}

export function buildPricingMatrix({
  roomTypes,
  stayLengths,
  mealPlans
}: BuildPricingMatrixParams): PricingMatrixItem[] {
  const matrix: PricingMatrixItem[] = [];

  for (const room of roomTypes) {
    for (const stay of stayLengths) {
      for (const meal of mealPlans) {
        const rateKey = `${stay}-${meal.id}`;
        const price = room.rates?.[rateKey];

        if (price !== undefined) {
          matrix.push({
            roomType: room.name.toLowerCase(),
            stayLength: String(stay),
            mealPlan: meal.label.toLowerCase(),
            price
          });
        }
      }
    }
  }

  return matrix.sort((a, b) => a.price - b.price);
}
