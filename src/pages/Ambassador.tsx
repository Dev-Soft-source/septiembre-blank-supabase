import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { useTranslation } from "@/hooks/useTranslation";
import BubbleCounter from "@/components/common/BubbleCounter";

const Ambassador = () => {
  const { t } = useTranslation('ambassador');

  return (
    <div className="min-h-screen relative">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <BubbleCounter />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            
            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <Link 
                to="/ambassadors" 
                className="bg-[#70009E] hover:bg-[#70009E]/80 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg"
              >
                {t('buttons.viewAmbassadors')}
              </Link>
              <div className="bg-[#70009E] hover:bg-[#70009E]/80 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg text-center">
                <div>{t('buttons.becomeAmbassador')}</div>
                <div className="text-sm">{t('buttons.throughUserPanel')}</div>
              </div>
            </div>

            <div className="bg-[#7E00B3]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
              <div className="space-y-6">
                
                {/* Title Section */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-4 glow">{t('title')}</h1>
                  <div className="space-y-4 text-lg leading-relaxed">
                    <p>{t('description.intro')}</p>
                    <p>{t('description.travelers')}</p>
                    <p>{t('description.experiences')}</p>
                    <p>{t('description.longStays')}</p>
                    <p>{t('description.affinities')}</p>
                  </div>
                </div>

                <hr className="border-white/30 my-8" />

                {/* Benefits Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">{t('benefits.title')}</h2>
                  
                  {/* Recognition */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{t('benefits.recognition.title')}</h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>{t('benefits.recognition.certificate')}</li>
                      <li>{t('benefits.recognition.profile')}</li>
                      <li>{t('benefits.recognition.badge')}</li>
                      <li>{t('benefits.recognition.advisory')}</li>
                    </ul>
                  </div>

                  <hr className="border-white/20 my-6" />

                  {/* Privileged Access */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{t('benefits.access.title')}</h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>{t('benefits.access.freeStays')}</li>
                      <li>{t('benefits.access.earlyAccess')}</li>
                      <li>{t('benefits.access.privateTrips')}</li>
                    </ul>
                  </div>

                  <hr className="border-white/20 my-6" />

                  {/* Visibility */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{t('benefits.visibility.title')}</h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>{t('benefits.visibility.press')}</li>
                      <li>{t('benefits.visibility.interviews')}</li>
                      <li>{t('benefits.visibility.events')}</li>
                    </ul>
                  </div>

                  <hr className="border-white/20 my-6" />

                  {/* Community */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{t('benefits.community.title')}</h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>{t('benefits.community.network')}</li>
                      <li>{t('benefits.community.meetings')}</li>
                      <li>{t('benefits.community.consultative')}</li>
                    </ul>
                  </div>

                  <hr className="border-white/20 my-6" />

                  {/* Project Support */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{t('benefits.support.title')}</h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>{t('benefits.support.promotion')}</li>
                      <li>{t('benefits.support.tools')}</li>
                    </ul>
                  </div>

                  <hr className="border-white/20 my-6" />

                  {/* Emotional Recognition */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{t('benefits.emotional.title')}</h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>{t('benefits.emotional.letter')}</li>
                      <li>{t('benefits.emotional.gift')}</li>
                      <li>{t('benefits.emotional.inscription')}</li>
                    </ul>
                  </div>
                </div>

                <hr className="border-white/30 my-8" />

                {/* Expectations Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{t('expectations.title')}</h2>
                  <p className="mb-4 text-lg leading-relaxed">{t('expectations.description')}</p>
                  <ul className="space-y-2 text-base leading-relaxed">
                    <li>{t('expectations.represent')}</li>
                    <li>{t('expectations.recommend')}</li>
                    <li>{t('expectations.invite')}</li>
                  </ul>
                  <p className="mt-4 text-base leading-relaxed">{t('expectations.management')}</p>
                  <p className="text-base leading-relaxed">{t('expectations.qualification')}</p>
                </div>

                <hr className="border-white/30 my-8" />

                {/* Renewal Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{t('renewal.title')}</h2>
                  <p className="mb-4 text-lg leading-relaxed">{t('renewal.description')}</p>
                  <ul className="space-y-2 text-base leading-relaxed">
                    <li>{t('renewal.participation')}</li>
                    <li>{t('renewal.profile')}</li>
                    <li>{t('renewal.promotion')}</li>
                  </ul>
                </div>

                <hr className="border-white/30 my-8" />

                {/* Call to Action */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{t('cta.title')}</h2>
                  <p className="text-lg leading-relaxed">{t('cta.description')}</p>
                </div>

              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Ambassador;