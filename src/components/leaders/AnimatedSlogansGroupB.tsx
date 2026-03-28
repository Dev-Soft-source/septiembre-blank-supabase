
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCarousel } from '@/hooks/useCarousel';

export function AnimatedSlogansGroupB() {
  const { t } = useTranslation('ui');

  const items = [t('leaders.slogans.4'), t('leaders.slogans.5'), t('leaders.slogans.6')];

  const { sectionRef, measureRef, currentIndex, nextIndex, isTransitioning, minHeight, prefersReduced, setIndex } = useCarousel({
    items,
    intervalMs: 4000,
    initialDelayMs: 3000,
    startOnView: true,
    inViewThreshold: 0.4,
  });

  return (
    <section ref={sectionRef as any} className="min-h-screen grid place-items-center relative">
      <div className="text-center max-w-5xl px-4 relative z-10">
        {/* Measurement container */}
        <div ref={measureRef} className="sr-only">
          {items.map((s, i) => (
            <div key={i} data-measure className="font-extrabold text-4xl leading-tight md:text-[18px] md:leading-snug">
              {s}
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-2" style={{ minHeight }}>
          <div className="relative group w-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-100 group-hover:opacity-100 transition-opacity duration-300" style={{
              boxShadow: '0 0 160px rgba(0,200,255,1), 0 0 320px rgba(0,200,255,0.8), 0 0 480px rgba(0,200,255,0.6)',
              filter: 'blur(24px)'
            }}></div>
            <div className="bg-[#8017B0] inline-block text-center px-4 py-2 md:px-2 md:py-1 rounded-[10px] slogan-container relative">
              <div className="relative">
                {/* Current slogan */}
                <span className={`block font-extrabold text-4xl leading-tight md:text-[18px] md:leading-snug slogan-text transition-opacity duration-[2000ms] ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  {items[currentIndex]}
                </span>
                {/* Next slogan - positioned absolutely on top */}
                <span className={`absolute top-0 left-0 block font-extrabold text-4xl leading-tight md:text-[18px] md:leading-snug slogan-text transition-opacity duration-[2000ms] ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
                  {items[nextIndex]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {prefersReduced && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button aria-label="Previous" className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20" onClick={() => setIndex((currentIndex - 1 + items.length) % items.length)}>
              ‹
            </button>
            <button aria-label="Next" className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20" onClick={() => setIndex((currentIndex + 1) % items.length)}>
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
