import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { AssociationMiniCalculator } from "@/components/association/AssociationMiniCalculator";

import { AssociationBenefits } from "@/components/association/AssociationBenefits";
import { AssociationOffers } from "@/components/association/AssociationOffers";
import { AssociationAccordion } from "@/components/association/AssociationAccordion";
import { AssociationDisclaimer } from "@/components/association/AssociationDisclaimer";

export default function AssociationSlug() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('associationSlug');

  // Function to format association name from slug
  const formatAssociationName = (slug?: string): string => {
    if (!slug) {
      return t('fallbackAssociation');
    }

    // Replace hyphens with spaces and capitalize each word
    const formatted = slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return formatted;
  };

  const associationName = formatAssociationName(slug);
  const societyContent = t('societyChanged.content', { returnObjects: true }) as string[];

  return (
    <div className="relative min-h-screen">
      {/* Starfield Background - same style as /ambassador */}
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
          <div className="max-w-6xl mx-auto">
            
            {/* 1️⃣ Personalized Header */}
            <div className="text-center mb-16">
              <div className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-8 md:p-12 border border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.4)] max-w-3xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                  {t('greeting', { associationName })}
                </h1>
                
                <h2 className="text-xl md:text-2xl font-bold text-yellow-300 leading-relaxed">
                  {t('question')}
                </h2>
              </div>
            </div>

            {/* 2️⃣ Mini Calculator */}
            <div className="mb-16">
              <AssociationMiniCalculator />
            </div>


            {/* 4️⃣ Benefits for Members */}
            <div className="mb-16">
              <AssociationBenefits />
            </div>

            {/* 5️⃣ What We Offer */}
            <div className="mb-16">
              <AssociationOffers />
            </div>

            {/* 6️⃣ Accordion Menu */}
            <div className="mb-16">
              <AssociationAccordion />
            </div>

            {/* 7️⃣ Society Has Changed Section */}
            <div className="mb-16">
              <div className="bg-[#7802A9] backdrop-blur-md rounded-2xl p-8 md:p-12 border border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.4)] max-w-4xl mx-auto">
                <div className="mx-auto">
                  <h3 className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-wide mb-8">
                    {t('societyChanged.title')}
                  </h3>
                  <div className="space-y-6 text-lg text-white/90 leading-relaxed">
                    <p>
                      {societyContent[0]}
                    </p>
                    <h4 className="text-xl font-bold text-yellow-300 uppercase tracking-wide">
                      {societyContent[1]}
                    </h4>
                    <p>
                      {societyContent[2]}
                    </p>
                    <p>
                      {societyContent[3]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8️⃣ CTA Button */}
            <div className="mb-16 text-center">
              <a
                href="https://hotel-living.com/registerAssociation"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-400/30 hover:border-purple-300/50"
                style={{
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                {t('joinButton')}
              </a>
            </div>

            {/* 9️⃣ Legal Disclaimer */}
            <AssociationDisclaimer />

          </div>
        </div>
      </div>
    </div>
  );
}