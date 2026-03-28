import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { Starfield } from "@/components/Starfield";
import { AssociationProfitabilityCalculator } from "@/components/dashboard/rates-calculator/components/AssociationProfitabilityCalculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
export default function HotelAssociation() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const {
    t,
    i18n
  } = useTranslation('hotelAssociation');
  const navigate = useNavigate();

  // Helper function to safely get array translations
  const getArrayTranslation = (key: string): string[] => {
    const result = t(key, {
      returnObjects: true
    });
    console.log(`Translation for ${key}:`, result);

    // Check if result is an array and all elements are strings
    if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
      return result as string[];
    }

    // If it's not an array of strings, return empty array
    console.warn(`Translation key ${key} did not return an array of strings:`, typeof result, result);
    return [];
  };

  // Function to format association name from slug
  const formatAssociationName = (slug?: string): string => {
    if (!slug) {
      return t('fallbackAssociation');
    }

    // Replace hyphens with spaces and capitalize each word
    const formatted = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Ensure "Asociación" is properly capitalized if present
    return formatted.replace(/asociacion/gi, 'Asociación');
  };
  const associationName = formatAssociationName(slug);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  return <div className="relative min-h-screen">
      {/* Starfield Background */}
      <div className="fixed inset-0 z-0">
        <Starfield />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-purple-800/40 to-fuchsia-900/40"></div>
        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-400/15 rounded-full blur-[80px] animate-pulse delay-2000"></div>
      </div>

      {/* Header Navigation */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-8 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-20">
              <div className="flex justify-center mb-8">
                <img 
                  src="/lovable-uploads/950ed52a-c737-4637-9751-d6f1db78b7b4.png" 
                  alt="Hotel-Living Logo" 
                  loading="eager" 
                  fetchPriority="high" 
                  className="h-20 md:h-24 drop-shadow-lg" 
                />
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                <div className="space-y-2 mb-8">
                  <p className="text-lg md:text-xl font-semibold text-white/90 uppercase tracking-wide leading-relaxed">
                    {t('heroSection.incomeSource')}
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-white/90 uppercase tracking-wide leading-relaxed">
                    {t('heroSection.massiveOccupancy')}
                  </p>
                </div>
                
                <h1 className="text-base md:text-lg font-bold text-yellow-300 uppercase tracking-wide leading-tight mb-24 drop-shadow-md">
                  {t('heroSection.revolution')}
                </h1>
                
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
                    {t('greeting', { associationName })}
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    {t('heroSection.introduction')} {t('heroSection.expansion')}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
              
              {/* Opportunity Section */}
              <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-lg md:text-xl font-bold text-yellow-300 uppercase tracking-wide mb-8 drop-shadow-md">
                    {t('opportunitySection.title')}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                      {t('opportunitySection.systemBenefits')}
                    </p>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                      {t('opportunitySection.forAssociation')}
                    </p>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                      {t('opportunitySection.forHotels')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Industry Context Section */}
              <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-lg prose-invert max-w-none">
                    <h3 className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-wide mb-8">
                      {t('industrySection.title')}
                    </h3>
                    <p className="text-lg text-white/90 leading-relaxed mb-8">
                      {t('industrySection.knownFact')}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-wide mb-6">
                      {t('industrySection.onlyForBigChains')}
                    </h3>
                    <p className="text-lg text-white/90 leading-relaxed">
                      {t('industrySection.independentHotels')}
                    </p>
                  </div>
                </div>
              </section>

              {/* What We Offer Section */}
              <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 uppercase tracking-wide mb-6">
                    {t('offerSection.title')}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed font-semibold">
                      {t('offerSection.toAssociations')}
                    </p>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                      {t('offerSection.description')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Calculator Section */}
              <section className="my-20">
                <AssociationProfitabilityCalculator />
              </section>

              {/* Accordion Sections */}
              <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                <Accordion type="multiple" className="space-y-4">
                  
                  {/* Section 1: Hotel Crisis */}
                  <AccordionItem value="crisis" className="bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200">
                      <span className="text-sm md:text-base font-bold text-yellow-300 tracking-wide">
                        ① {t('crisisSection.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-white/3">
                      <div className="space-y-6 pt-4">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <p className="text-lg text-white/90 leading-relaxed mb-4">
                            {t('crisisSection.obsoleteModel')}
                          </p>
                          
                          <p className="text-lg text-yellow-300 font-semibold leading-relaxed mb-4">
                            {t('crisisSection.realOccupancy')}
                          </p>
                          
                          <p className="text-lg text-yellow-300 font-semibold leading-relaxed mb-6">
                            {t('crisisSection.emptyRooms')}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div>
                              <p className="text-lg text-white/90 font-semibold mb-4">{t('crisisSection.implicationsTitle')}</p>
                              <ul className="space-y-3">
                                {getArrayTranslation('crisisSection.implications').map((implication: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-white/70 mr-3">•</span>
                                    <span className="text-white/90">{implication}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <p className="text-lg text-yellow-300 font-semibold mb-4">
                                {t('crisisSection.meanwhileTitle')}
                              </p>
                              <ul className="space-y-3">
                                {getArrayTranslation('crisisSection.desires').map((desire: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-white/70 mr-3">•</span>
                                    <span className="text-white/90">{desire}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <p className="text-lg text-yellow-300 font-semibold leading-relaxed mt-6">
                            {t('crisisSection.lostOpportunity')}
                          </p>
                          
                          <p className="text-lg text-white/90 leading-relaxed">
                            {t('crisisSection.finalWarning')}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 2: Benefits for Hotels */}
                  <AccordionItem value="benefits" className="bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200">
                      <span className="text-sm md:text-base font-bold text-yellow-300 tracking-wide">
                        ② {t('accordionSection1.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-white/3">
                      <div className="space-y-8 pt-4">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                              📊 {t('accordionSection1.profitabilityTitle')}
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                              {getArrayTranslation('accordionSection1.profitabilityPoints').map((point: string, index: number) => 
                                <li key={index}>{point}</li>
                              )}
                            </ul>
                          </div>

                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                              📜 {t('accordionSection1.costsTitle')}
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                              {getArrayTranslation('accordionSection1.costsPoints').map((point: string, index: number) => 
                                <li key={index}>{point}</li>
                              )}
                            </ul>
                          </div>

                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                              💼 {t('accordionSection1.staffTitle')}
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                              {getArrayTranslation('accordionSection1.staffPoints').map((point: string, index: number) => 
                                <li key={index}>{point}</li>
                              )}
                            </ul>
                          </div>

                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                              🪙 {t('accordionSection1.clientsTitle')}
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                              {getArrayTranslation('accordionSection1.clientsPoints').map((point: string, index: number) => 
                                <li key={index}>{point}</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                            🤖 {t('accordionSection1.technologyTitle')}
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                            {getArrayTranslation('accordionSection1.technologyPoints').map((point: string, index: number) => 
                              <li key={index}>{point}</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 3: Hotel Association Benefits */}
                  <AccordionItem value="association-benefits" className="bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200">
                      <span className="text-sm md:text-base font-bold text-yellow-300 tracking-wide">
                        ③ {t('associationBenefitsSection.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-white/3">
                      <div className="space-y-6 pt-4">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="text-lg font-bold text-yellow-300 mb-6">
                            {t('associationBenefitsSection.benefitsTitle')}
                          </h4>
                          <ul className="space-y-3 text-base text-white/90 leading-relaxed">
                            {getArrayTranslation('associationBenefitsSection.benefits').map((benefit: string, index: number) => (
                              <li key={index} className="flex items-start space-x-3">
                                <span className="text-green-400 text-lg flex-shrink-0 mt-0.5">✅</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 4: Millions of Clients Waiting */}
                  <AccordionItem value="clients-waiting" className="bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200">
                      <span className="text-sm md:text-base font-bold text-yellow-300 tracking-wide">
                        ④ {t('accordionSection2.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-white/3">
                      <div className="space-y-6 pt-4">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <p className="text-lg text-white/90 leading-relaxed mb-4">
                            {t('accordionSection2.introduction')}
                          </p>
                          <p className="text-lg font-semibold text-yellow-300 mb-6">
                            {t('accordionSection2.subtitle')}
                          </p>
                          <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                            {getArrayTranslation('accordionSection2.points').map((point: string, index: number) => 
                              <li key={index}>{point}</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 5: Potential Clients */}
                  <AccordionItem value="potential-clients" className="bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200">
                      <span className="text-sm md:text-base font-bold text-yellow-300 tracking-wide">
                        ⑤ {t('accordionSection3.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-white/3">
                      <div className="space-y-6 pt-4">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed mb-6">
                            {getArrayTranslation('accordionSection3.clientTypes').map((type: string, index: number) => 
                              <li key={index}>{type}</li>
                            )}
                          </ul>
                          
                          <div className="border-t border-white/10 pt-6">
                            <p className="text-lg font-semibold text-yellow-300 mb-4">
                              {t('accordionSection3.commonFactor')}
                            </p>
                            <div className="space-y-3 text-base text-white/90 leading-relaxed mb-6">
                              <p>{t('accordionSection3.notAboutRenting')}</p>
                              <p><strong className="text-yellow-300">{t('accordionSection3.aboutLivingDifferent')}</strong></p>
                              <p>{t('accordionSection3.hotelSolution')}</p>
                              <p><strong className="text-yellow-300">{t('accordionSection3.hotelLivingChanges')}</strong></p>
                            </div>
                            
                            <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                              {getArrayTranslation('accordionSection3.features').map((feature: string, index: number) => 
                                <li key={index}>{feature}</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 6: Hotel Sector Crisis */}
                  <AccordionItem value="sector-crisis" className="bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-lg">
                    <AccordionTrigger className="px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200">
                      <span className="text-sm md:text-base font-bold text-yellow-300 tracking-wide">
                        ⑥ {t('accordionSection4.title')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-white/3">
                      <div className="space-y-6 pt-4">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <div className="space-y-4">
                            <p className="text-lg text-white/90 leading-relaxed">
                              {t('accordionSection4.obsoleteModel')}
                            </p>
                            <p className="text-base text-white/80"><strong className="text-yellow-300">{t('accordionSection4.occupancyReality')}</strong></p>
                            <p className="text-lg font-semibold text-yellow-300">
                              {t('accordionSection4.emptyRooms')}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                              <div>
                                <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                                  {getArrayTranslation('accordionSection4.consequences').map((consequence: string, index: number) => 
                                    <li key={index}>{consequence}</li>
                                  )}
                                </ul>
                              </div>
                              
                              <div>
                                <p className="text-lg font-semibold text-yellow-300 mb-3">
                                  {t('accordionSection4.meanwhile')}
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-base text-white/80 leading-relaxed">
                                  {getArrayTranslation('accordionSection4.desires').map((desire: string, index: number) => 
                                    <li key={index}>{desire}</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="border-t border-white/10 pt-6 space-y-3 text-base text-white/90 leading-relaxed">
                              <p><strong className="text-yellow-300">{t('accordionSection4.emptyRoomOpportunity')}</strong></p>
                              <p>{t('accordionSection4.finalWarning')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Call to Action Section */}
              <section className="text-center py-16">
                <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-700 backdrop-blur-md rounded-2xl p-12 border border-cyan-400/30 shadow-2xl shadow-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.4)]">
                  <button 
                    onClick={() => navigate('/asociacion/registro')}
                    className="bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-xl text-xl transition-all duration-300 shadow-2xl transform hover:scale-105 border border-purple-400/30"
                  >
                    {t('ctaSection.buttonText')}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>;
}