import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOMetadata } from '@/components/SEOMetadata';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DEMO_LEADERS, DemoLeader } from '@/data/demo-leaders';

export default function Leaders() {
  const { t } = useTranslation('leaders');
  const [leaders, setLeaders] = useState<DemoLeader[]>(DEMO_LEADERS);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { getLeadersHotelMap } = await import('@/utils/leadersMapping');
      const map = await getLeadersHotelMap(DEMO_LEADERS.map(l => l.slug));
      if (!mounted) return;
      setLeaders(prev => prev.map(l => ({ ...l, hotel_id: map[l.slug] })));
    })();
    return () => { mounted = false };
  }, []);

  const title = useMemo(() => t('title', 'Nuestros líderes'), [t]);
  const description = useMemo(() => t('description', 'Descubre líderes y grupos activos de Hotel‑Living'), [t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/60">
      <SEOMetadata title={`${title} | Hotel‑Living`} description={description} url={typeof window !== 'undefined' ? window.location.href : 'https://hotel-living.com/leaders'} />
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </header>

        <section aria-label={title} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {leaders.map((leader) => (
            <Link
              to={`/leaders/${leader.slug}`}
              key={leader.slug}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-3 bg-card/60 hover:bg-card transition shadow-sm hover:shadow-md"
              aria-label={`${leader.full_name}`}
            >
              <div className="relative mx-auto mb-3" style={{ width: '112px', height: '112px' }}>
                <div className="absolute inset-0 rounded-full overflow-hidden bg-muted">
                  <img
                    src={leader.avatar_url}
                    alt={`${leader.full_name} – avatar`}
                    loading="eager"
                    className="w-full h-full object-cover"
                    style={{ 
                      width: '112px', 
                      height: '112px', 
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <h3 className="text-center font-semibold group-hover:text-primary transition text-sm sm:text-base">{leader.full_name}</h3>
            </Link>
          ))}
        </section>

      </main>
      <Footer />
    </div>
  );
}
