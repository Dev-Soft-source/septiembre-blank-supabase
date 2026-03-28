import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CountryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

// Complete list of countries with translations
const COUNTRIES_DATA = {
  en: [
    { value: 'Germany', label: 'Germany' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Belgium', label: 'Belgium' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'South Korea', label: 'South Korea' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Croatia', label: 'Croatia' },
    { value: 'Denmark', label: 'Denmark' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egypt', label: 'Egypt' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'Slovakia', label: 'Slovakia' },
    { value: 'Spain', label: 'Spain' },
    { value: 'United States', label: 'United States' },
    { value: 'Estonia', label: 'Estonia' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Finland', label: 'Finland' },
    { value: 'France', label: 'France' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Greece', label: 'Greece' },
    { value: 'Hungary', label: 'Hungary' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'Iceland', label: 'Iceland' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Kazakhstan', label: 'Kazakhstan' },
    { value: 'Latvia', label: 'Latvia' },
    { value: 'Lithuania', label: 'Lithuania' },
    { value: 'Luxembourg', label: 'Luxembourg' },
    { value: 'Malaysia', label: 'Malaysia' },
    { value: 'Malta', label: 'Malta' },
    { value: 'Morocco', label: 'Morocco' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'Norway', label: 'Norway' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Panama', label: 'Panama' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Czech Republic', label: 'Czech Republic' },
    { value: 'Dominican Republic', label: 'Dominican Republic' },
    { value: 'Romania', label: 'Romania' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'Switzerland', label: 'Switzerland' },
    { value: 'Thailand', label: 'Thailand' },
    { value: 'Taiwan', label: 'Taiwan' },
    { value: 'Turkey', label: 'Turkey' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Vietnam', label: 'Vietnam' }
  ],
  es: [
    { value: 'Germany', label: 'Alemania' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Belgium', label: 'Bélgica' },
    { value: 'Brazil', label: 'Brasil' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Canada', label: 'Canadá' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'South Korea', label: 'Corea del Sur' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Croatia', label: 'Croacia' },
    { value: 'Denmark', label: 'Dinamarca' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egypt', label: 'Egipto' },
    { value: 'United Arab Emirates', label: 'Emiratos Árabes Unidos' },
    { value: 'Slovakia', label: 'Eslovaquia' },
    { value: 'Spain', label: 'España' },
    { value: 'United States', label: 'Estados Unidos' },
    { value: 'Estonia', label: 'Estonia' },
    { value: 'Philippines', label: 'Filipinas' },
    { value: 'Finland', label: 'Finlandia' },
    { value: 'France', label: 'Francia' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Greece', label: 'Grecia' },
    { value: 'Hungary', label: 'Hungría' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Ireland', label: 'Irlanda' },
    { value: 'Iceland', label: 'Islandia' },
    { value: 'Italy', label: 'Italia' },
    { value: 'Japan', label: 'Japón' },
    { value: 'Kazakhstan', label: 'Kazajistán' },
    { value: 'Latvia', label: 'Letonia' },
    { value: 'Lithuania', label: 'Lituania' },
    { value: 'Luxembourg', label: 'Luxemburgo' },
    { value: 'Malaysia', label: 'Malasia' },
    { value: 'Malta', label: 'Malta' },
    { value: 'Morocco', label: 'Marruecos' },
    { value: 'Mexico', label: 'México' },
    { value: 'Norway', label: 'Noruega' },
    { value: 'New Zealand', label: 'Nueva Zelanda' },
    { value: 'Netherlands', label: 'Países Bajos' },
    { value: 'Panama', label: 'Panamá' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Peru', label: 'Perú' },
    { value: 'Poland', label: 'Polonia' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'United Kingdom', label: 'Reino Unido' },
    { value: 'Czech Republic', label: 'República Checa' },
    { value: 'Dominican Republic', label: 'República Dominicana' },
    { value: 'Romania', label: 'Rumanía' },
    { value: 'Singapore', label: 'Singapur' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Sweden', label: 'Suecia' },
    { value: 'Switzerland', label: 'Suiza' },
    { value: 'Thailand', label: 'Tailandia' },
    { value: 'Taiwan', label: 'Taiwán' },
    { value: 'Turkey', label: 'Turquía' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Vietnam', label: 'Vietnam' }
  ],
  pt: [
    { value: 'Germany', label: 'Alemanha' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Austrália' },
    { value: 'Austria', label: 'Áustria' },
    { value: 'Belgium', label: 'Bélgica' },
    { value: 'Brazil', label: 'Brasil' },
    { value: 'Bulgaria', label: 'Bulgária' },
    { value: 'Canada', label: 'Canadá' },
    { value: 'Colombia', label: 'Colômbia' },
    { value: 'South Korea', label: 'Coreia do Sul' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Croatia', label: 'Croácia' },
    { value: 'Denmark', label: 'Dinamarca' },
    { value: 'Ecuador', label: 'Equador' },
    { value: 'Egypt', label: 'Egito' },
    { value: 'United Arab Emirates', label: 'Emirados Árabes Unidos' },
    { value: 'Slovakia', label: 'Eslováquia' },
    { value: 'Spain', label: 'Espanha' },
    { value: 'United States', label: 'Estados Unidos' },
    { value: 'Estonia', label: 'Estônia' },
    { value: 'Philippines', label: 'Filipinas' },
    { value: 'Finland', label: 'Finlândia' },
    { value: 'France', label: 'França' },
    { value: 'Georgia', label: 'Geórgia' },
    { value: 'Greece', label: 'Grécia' },
    { value: 'Hungary', label: 'Hungria' },
    { value: 'Indonesia', label: 'Indonésia' },
    { value: 'Ireland', label: 'Irlanda' },
    { value: 'Iceland', label: 'Islândia' },
    { value: 'Italy', label: 'Itália' },
    { value: 'Japan', label: 'Japão' },
    { value: 'Kazakhstan', label: 'Cazaquistão' },
    { value: 'Latvia', label: 'Letônia' },
    { value: 'Lithuania', label: 'Lituânia' },
    { value: 'Luxembourg', label: 'Luxemburgo' },
    { value: 'Malaysia', label: 'Malásia' },
    { value: 'Malta', label: 'Malta' },
    { value: 'Morocco', label: 'Marrocos' },
    { value: 'Mexico', label: 'México' },
    { value: 'Norway', label: 'Noruega' },
    { value: 'New Zealand', label: 'Nova Zelândia' },
    { value: 'Netherlands', label: 'Países Baixos' },
    { value: 'Panama', label: 'Panamá' },
    { value: 'Paraguay', label: 'Paraguai' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Poland', label: 'Polônia' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'United Kingdom', label: 'Reino Unido' },
    { value: 'Czech Republic', label: 'República Tcheca' },
    { value: 'Dominican Republic', label: 'República Dominicana' },
    { value: 'Romania', label: 'Romênia' },
    { value: 'Singapore', label: 'Singapura' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Sweden', label: 'Suécia' },
    { value: 'Switzerland', label: 'Suíça' },
    { value: 'Thailand', label: 'Tailândia' },
    { value: 'Taiwan', label: 'Taiwan' },
    { value: 'Turkey', label: 'Turquia' },
    { value: 'Uruguay', label: 'Uruguai' },
    { value: 'Vietnam', label: 'Vietnã' }
  ],
  ro: [
    { value: 'Germany', label: 'Germania' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Belgium', label: 'Belgia' },
    { value: 'Brazil', label: 'Brazilia' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Colombia', label: 'Columbia' },
    { value: 'South Korea', label: 'Coreea de Sud' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Croatia', label: 'Croația' },
    { value: 'Denmark', label: 'Danemarca' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egypt', label: 'Egipt' },
    { value: 'United Arab Emirates', label: 'Emiratele Arabe Unite' },
    { value: 'Slovakia', label: 'Slovacia' },
    { value: 'Spain', label: 'Spania' },
    { value: 'United States', label: 'Statele Unite' },
    { value: 'Estonia', label: 'Estonia' },
    { value: 'Philippines', label: 'Filipine' },
    { value: 'Finland', label: 'Finlanda' },
    { value: 'France', label: 'Franța' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Greece', label: 'Grecia' },
    { value: 'Hungary', label: 'Ungaria' },
    { value: 'Indonesia', label: 'Indonezia' },
    { value: 'Ireland', label: 'Irlanda' },
    { value: 'Iceland', label: 'Islanda' },
    { value: 'Italy', label: 'Italia' },
    { value: 'Japan', label: 'Japonia' },
    { value: 'Kazakhstan', label: 'Kazahstan' },
    { value: 'Latvia', label: 'Letonia' },
    { value: 'Lithuania', label: 'Lituania' },
    { value: 'Luxembourg', label: 'Luxemburg' },
    { value: 'Malaysia', label: 'Malaezia' },
    { value: 'Malta', label: 'Malta' },
    { value: 'Morocco', label: 'Maroc' },
    { value: 'Mexico', label: 'Mexic' },
    { value: 'Norway', label: 'Norvegia' },
    { value: 'New Zealand', label: 'Noua Zeelandă' },
    { value: 'Netherlands', label: 'Țările de Jos' },
    { value: 'Panama', label: 'Panama' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Poland', label: 'Polonia' },
    { value: 'Portugal', label: 'Portugalia' },
    { value: 'United Kingdom', label: 'Regatul Unit' },
    { value: 'Czech Republic', label: 'Republica Cehă' },
    { value: 'Dominican Republic', label: 'Republica Dominicană' },
    { value: 'Romania', label: 'România' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Sweden', label: 'Suedia' },
    { value: 'Switzerland', label: 'Elveția' },
    { value: 'Thailand', label: 'Thailanda' },
    { value: 'Taiwan', label: 'Taiwan' },
    { value: 'Turkey', label: 'Turcia' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Vietnam', label: 'Vietnam' }
  ]
};

export const CountryDropdown = ({ value, onChange, placeholder }: CountryDropdownProps) => {
  const { t, language } = useTranslation('dashboard/hotel-registration');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize text for comparison (remove accents, lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Get countries for current language and sort alphabetically
  const getCountriesForLanguage = () => {
    const langKey = language as keyof typeof COUNTRIES_DATA;
    const countries = COUNTRIES_DATA[langKey] || COUNTRIES_DATA.en;
    return [...countries].sort((a, b) => a.label.localeCompare(b.label, language));
  };

  const availableCountries = getCountriesForLanguage();

  // Filter countries based on search term
  const filteredCountries = availableCountries.filter(country => {
    const normalizedCountry = normalizeText(country.label);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedCountry.includes(normalizedSearch);
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // Check if the input exactly matches a country
    const exactMatch = availableCountries.find(
      country => normalizeText(country.label) === normalizeText(newValue)
    );
    
    if (exactMatch && onChange) {
      onChange(exactMatch.value);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: { value: string; label: string }) => {
    setInputValue(country.label);
    setSearchTerm('');
    setIsOpen(false);
    if (onChange) {
      onChange(country.value);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        
        // Allow partial inputs - don't clear unless completely empty
        if (inputValue === '') {
          if (onChange) {
            onChange('');
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, onChange]);

  // Update input value when prop value changes
  useEffect(() => {
    if (value !== undefined) {
      const country = availableCountries.find(c => c.value === value);
      setInputValue(country ? country.label : value);
    }
  }, [value, availableCountries]);

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t('basicInfo.countryPlaceholder')}
          className="w-full bg-[#7E26A6] border border-white/30 text-white placeholder:text-white/60 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 pr-10"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              inputRef.current?.focus();
            }
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#7E26A6] border border-white/30 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.value}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className="w-full px-3 py-2 text-left text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none first:rounded-t-md last:rounded-b-md"
              >
                {country.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-white/60 text-sm">
              No matching countries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};