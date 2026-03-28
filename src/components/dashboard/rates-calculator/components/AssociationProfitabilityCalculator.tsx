import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AssociationProfitabilityCalculator: React.FC = () => {
  const { t } = useTranslation('hotelAssociation');
  
  // Input state
  const [hotelMembers, setHotelMembers] = useState<number>(1000);
  const [emptyRoomsPerDay, setEmptyRoomsPerDay] = useState<number>(10);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(1300);
  
  // Calculated values
  const [totalEmptyRoomsPerYear, setTotalEmptyRoomsPerYear] = useState<number>(0);
  const [totalMonthlyPackages, setTotalMonthlyPackages] = useState<number>(0);
  const [estimatedGrossRevenue, setEstimatedGrossRevenue] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);

  // Calculate values whenever inputs change
  useEffect(() => {
    const emptyRoomsYear = hotelMembers * emptyRoomsPerDay * 365;
    const monthlyPackages = Math.floor(emptyRoomsYear / 29);
    const grossRevenue = monthlyPackages * monthlyPrice;
    const commissionAmount = grossRevenue * 0.04;

    setTotalEmptyRoomsPerYear(emptyRoomsYear);
    setTotalMonthlyPackages(monthlyPackages);
    setEstimatedGrossRevenue(grossRevenue);
    setCommission(commissionAmount);
  }, [hotelMembers, emptyRoomsPerDay, monthlyPrice]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Calculator Container */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)] overflow-hidden">
        
        {/* Title Section */}
        <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 px-8 py-6 border-b border-white/10">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-yellow-300 text-center drop-shadow-md">
            {t('calculator.title')}
          </h2>
          <div className="mt-4 text-center">
            <p className="text-sm text-white/70 leading-relaxed max-w-4xl mx-auto">
              Cifras estimativas basadas en un escenario de ocupación máxima. Los resultados reales variarán según el número de paquetes efectivamente vendidos, con un precio promedio mensual estimado en $1,300. Esta media considera estancias sin comidas, diversas categorías hoteleras y ocupaciones dobles e individuales.
            </p>
          </div>
        </div>

        {/* Calculator Content */}
        <div className="p-8 md:p-12">
          <div className="space-y-10">
            
            {/* Input Fields Grid */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
              
              {/* Hotel Members */}
              <div className="space-y-4">
                <label htmlFor="hotel-members" className="block text-lg md:text-xl font-semibold text-white/90 uppercase tracking-wide leading-tight">
                  ¿CUÁNTOS HOTELES MIEMBROS TIENE SU ASOCIACIÓN?
                </label>
                <input
                  id="hotel-members"
                  type="number"
                  value={hotelMembers}
                  onChange={(e) => setHotelMembers(Number(e.target.value))}
                  className="w-full text-xl font-bold bg-white text-[#68178D] border-3 border-white/30 rounded-xl p-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200 shadow-lg"
                  placeholder="1000"
                />
              </div>

              {/* Empty Rooms Per Day */}
              <div className="space-y-4">
                <label htmlFor="empty-rooms" className="block text-lg md:text-xl font-semibold text-white/90 uppercase tracking-wide leading-tight">
                  ¿CUÁNTAS HABITACIONES VACÍAS TIENEN POR DÍA EN PROMEDIO?
                </label>
                <input
                  id="empty-rooms"
                  type="number"
                  value={emptyRoomsPerDay}
                  onChange={(e) => setEmptyRoomsPerDay(Number(e.target.value))}
                  className="w-full text-xl font-bold bg-white text-[#68178D] border-3 border-white/30 rounded-xl p-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200 shadow-lg"
                  placeholder="10"
                />
              </div>

              {/* Monthly Price */}
              <div className="space-y-4">
                <label htmlFor="monthly-price" className="block text-lg md:text-xl font-semibold text-white/90 uppercase tracking-wide leading-tight">
                  PRECIO PROMEDIO DEL PAQUETE MENSUAL
                </label>
                <input
                  id="monthly-price"
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                  className="w-full text-xl font-bold bg-white text-[#68178D] border-3 border-white/30 rounded-xl p-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200 shadow-lg"
                  placeholder="1300"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="pt-8 border-t border-white/20">
              {/* Hidden calculations for reference */}
              <div className="hidden">
                <div>Total empty rooms per year: {formatNumber(totalEmptyRoomsPerYear)}</div>
                <div>Total monthly packages: {formatNumber(totalMonthlyPackages)}</div>
                <div>Estimated gross revenue: {formatCurrency(estimatedGrossRevenue)}</div>
              </div>

              {/* Final Commission Result */}
              <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-yellow-400/30 shadow-2xl">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-wider mb-6 drop-shadow-md">
                    {t('calculator.commissionLabel')}
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl mb-4">
                    {formatCurrency(commission)}
                  </div>
                  <div className="inline-block bg-yellow-400/20 rounded-full px-6 py-2 border border-yellow-400/40">
                    <span className="text-lg font-semibold text-yellow-300 uppercase tracking-wide">
                      Anual
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gradient-to-br from-purple-600/40 via-purple-700/40 to-fuchsia-700/40 rounded-xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/20">
              <p className="text-sm text-white/60 leading-relaxed text-center italic">
                Las cifras presentadas son estimaciones basadas en el potencial máximo de ocupación.
                Los resultados reales pueden variar en función del número de paquetes efectivamente vendidos y del precio promedio mensual.
                Este último —fijado en $1,300— representa una media ponderada que contempla estancias sin servicio de comidas, así como hoteles de distintas categorías, con ocupaciones tanto individuales como dobles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};