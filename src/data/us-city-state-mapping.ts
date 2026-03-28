// US City to State mapping for proper address formatting
export const US_CITY_STATE_MAP: Record<string, string> = {
  'Burlington': 'Vermont',
  'Sedona': 'Arizona', 
  'Spokane': 'Washington',
  'Coronado': 'California',
  'Salt Lake City': 'Utah',
  'Mobile': 'Alabama',
  'Ann Arbor': 'Michigan',
  'Santa Fe': 'New Mexico',
  'Carmel-by-the-Sea': 'California',
  'Nashville': 'Tennessee',
  'Boise': 'Idaho',
  'Providence': 'Rhode Island',
  'Seattle': 'Washington',
  'Phoenix': 'Arizona',
  'Madison': 'Wisconsin',
  'Key West': 'Florida',
  'Portland': 'Oregon', // Default to Oregon, could also be Maine
  'Asheville': 'North Carolina',
  'Charleston': 'South Carolina', // Could also be West Virginia
  'Anchorage': 'Alaska',
  'Jackson': 'Mississippi', // Could be various states
  'Grand Rapids': 'Michigan',
  'Estes Park': 'Colorado',
  'Billings': 'Montana',
  'Savannah': 'Georgia',
  'Austin': 'Texas',
  'Newport': 'Rhode Island', // Could also be other states
  'Galveston': 'Texas',
  'Tucson': 'Arizona',
  'Atlantic City': 'New Jersey'
};

export function formatUSAddress(city: string, country: string): string {
  if (country === 'United States' && US_CITY_STATE_MAP[city]) {
    return `${city}, ${US_CITY_STATE_MAP[city]}, United States`;
  }
  return country === 'United States' ? `${city}, United States` : `${city}, ${country}`;
}