
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function FeaturedHotels() {
  const { t } = useTranslation('content');

  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="glass-card rounded-2xl p-6 mb-8 bg-[#6a1d72]">
            <h2 className="text-2xl font-semibold mb-6 text-fuchsia-100">
              {t('featuredHotelsContent.pageTitle')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Empty grid for real hotel data to be populated later */}
            </div>
            
            <div className="mt-10 p-4 bg-[#5d0478]/70 rounded-lg text-center">
              <h3 className="text-lg font-medium text-fuchsia-200 mb-2 px-[54px] py-[14px]">
                {t('featuredHotelsContent.wantToBeFirst')}
              </h3>
              <p className="text-fuchsia-100 text-lg py-[21px]">
                {t('featuredHotelsContent.featureDescription')}
              </p>
              <p className="text-fuchsia-100 mt-1 text-lg px-[17px] py-[16px]">
                {t('featuredHotelsContent.loginForInfo')}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
