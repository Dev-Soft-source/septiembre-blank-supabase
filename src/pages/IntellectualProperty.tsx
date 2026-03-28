
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { useTranslation } from "@/hooks/useTranslation";

export default function IntellectualProperty() {
  const { t } = useTranslation('intellectualProperty');
  
  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="glass-card rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-6">{t('intellectualProperty.title')}</h1>
            
            <div className="space-y-6 text-sm">
              <p>{t('intellectualProperty.content1')}</p>
              
              <p>{t('intellectualProperty.content2')}</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">{t('intellectualProperty.trademarks.title')}</h2>
              <p>{t('intellectualProperty.trademarks.content')}</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">{t('intellectualProperty.copyright.title')}</h2>
              <p>{t('intellectualProperty.copyright.content', { year: new Date().getFullYear() })}</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">{t('intellectualProperty.patent.title')}</h2>
              <p>{t('intellectualProperty.patent.content')}</p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">{t('intellectualProperty.contact.title')}</h2>
              <p>
                {t('intellectualProperty.contact.content', {
                  contactLink: t('intellectualProperty.contact.content').includes('Contact') 
                    ? 'Contact' 
                    : 'Contacto'
                }).split('Contact')[0]}
                <Link to="/contact" className="text-fuchsia-400 hover:text-fuchsia-300">
                  {t('intellectualProperty.contact.content').includes('Contact') ? 'Contact' : 'Contacto'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
