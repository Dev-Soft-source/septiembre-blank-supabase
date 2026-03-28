import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
export function Footer() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { t } = useTranslation('footer');
  const { t: tNav } = useTranslation('navigation');
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  return <footer className="py-2 sm:py-4 px-2 sm:px-4 border-t border-[#3300B0]/20 mt-20 animate-fade-in" style={{
    backgroundColor: "#996515"
  }}>
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className={`${isMobile ? "mb-4" : "mb-6"} animate-fade-in`} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className={isMobile ? "h-[59.67px]" : ""}>
              <Logo />
            </div>
          </div>
          
          {/* Extra spacing between logo and menu for mobile */}
          {isMobile && <div className="mb-8"></div>}
          
          {/* Mobile Navigation Links - only on mobile */}
          {isMobile && (
            <div className="w-full mb-6 animate-fade-in px-2" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              <div className="flex flex-col space-y-2 text-center text-white text-xs font-bold">
                <Link to="/clientes" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.customers')}
                </Link>
                <Link to="/lider-living" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.groupLeader')}
                </Link>
                <Link to="/press" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.press')}
                </Link>
                <Link to="/affinity-stays" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.affinities')}
                </Link>
                <Link to="/promotor-local" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.promoter')}
                </Link>
                <Link to="/videos" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.videos')}
                </Link>
                <Link to="/faq" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  FAQ
                </Link>
                <Link to="/ambassador" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.ambassador')}
                </Link>
                <Link to="/hotels" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('mainNavigationContent.mobileSimple.hotel')}
                </Link>
                <Link to="/grupos-hoteleros" className="block text-white hover:text-white/90 text-xs font-bold transition-all duration-300 hover:scale-105 py-1">
                  {tNav('navigation.hotelGroups')}
                </Link>
              </div>
            </div>
          )}
          
          {/* Footer Menu - Single column on mobile, 5 columns on desktop */}
          <div className={`w-full max-w-6xl ${isMobile ? "mb-4" : "mb-8"} animate-fade-in px-2 sm:px-0`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className={`grid ${isMobile ? "grid-cols-1 gap-y-4" : "grid-cols-5 gap-6"} text-center text-white ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold`}>
              
              {/* Column 1: About Us */}
              <div className="space-y-1 sm:space-y-2">
                <button 
                  onClick={() => setIsAboutUsOpen(!isAboutUsOpen)}
                  className={`text-white font-bold ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} mb-1 sm:mb-2 px-1 sm:px-2 py-0.5 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity`}
                >
                  {t('footer.sections.aboutUs')}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAboutUsOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isAboutUsOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <Link to="/about-us" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                    {t('footer.links.ourTeam')}
                  </Link>
                  <Link to="/our-values" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                    {t('footer.links.ourValues')}
                  </Link>
                  <Link to="/our-services" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                    {t('footer.links.ourServices')}
                  </Link>
                </div>
              </div>

              {/* Column 2: Hotel Groups */}
              <div className="space-y-1 sm:space-y-2">
                <Link to="/grupos-hoteleros" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                  {tNav('navigation.hotelGroups')}
                </Link>
              </div>

              {/* Column 3: Customer Service */}
              <div className="space-y-1 sm:space-y-2">
                <Link to="/customer-service" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                  {t('footer.links.customerService')}
                </Link>
              </div>

              {/* Column 4: Contact */}
              <div className="space-y-1 sm:space-y-2">
                <Link to="/contact" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                  {t('footer.links.contact')}
                </Link>
              </div>

              {/* Column 5: Legal */}
              <div className="space-y-1 sm:space-y-2">
                <button 
                  onClick={() => setIsLegalOpen(!isLegalOpen)}
                  className={`text-white font-bold ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} mb-1 sm:mb-2 px-1 sm:px-2 py-0.5 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity`}
                >
                  {t('footer.sections.legal')}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLegalOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isLegalOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <Link to="/intellectual-property" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                    {t('footer.links.intellectualProperty')}
                  </Link>
                  <Link to="/terms" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                    {t('footer.links.terms')}
                  </Link>
                  <Link to="/privacy" className={`block text-white hover:text-white/90 ${isMobile ? 'text-xs' : 'text-[10.5px]'} ${isMobile ? 'sm:text-sm' : 'sm:text-[12.25px]'} font-bold transition-all duration-300 hover:scale-105`}>
                    {t('footer.links.privacy')}
                  </Link>
                </div>
              </div>

            </div>
          </div>
          
          
          {/* Buttons - reduced size by 30% on mobile */}
          <div className={`flex flex-wrap gap-2 sm:gap-4 justify-center ${isMobile ? "mt-2" : "mb-4"} animate-fade-in px-2 sm:px-0`} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Link to="/hotels" className={`text-white hover:text-white/90 bg-[#7A127C] font-bold rounded-md uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg ${isMobile ? "px-3 py-1 text-xs" : "px-6 py-2 text-sm"}`}>
              {t('footer.buttons.hotel')}
            </Link>
          </div>
        </div>
        
        {/* Fix: Use the cn utility to properly apply className to Separator */}
        <Separator className={cn("bg-[#3300B0]/40 my-2")} />
        
        <div className={`text-center text-xs text-white px-2 sm:px-0 ${isMobile ? "mt-6 mb-4" : ""}`}>
          <p className="font-semibold">{t('footer.copyright')}</p>
          
          {/* Calculator Disclaimer - only show on /hoteles page */}
          {location.pathname === '/hoteles' && (
            <p className="text-xs text-white/80 mt-2 font-normal">
              (¹) These are estimated values based on the data you provided. Actual results may vary depending on your hotel's occupancy and conditions.
            </p>
          )}
        </div>
      </div>
    </footer>;
}