import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOMetadata } from '@/components/SEOMetadata';
import { useTranslation } from '@/hooks/useTranslation';
import { DEMO_LEADERS } from '@/data/demo-leaders';
import { supabase } from '@/integrations/supabase/client';
interface PackageItem {
  id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  current_price_usd: number;
  occupancy_mode: string;
  available_rooms: number;
}
export default function LeaderProfile() {
  const {
    slug
  } = useParams();
  const {
    t
  } = useTranslation('leaders');
  const leader = useMemo(() => DEMO_LEADERS.find(l => l.slug === slug), [slug]);
  const [hotel, setHotel] = useState<{
    id: string;
    name: string;
    city?: string | null;
    country?: string | null;
  } | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!leader) return;
      const {
        getLeadersHotelMap
      } = await import('@/utils/leadersMapping');
      const map = await getLeadersHotelMap(DEMO_LEADERS.map(l => l.slug));
      const hotelId = leader.hotel_id || map[leader.slug];
      if (hotelId) {
        const {
          data: hotelData
        } = await supabase.from('hotels_with_filters_view').select('id,name,city,country').eq('id', hotelId).maybeSingle();
        if (!mounted) return;
        if (hotelData) setHotel(hotelData);
      } else {
        const {
          data: hotels
        } = await supabase.from('hotels_with_filters_view').select('id,name,city,country').limit(1);
        if (!mounted) return;
        if (hotels && hotels[0]) setHotel(hotels[0]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [leader]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!hotel) return;
      const {
        data: pkgs
      } = await supabase.from('availability_packages_public_view').select('id,start_date,end_date,duration_days,current_price_usd,occupancy_mode,available_rooms').eq('hotel_id', hotel.id).gt('available_rooms', 0);
      if (!mounted) return;
      setPackages(pkgs || []);
    })();
    return () => {
      mounted = false;
    };
  }, [hotel]);
  if (!leader) {
    return <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-10">
          <p>{t('notFound', 'Líder no encontrado')}</p>
        </main>
        <Footer />
      </div>;
  }
  const title = `${leader.full_name} | ${t('title', 'Nuestros líderes')}`;
  return <div className="min-h-screen bg-gradient-to-b from-background to-background/60">
      <SEOMetadata title={title} description={leader.bio} url={typeof window !== 'undefined' ? window.location.href : 'https://hotel-living.com/leaders'} />
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <header className="flex flex-col items-center sm:flex-row sm:items-end gap-6 mb-8">
          <div className="rounded-full overflow-hidden w-28 h-28 sm:w-36 sm:h-36 shadow">
            <img src={leader.avatar_url} alt={`${leader.full_name} – avatar`} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{leader.full_name}</h1>
            <p className="text-muted-foreground mt-1">{leader.age} · {leader.city} · {leader.country}</p>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <article className="md:col-span-2">
            <h2 className="sr-only">Bio</h2>
            <p className="leading-relaxed text-base md:text-lg">{leader.bio}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{t('labels.affinity', 'Afinidad')}: {leader.affinity}</span>
              <span className="px-3 py-1 rounded-full bg-secondary/10">{t('labels.activities', 'Actividades')}:
                {leader.activities.map((a, i) => <span key={a} className="ml-2">{a}{i < leader.activities.length - 1 ? ',' : ''}</span>)}
              </span>
            </div>
          </article>

          <aside className="md:col-span-1 bg-card/60 border rounded-xl p-4">
            <h3 className="font-semibold mb-2">{t('labels.currentGroup', 'Grupo actual')}</h3>
            {hotel ? <div>
                <div className="text-sm">{hotel.city} · {hotel.country}</div>
                <div className="text-sm font-medium">{hotel.name}</div>
              </div> : <div className="text-sm opacity-80">{t('loading', 'Cargando...')}</div>}
          </aside>
        </section>

        <section className="mb-10">
          <h3 className="font-semibold mb-3">{t('labels.packages', 'Paquetes disponibles')}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(p => <div key={p.id} className="border rounded-xl p-4 bg-card/60">
                <div className="text-sm opacity-80">{new Date(p.start_date).toLocaleDateString()} — {new Date(p.end_date).toLocaleDateString()}</div>
                <div className="mt-1 text-sm">{t('labels.occupancy', 'Ocupación')}: {p.occupancy_mode}</div>
                <div className="mt-1 font-semibold">{t('labels.price', 'Precio')}: ${p.current_price_usd}</div>
                {hotel && <Link to={`/hotel/${hotel.id}?package=${p.id}`} className="inline-block mt-3 text-primary underline underline-offset-4">
                    {t('labels.book', 'Reservar')}
                  </Link>}
              </div>)}
            {packages.length === 0 && <div className="text-sm opacity-80">{t('noPackages', 'No hay paquetes disponibles ahora mismo')}</div>}
          </div>
        </section>

        
      </main>
      <Footer />
    </div>;
}