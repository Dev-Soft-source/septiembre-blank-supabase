import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";
const AmbassadorsList = () => {
  const { t } = useTranslation('ambassador');
  
  return <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-[#7E00B3]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
              

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <Link to="/ambassadors/usa" className="bg-[#70009E] hover:bg-[#70009E]/80 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg">
                  {t('buttons.viewAmbassadors')}
                </Link>
                <a href="https://www.hotel-living.com/registerUser" className="bg-[#70009E] hover:bg-[#70009E]/80 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg text-center">
                  <div>{t('buttons.becomeAmbassador')}</div>
                  <div className="text-sm">{t('buttons.throughUserPanel')}</div>
                </a>
              </div>

              <div className="flex justify-center items-center space-x-6">
                <Link to="/ambassadors/usa" className="group bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 text-center">
                  <div className="text-6xl mb-4">🇺🇸</div>
                  <h3 className="text-xl font-bold mb-2">Estados Unidos</h3>
                  <p className="text-sm opacity-80">7 Embajadores</p>
                </Link>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm italic opacity-70">Más países próximamente</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>;
};
export default AmbassadorsList;