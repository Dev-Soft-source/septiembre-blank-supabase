import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export function AssociationMiniCalculator() {
  const { t } = useTranslation("association");
  const [hotels, setHotels] = useState<string>("100");
  const [roomsPerHotel, setRoomsPerHotel] = useState<string>("10");
  const [avgPrice, setAvgPrice] = useState<string>("1500");

  // Calculate values
  const hotelCount = parseInt(hotels) || 0;
  const roomsCount = parseInt(roomsPerHotel) || 0;
  const priceValue = parseInt(avgPrice) || 0;

  const hotelSales = Math.round((hotelCount * roomsCount * 365 / 12) * priceValue);
  const associationEarnings = Math.round((hotelSales / 100) * 4);

  return (
    <div className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-8 md:p-12 border border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.4)] max-w-2xl mx-auto">
      <div className="mx-auto">
        {/* Calculator Title */}
        <h3 className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-wide mb-8 text-center">
          {t("calculator.title")}
        </h3>
        
        {/* Calculator embedded style */}
        <div className="bg-gray-100 rounded-xl p-6 border-2 border-gray-300 shadow-inner mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col">
              <label className="block text-gray-700 font-semibold mb-2 text-center uppercase text-sm flex-shrink-0">
                {t("calculator.labels.hotels")}
              </label>
              <Input
                type="number"
                value={hotels}
                onChange={(e) => setHotels(e.target.value)}
                className="bg-white border-2 border-gray-400 text-gray-800 text-center text-xl font-bold shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-auto"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-gray-700 font-semibold mb-2 text-center uppercase text-sm flex-shrink-0">
                {t("calculator.labels.rooms")}
              </label>
              <Input
                type="number"
                value={roomsPerHotel}
                onChange={(e) => setRoomsPerHotel(e.target.value)}
                className="bg-white border-2 border-gray-400 text-gray-800 text-center text-xl font-bold shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-auto"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="block text-gray-700 font-semibold mb-2 text-center uppercase text-sm flex-shrink-0">
                {t("calculator.labels.price")}
              </label>
              <Input
                type="number"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                className="bg-white border-2 border-gray-400 text-gray-800 text-center text-xl font-bold shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-auto"
              />
            </div>
          </div>
        </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
              <div className="text-white text-lg font-bold mb-2">
                {t("calculator.results.hotelBenefits")}
              </div>
              <p className="text-yellow-300 font-bold text-2xl">
                ${hotelSales.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
              <div className="text-white text-lg font-bold mb-2">
                {t("calculator.results.associationBenefits")}
              </div>
              <p className="text-yellow-300 font-bold text-2xl">
                ${associationEarnings.toLocaleString()}
              </p>
            </div>
          </div>
      </div>

    </div>
  );
}