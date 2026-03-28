import { supabase } from '@/integrations/supabase/client';

// Verification function for country filters
export const verifyCountryFilters = async () => {
  console.log('🔍 COUNTRY FILTER VERIFICATION LOG');
  console.log('==================================');
  
  // List of all 60 countries with their ISO codes
  const countries = [
    { code: 'DE', name: 'Germany' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BR', name: 'Brazil' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'CA', name: 'Canada' },
    { code: 'CO', name: 'Colombia' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'HR', name: 'Croatia' },
    { code: 'DK', name: 'Denmark' },
    { code: 'EG', name: 'Egypt' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'ES', name: 'Spain' },
    { code: 'US', name: 'United States' },
    { code: 'EE', name: 'Estonia' },
    { code: 'PH', name: 'Philippines' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GE', name: 'Georgia' },
    { code: 'GR', name: 'Greece' },
    { code: 'HU', name: 'Hungary' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MT', name: 'Malta' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MX', name: 'Mexico' },
    { code: 'NO', name: 'Norway' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'PA', name: 'Panama' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'RO', name: 'Romania' },
    { code: 'SG', name: 'Singapore' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TR', name: 'Turkey' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'KR', name: 'South Korea' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'SK', name: 'Slovakia' }
  ];

  const countryCodeToValues: Record<string, string[]> = {
    'DE': ['Germany', 'Alemania', 'de'],
    'AR': ['Argentina', 'ar'],
    'AU': ['Australia', 'au'],
    'AT': ['Austria', 'at'],
    'BE': ['Belgium', 'Bélgica', 'be'],
    'BR': ['Brazil', 'Brasil', 'br'],
    'BG': ['Bulgaria', 'bg'],
    'CA': ['Canada', 'Canadá', 'ca'],
    'CO': ['Colombia', 'co'],
    'CR': ['Costa Rica', 'cr'],
    'HR': ['Croatia', 'Croacia', 'hr'],
    'DK': ['Denmark', 'Dinamarca', 'dk'],
    'EG': ['Egypt', 'Egipto', 'eg'],
    'AE': ['United Arab Emirates', 'Emiratos Árabes Unidos', 'ae'],
    'ES': ['Spain', 'España', 'es'],
    'US': ['United States', 'Estados Unidos', 'USA', 'us'],
    'EE': ['Estonia', 'ee'],
    'PH': ['Philippines', 'Filipinas', 'ph'],
    'FI': ['Finland', 'Finlandia', 'fi'],
    'FR': ['France', 'Francia', 'FR', 'fr'],
    'GE': ['Georgia', 'ge'],
    'GR': ['Greece', 'Grecia', 'GR', 'gr'],
    'HU': ['Hungary', 'Hungría', 'hu'],
    'ID': ['Indonesia', 'id'],
    'IE': ['Ireland', 'Irlanda', 'ie'],
    'IS': ['Iceland', 'Islandia', 'is'],
    'IT': ['Italy', 'Italia', 'it'],
    'JP': ['Japan', 'Japón', 'jp'],
    'KZ': ['Kazakhstan', 'Kazajistán', 'kz'],
    'LV': ['Latvia', 'Letonia', 'lv'],
    'LT': ['Lithuania', 'Lituania', 'lt'],
    'LU': ['Luxembourg', 'Luxemburgo', 'lu'],
    'MY': ['Malaysia', 'Malasia', 'my'],
    'MT': ['Malta', 'mt'],
    'MA': ['Morocco', 'Marruecos', 'ma'],
    'MX': ['Mexico', 'México', 'mx'],
    'NO': ['Norway', 'Noruega', 'no'],
    'NZ': ['New Zealand', 'Nueva Zelanda', 'nz'],
    'NL': ['Netherlands', 'Países Bajos', 'nl'],
    'PA': ['Panama', 'Panamá', 'pa'],
    'PY': ['Paraguay', 'py'],
    'PE': ['Peru', 'Perú', 'pe'],
    'PL': ['Poland', 'Polonia', 'pl'],
    'PT': ['Portugal', 'PT', 'pt'],
    'GB': ['United Kingdom', 'Reino Unido', 'gb'],
    'CZ': ['Czech Republic', 'República Checa', 'cz'],
    'DO': ['Dominican Republic', 'República Dominicana', 'do'],
    'RO': ['Romania', 'Rumanía', 'ro'],
    'SG': ['Singapore', 'Singapur', 'sg'],
    'LK': ['Sri Lanka', 'lk'],
    'SE': ['Sweden', 'Suecia', 'se'],
    'CH': ['Switzerland', 'Suiza', 'ch'],
    'TW': ['Taiwan', 'Taiwán', 'tw'],
    'TH': ['Thailand', 'Tailandia', 'th'],
    'TR': ['Turkey', 'Turquía', 'TR', 'tr'],
    'UY': ['Uruguay', 'uy'],
    'VN': ['Vietnam', 'vn'],
    'KR': ['South Korea', 'Corea del Sur', 'kr'],
    'EC': ['Ecuador', 'ec'],
    'SK': ['Slovakia', 'Eslovaquia', 'sk']
  };

  for (const country of countries) {
    try {
      const possibleValues = countryCodeToValues[country.code] || [country.code];
      
      // Build the query with OR conditions for each possible value
      let query = supabase
        .from('hotels')
        .select('id, name, country')
        .eq('status', 'approved');
        
      query = query.or(possibleValues.map(value => `country.eq.${value}`).join(','));
      
      const { data: hotels, error } = await query;
      
      if (error) {
        console.log(`❌ ${country.name} (${country.code}) - ERROR: ${error.message}`);
      } else {
        const count = hotels?.length || 0;
        const status = count > 0 ? '✅ OK' : '⚠️  NO HOTELS';
        console.log(`${status} ${country.name} (${country.code}) - ${count} hotels`);
        
        if (count > 0) {
          // Show which database values were found
          const foundValues = [...new Set(hotels.map(h => h.country))];
          console.log(`   Found DB values: [${foundValues.join(', ')}]`);
        }
      }
    } catch (err) {
      console.log(`❌ ${country.name} (${country.code}) - EXCEPTION: ${err}`);
    }
  }
  
  console.log('==================================');
  console.log('✅ Country filter verification complete');
}