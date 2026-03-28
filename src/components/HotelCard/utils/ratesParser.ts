
interface ParsedRates {
  [key: string]: number;
}

export const parseRatesData = (rates: Record<string, number>) => {
  const parsedRates: ParsedRates = {};
  
  Object.keys(rates).forEach(key => {
    // Check for simple numeric keys (8, 15, 22, 29)
    if (/^\d+$/.test(key)) {
      parsedRates[key] = rates[key];
    }
    // Check for complex keys like "8-breakfast-included" or "15-half-board"
    else if (key.includes('-')) {
      const parts = key.split('-');
      const stayLength = parts[0];
      if (/^\d+$/.test(stayLength)) {
        // Use the stay length as key, taking the first rate found for that duration
        if (!parsedRates[stayLength]) {
          parsedRates[stayLength] = rates[key];
        }
      }
    }
  });
  
  return parsedRates;
};

// Calculate the lowest per-person monthly rate based on double room prices
export const calculateLowestMonthlyRatePerPerson = (rates: Record<string, number>): number | null => {
  // Look for double room rates first (these are already per-person prices in new structure)
  const doubleRoomRates: { [key: string]: number } = {};
  
  Object.keys(rates).forEach(key => {
    // Look for double room rates in format "29-double", "22-double", etc.
    if (key.includes('-double')) {
      const stayLength = key.split('-')[0];
      if (/^\d+$/.test(stayLength)) {
        doubleRoomRates[stayLength] = rates[key];
      }
    }
  });

  // If we have a 29-day double room rate, use it directly (it's already per-person)
  if (doubleRoomRates['29']) {
    return doubleRoomRates['29']; // Already per person for double room
  }

  // Otherwise, find the lowest available double room rate and calculate proportionally
  const availableStayLengths = Object.keys(doubleRoomRates).map(Number).sort((a, b) => a - b);
  
  if (availableStayLengths.length > 0) {
    const lowestStayLength = availableStayLengths[0];
    const lowestDoubleRoomRatePerPerson = doubleRoomRates[lowestStayLength.toString()];
    
    // Calculate proportional monthly rate: (PerPersonPrice * 29) / PackageDays
    return (lowestDoubleRoomRatePerPerson * 29) / lowestStayLength;
  }

  return null; // No double room rates found
};
