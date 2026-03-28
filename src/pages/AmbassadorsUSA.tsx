import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";

// Import ambassador images
import davidThompsonImg from "@/assets/ambassadors/david-thompson.jpg";
import marianaLopezImg from "@/assets/ambassadors/mariana-lopez.jpg";
import jamesCarterImg from "@/assets/ambassadors/james-carter.jpg";
import elenaRodriguezImg from "@/assets/ambassadors/elena-rodriguez.jpg";
import michaelNguyenImg from "@/assets/ambassadors/michael-nguyen.jpg";
import sarahMillerImg from "@/assets/ambassadors/sarah-miller.jpg";
import ricardoSanchezImg from "@/assets/ambassadors/ricardo-sanchez.jpg";

const ambassadors = [
  {
    id: 1,
    name: "David Thompson",
    image: davidThompsonImg,
    bioKey: "usa.ambassadors.davidThompson"
  },
  {
    id: 2,
    name: "Mariana López",
    image: marianaLopezImg,
    bioKey: "usa.ambassadors.marianaLopez"
  },
  {
    id: 3,
    name: "James Carter",
    image: jamesCarterImg,
    bioKey: "usa.ambassadors.jamesCarter"
  },
  {
    id: 4,
    name: "Elena Rodríguez",
    image: elenaRodriguezImg,
    bioKey: "usa.ambassadors.elenaRodriguez"
  },
  {
    id: 5,
    name: "Michael Nguyen",
    image: michaelNguyenImg,
    bioKey: "usa.ambassadors.michaelNguyen"
  },
  {
    id: 6,
    name: "Sarah Miller",
    image: sarahMillerImg,
    bioKey: "usa.ambassadors.sarahMiller"
  },
  {
    id: 7,
    name: "Ricardo Sánchez",
    image: ricardoSanchezImg,
    bioKey: "usa.ambassadors.ricardoSanchez"
  }
];

const AmbassadorsUSA = () => {
  const { t } = useTranslation('ambassador');
  
  return (
    <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-purple-900/80 backdrop-blur-sm rounded-lg p-8 text-white">
              
              {/* Header with back button */}
              <div className="flex items-center mb-8">
                <Link 
                  to="/ambassadors" 
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mr-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t('usa.backButton')}</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">🇺🇸</span>
                  <div>
                    <h1 className="text-3xl font-bold">{t('usa.title')}</h1>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <Link to="/ambassadors/usa" className="bg-[#70009E] hover:bg-[#70009E]/80 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg">
                  {t('buttons.viewAmbassadors')}
                </Link>
                <a href="https://www.hotel-living.com/registerUser" className="bg-[#70009E] hover:bg-[#70009E]/80 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg text-center">
                  <div>{t('buttons.becomeAmbassador')}</div>
                  <div className="text-sm">a través de su panel de usuario</div>
                </a>
              </div>

              {/* Ambassador Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ambassadors.map((ambassador) => (
                  <div 
                    key={ambassador.id} 
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="mb-4">
                      <img 
                        src={ambassador.image} 
                        alt={ambassador.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/20"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{ambassador.name}</h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      "{t(ambassador.bioKey)}"
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AmbassadorsUSA;