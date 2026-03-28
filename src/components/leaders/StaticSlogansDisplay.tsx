import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function StaticSlogansDisplay() {
  const { t } = useTranslation('ui');
  
  // All six slogans
  const slogans = [
    t('leaders.slogans.1'),
    t('leaders.slogans.2'), 
    t('leaders.slogans.3'),
    t('leaders.slogans.4'),
    t('leaders.slogans.5'),
    t('leaders.slogans.6')
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid layout - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {slogans.map((slogan, index) => (
            <div key={index} className="flex justify-center">
              <div className="relative group w-fit max-w-sm">
                {/* Glowing background effect - same as original */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-100 group-hover:opacity-100 transition-opacity duration-300" style={{
                  boxShadow: '0 0 160px rgba(0,200,255,1), 0 0 320px rgba(0,200,255,0.8), 0 0 480px rgba(0,200,255,0.6)',
                  filter: 'blur(24px)'
                }}></div>
                
                {/* Slogan box - same styling as original */}
                <div className="bg-[#8017B0] inline-block text-center px-6 py-3 md:px-4 md:py-2 lg:px-4 lg:py-2 rounded-[10px] slogan-container relative">
                  <span className="block font-extrabold text-lg leading-tight md:text-[17px] lg:text-[21px] md:leading-snug slogan-text text-white">
                    {slogan}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}