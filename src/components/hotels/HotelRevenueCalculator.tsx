import React, { useState, useMemo } from 'react';
import { useTranslation } from "@/hooks/useTranslation";
export function HotelRevenueCalculator() {
  const {
    language,
    t
  } = useTranslation();
  const [emptyRooms, setEmptyRooms] = useState<string>('10');
  const [monthlyPrice, setMonthlyPrice] = useState<string>('1500');
  const calculatedRevenue = useMemo(() => {
    const rooms = parseFloat(emptyRooms) || 0;
    const price = parseFloat(monthlyPrice) || 0;
    if (rooms <= 0 || price <= 0) return 0;

    // Formula: (Empty rooms × 365 ÷ 28) × Monthly price
    return Math.round(rooms * 365 / 28 * price);
  }, [emptyRooms, monthlyPrice]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  const getLabels = () => {
    switch (language) {
      case 'es':
        return {
          emptyRoomsLabel: '¿CUÁNTAS HABITACIONES VACÍAS\nDIARIAS, DE MEDIA?',
          monthlyPriceLabel: '¿PRECIO POR MES? ($)',
          resultTitle: 'INGRESOS EXTRA ANUALES*',
          resultPrefix: ''
        };
      case 'pt':
        return {
          emptyRoomsLabel: 'QUANTOS QUARTOS VAZIOS POR DIA,\nEM MÉDIA?',
          monthlyPriceLabel: 'PREÇO MENSAL?',
          resultTitle: 'RECEITA EXTRA ANUAL*',
          resultPrefix: ''
        };
      case 'ro':
        return {
          emptyRoomsLabel: 'CÂTE CAMERE LIBERE PE ZI,\nÎN MEDIE?',
          monthlyPriceLabel: 'PREȚ PE LUNĂ?',
          resultTitle: 'VENITURI EXTRA ANUALE*',
          resultPrefix: ''
        };
      default:
        return {
          emptyRoomsLabel: 'HOW MANY EMPTY ROOMS PER DAY,\nON AVERAGE?',
          monthlyPriceLabel: 'MONTHLY PRICE?',
          resultTitle: 'EXTRA ANNUAL REVENUE*',
          resultPrefix: ''
        };
    }
  };
  const labels = getLabels();
  return <div className="w-full max-w-xl mx-auto mt-6 mb-6 animate-fade-in">
      {/* Calculator Box - Professional styling with purple background */}
      <div className="border border-gray-400 rounded-lg p-4 shadow-md relative" style={{ backgroundColor: '#7204B8' }}>
        <div className="space-y-4">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* Empty Rooms Input */}
             <div className="space-y-2">
                 <div className="h-12 flex items-center justify-center">
                   <label className="block text-white font-medium text-base text-center uppercase">
                    {labels.emptyRoomsLabel}
                   </label>
                 </div>
              <input type="number" value={emptyRooms} onChange={e => setEmptyRooms(e.target.value)} placeholder="0" min="0" step="1" className="w-full px-3 py-2 bg-purple-700 border-2 border-gray-400 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center text-xl shadow-sm" />
            </div>
            
             {/* Monthly Price Input */}
             <div className="space-y-2">
                <div className="h-12 flex items-center justify-center">
                  <label className="block text-white font-medium text-base text-center whitespace-pre-line uppercase">
                    {labels.monthlyPriceLabel}
                  </label>
                </div>
              <input type="number" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} placeholder="1500" min="0" step="50" className="w-full px-3 py-2 bg-purple-700 border-2 border-gray-400 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center text-xl shadow-sm" />
            </div>
          </div>
          
          {/* Result Display */}
          <div className="mt-4 p-3 rounded-md border-2 border-gray-400 text-center space-y-2 shadow-sm relative" style={{ backgroundColor: '#7204B8' }}>
            <p className="text-xl font-semibold uppercase text-white">
              {labels.resultTitle}
            </p>
            <p className="text-white text-3xl font-bold">
              {formatCurrency(calculatedRevenue)} USD
            </p>
            <div className="mt-3">
              <p className="text-base text-center text-white">
                {t('hotels:calculator.profitExplanation')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}