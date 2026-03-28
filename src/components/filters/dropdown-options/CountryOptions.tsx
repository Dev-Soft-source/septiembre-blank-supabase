import React from "react";
import { FilterState } from "../FilterTypes";
import { useTranslation } from "@/hooks/useTranslation";

interface CountryOptionsProps {
  type: keyof FilterState;
  fontSize: string;
}

export const CountryOptions: React.FC<CountryOptionsProps> = ({ type, fontSize }) => {
  const { language } = useTranslation();
  
  // Exact countries list from user backup - in Romanian as requested
  const countries = [
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'BE', name: 'Belgia', flag: '🇧🇪' },
    { code: 'BR', name: 'Brazilia', flag: '🇧🇷' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'CO', name: 'Columbia', flag: '🇨🇴' },
    { code: 'KR', name: 'Coreea de Sud', flag: '🇰🇷' },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
    { code: 'HR', name: 'Croația', flag: '🇭🇷' },
    { code: 'DK', name: 'Danemarca', flag: '🇩🇰' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
    { code: 'EG', name: 'Egipt', flag: '🇪🇬' },
    { code: 'CH', name: 'Elveția', flag: '🇨🇭' },
    { code: 'AE', name: 'Emiratele Arabe Unite', flag: '🇦🇪' },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
    { code: 'PH', name: 'Filipine', flag: '🇵🇭' },
    { code: 'FI', name: 'Finlanda', flag: '🇫🇮' },
    { code: 'FR', name: 'Franța', flag: '🇫🇷' },
    { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
    { code: 'DE', name: 'Germania', flag: '🇩🇪' },
    { code: 'GR', name: 'Grecia', flag: '🇬🇷' },
    { code: 'ID', name: 'Indonezia', flag: '🇮🇩' },
    { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
    { code: 'IS', name: 'Islanda', flag: '🇮🇸' },
    { code: 'IT', name: 'Italia', flag: '🇮🇹' },
    { code: 'JP', name: 'Japonia', flag: '🇯🇵' },
    { code: 'KZ', name: 'Kazahstan', flag: '🇰🇿' },
    { code: 'LV', name: 'Letonia', flag: '🇱🇻' },
    { code: 'LT', name: 'Lituania', flag: '🇱🇹' },
    { code: 'LU', name: 'Luxemburg', flag: '🇱🇺' },
    { code: 'MY', name: 'Malaezia', flag: '🇲🇾' },
    { code: 'MT', name: 'Malta', flag: '🇲🇹' },
    { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
    { code: 'MX', name: 'Mexic', flag: '🇲🇽' },
    { code: 'NO', name: 'Norvegia', flag: '🇳🇴' },
    { code: 'NZ', name: 'Noua Zeelandă', flag: '🇳🇿' },
    { code: 'PA', name: 'Panama', flag: '🇵🇦' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'PL', name: 'Polonia', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugalia', flag: '🇵🇹' },
    { code: 'GB', name: 'Regatul Unit', flag: '🇬🇧' },
    { code: 'CZ', name: 'Republica Cehă', flag: '🇨🇿' },
    { code: 'DO', name: 'Republica Dominicană', flag: '🇩🇴' },
    { code: 'RO', name: 'România', flag: '🇷🇴' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'SK', name: 'Slovacia', flag: '🇸🇰' },
    { code: 'ES', name: 'Spania', flag: '🇪🇸' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: 'US', name: 'Statele Unite', flag: '🇺🇸' },
    { code: 'SE', name: 'Suedia', flag: '🇸🇪' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'NL', name: 'Țările de Jos', flag: '🇳🇱' },
    { code: 'TH', name: 'Thailanda', flag: '🇹🇭' },
    { code: 'TR', name: 'Turcia', flag: '🇹🇷' },
    { code: 'HU', name: 'Ungaria', flag: '🇭🇺' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳' }
  ];
  
  if (countries.length === 0) {
    return (
      <div className={`w-full text-left px-3 py-2 rounded-md ${fontSize} text-fuchsia-300/70`}>
        {language === 'es' ? 'No hay países disponibles' : 
         language === 'pt' ? 'Nenhum país disponível' : 
         language === 'ro' ? 'Nu sunt țări disponibile' : 
         'No countries available'}
      </div>
    );
  }
  
  return (
    <>
      {countries.map((country) => (
        <button
          key={country.code}
          onClick={() => {
            console.log("CountryOptions - Country filter selected:", country.code);
            console.log("CountryOptions - Event type:", type);
            document.dispatchEvent(new CustomEvent('updateFilter', { 
              detail: { key: type, value: country.code } 
            }));
          }}
          className={`w-full text-left px-3 py-2 rounded-md ${fontSize} font-bold transition-colors hover:bg-[#460F54] flex items-center justify-between`} 
        >
          <span>{country.name}</span>
          <span>{country.flag}</span>
        </button>
      ))}
    </>
  );
};