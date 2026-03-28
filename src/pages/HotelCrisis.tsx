import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function HotelCrisis() {
  const { t } = useTranslation('hotel-crisis');

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-8 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-lg overflow-hidden border-none p-8 bg-[#5f0276]/90 backdrop-blur-sm">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-[#f9d3f6] mb-8">
                🌍 {t('title')}
              </h1>
              
              <div className="space-y-6 text-white leading-relaxed">
                <p className="text-lg">
                  {t('introduction')}
                </p>
                
                <p className="text-lg font-semibold text-[#f9d3f6]">
                  {t('fallOfNumbers')}
                </p>
                
                <div>
                  <p className="text-lg font-medium mb-3">{t('exampleTitle')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('examplePoint1')}</li>
                    <li>{t('examplePoint2')}</li>
                    <li>{t('examplePoint3')}</li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-lg font-semibold text-[#f9d3f6]">{t('officialIndex')}</p>
                  <p className="text-lg italic pl-4 border-l-4 border-fuchsia-400 ml-4">
                    {t('officialIndexQuote')}
                  </p>
                </div>
                
                <p className="text-lg font-semibold text-[#f9d3f6]">
                  {t('realityCheck')}
                </p>
                
                <p>{t('globalImpact')}</p>
                
                <hr className="border-fuchsia-400/30 my-8" />
                
                <h2 className="text-2xl font-bold text-[#f9d3f6] mb-4">
                  {t('seasonalClosuresTitle')}
                </h2>
                
                <p>{t('seasonalClosuresIntro')}</p>
                
                <div>
                  <p className="text-lg font-semibold text-[#f9d3f6] mb-3">{t('closureReasonsTitle')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('closureReason1')}</li>
                    <li>{t('closureReason2')}</li>
                    <li>{t('closureReason3')}</li>
                    <li>{t('closureReason4')}</li>
                    <li>{t('closureReason5')}</li>
                  </ul>
                </div>
                
                <h2 className="text-2xl font-bold text-[#f9d3f6] mb-4">
                  {t('perfectStormTitle')}
                </h2>
                
                <p>{t('perfectStormIntro')}</p>
                
                <p>{t('europeExample')}</p>
                
                <p>{t('tasmaniaExample')}</p>
                
                <p>{t('usExample')}</p>
                
                <hr className="border-fuchsia-400/30 my-8" />
                
                <h2 className="text-2xl font-bold text-[#f9d3f6] mb-4">
                  {t('consequencesTitle')}
                </h2>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('consequence1')}</li>
                  <li>{t('consequence2')}</li>
                  <li>{t('consequence3')}</li>
                  <li>{t('consequence4')}</li>
                  <li>{t('consequence5')}</li>
                </ul>
                
                <hr className="border-fuchsia-400/30 my-8" />
                
                <h2 className="text-2xl font-bold text-[#f9d3f6] mb-4">
                  {t('solutionTitle')}
                </h2>
                
                <p className="text-lg font-medium text-[#f9d3f6]">
                  {t('solutionText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}