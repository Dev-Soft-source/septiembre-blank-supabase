import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOMetadata } from "@/components/SEOMetadata";
import { useTranslation } from "@/hooks/useTranslation";
import { StaticSlogansDisplay } from "@/components/leaders/StaticSlogansDisplay";
export default function LiderLiving() {
  const {
    t
  } = useTranslation('liderLiving');

  // Add canonical tag for SEO
  useEffect(() => {
    const linkId = "canonical-lider-living";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/lider-living";
  }, []);
  return <div className="min-h-screen relative">
      <SEOMetadata title={t('title')} description={t('description')} url={typeof window !== 'undefined' ? window.location.href : "https://hotel-living.com/lider-living"} />
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <main>
          {/* Static Slogans Display - All 6 Slogans */}
          <StaticSlogansDisplay />

          <section className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Top Section - Three Text Cards */}
            <div className="space-y-5 mb-8">

              {/* Card 2: Are you empathetic, sociable and of good character - Now Second */}
              <div className="bg-[#7E26A6] rounded-2xl p-6 text-white">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {t('cards.card2.title')}
                </h2>
                <div className="space-y-4 text-base leading-relaxed">
                  <p>{t('cards.card2.line1')}</p>
                  <p>{t('cards.card2.line2')}</p>
                  
                </div>
              </div>

              {/* Card 3: New leadership future card */}
              <div className="bg-[#7E26A6] rounded-2xl p-6 text-white">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {t('cards.card3.title')}
                </h2>
                <div className="space-y-4 text-base leading-relaxed">
                  <p>{t('cards.card3.line1')}</p>
                  <p>{t('cards.card3.line2')}</p>
                  <div className="space-y-3 mt-4">
                    <p>{t('cards.card3.bullets.future')}</p>
                    <p>{t('cards.card3.bullets.utility')}</p>
                    <p>{t('cards.card3.bullets.fundamental')}</p>
                    <p>{t('cards.card3.bullets.treasure')}</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p>{t('cards.card3.conclusion1')}</p>
                    <p>{t('cards.card3.conclusion2')}</p>
                  </div>
                </div>
              </div>

              {/* Card 1: What does a Group Leader do + How do I earn money - Now Third */}
              
            </div>

            {/* Middle Section - Accordion FAQ */}
            <div className="mb-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="who-can-become" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.whoCanBecome.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.whoCanBecome.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="what-leader-does" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.whatLeaderDoes.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.whatLeaderDoes.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-much-earn" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.howMuchEarn.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed whitespace-pre-line">
                      {t('faq.howMuchEarn.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-system-knows" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.howSystemKnows.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.howSystemKnows.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="theme-group" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.themeGroup.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.themeGroup.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="organize-activities" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.organizeActivities.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.organizeActivities.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="stay-duration" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.stayDuration.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.stayDuration.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="group-size" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.groupSize.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.groupSize.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="experience-needed" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.experienceNeeded.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.experienceNeeded.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="multiple-hotels" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.multipleHotels.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.multipleHotels.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="declare-income" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.declareIncome.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.declareIncome.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="become-autonomous" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.becomeAutonomous.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.becomeAutonomous.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="promotor-ambassador" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.promotorAmbassador.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed">
                      {t('faq.promotorAmbassador.answer')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="group-benefits" className="bg-[#7E26A6] rounded-lg border-0">
                  <AccordionTrigger className="text-left text-base md:text-lg font-bold uppercase text-white px-6 py-4 hover:text-white/80 transition-all duration-300 [&[data-state=open]>svg]:rotate-180">
                    {t('faq.groupBenefits.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/90 px-6 pb-6 pt-2">
                    <p className="text-base leading-relaxed mb-4">
                      {t('faq.groupBenefits.answer')}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <div className="text-base leading-relaxed whitespace-pre-line">
                          {t('faq.groupBenefits.benefits.exclusiveActivities')}
                        </div>
                      </div>
                      <div>
                        <div className="text-base leading-relaxed whitespace-pre-line">
                          {t('faq.groupBenefits.benefits.personalizedWelcome')}
                        </div>
                      </div>
                      <div>
                        <div className="text-base leading-relaxed whitespace-pre-line">
                          {t('faq.groupBenefits.benefits.localRecommendations')}
                        </div>
                      </div>
                      <div>
                        <div className="text-base leading-relaxed whitespace-pre-line">
                          {t('faq.groupBenefits.benefits.commonAffinity')}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Lower Section - Two Existing Accordions */}
            

            {/* Registration Block - Register Button + Nuestros líderes link */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a href="https://hotel-living.com/registerLeaderLiving" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-purple-600 bg-white border border-purple-600 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                {t('cta.register')}
              </a>
              <a href="/leaders" className="text-sm md:text-base underline underline-offset-4 opacity-80 hover:opacity-100 transition text-white">
                {t('leaders:seeOurLeaders', 'Ver nuestros líderes →')}
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>;
}