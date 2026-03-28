import { useEffect, useState } from 'react';
import { HotelCard } from "@/components/HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterState } from '@/components/filters';
import { useHotels } from '@/hooks/useHotels';

interface FeaturedHotelsSectionProps {
  filters: FilterState;
}

export function FeaturedHotelsSection({ filters }: FeaturedHotelsSectionProps) {
  const { hotels, loading: isLoading, error } = useHotels({ initialFilters: filters });
  
  if (isLoading) {
    return (
      <section className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Featured Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5">
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-7 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-1/4 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Featured Hotels</h2>
          <div className="text-center py-12 glass-card rounded-2xl p-8">
            <p className="text-red-400 mb-4">Error loading hotels</p>
            <p className="text-fuchsia-400">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Featured Hotels</h2>
        
        {(!hotels || hotels.length === 0) ? (
          <div className="text-center py-12 glass-card rounded-2xl p-8">
            <p className="text-muted-foreground mb-4">No hotels found matching your criteria.</p>
            <p className="text-fuchsia-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.filter(hotel => hotel?.name && hotel?.country && hotel?.city).map((hotel) => {
              const mainImage = hotel.thumbnail || '/placeholder.svg';
              
              const hotelThemes = hotel.hotel_themes?.map((ht: any) => ht?.themes?.name).filter(Boolean) || [];
              
              const availableMonths: string[] = [];
              
              return (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  name={hotel.name || 'Unnamed Hotel'}
                  city={hotel.city || 'Unknown City'}
                  country={hotel.country || 'Unknown Country'}
                  category={3}
                  pricePerMonth={hotel.price_per_month || 0}
                  themes={hotelThemes.map((name: string) => ({ 
                    id: name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
                    name: name || 'Unknown Theme',
                    category: 'Unknown'
                  }))}
                  image={mainImage}
                  availableMonths={availableMonths}
                  hotel_themes={hotel.hotel_themes}
                  hotel_activities={hotel.hotel_activities}
                  stayLengths={[]}
                  availabilityPackages={[]}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
