
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { ComparisonTable } from '@/components/comparison/ComparisonTable';
import { useHotelComparison } from '@/hooks/useHotelComparison';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Compare() {
  const { selectedHotels, clearComparison } = useHotelComparison();
  const navigate = useNavigate();

  if (selectedHotels.length < 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <HotelStarfield />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-16 pb-10">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-white mb-4">Hotel Comparison</h1>
            <p className="text-white/80 mb-8">
              Select at least 2 hotels to compare them side by side
            </p>
            <Button onClick={() => navigate('/search')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HotelStarfield />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-16 pb-10">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Hotel Comparison</h1>
            <p className="text-white/80">
              Comparing {selectedHotels.length} hotels
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/search')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <Button onClick={clearComparison} variant="destructive">
              Clear All
            </Button>
          </div>
        </div>
        <ComparisonTable hotels={selectedHotels} />
      </main>
      <Footer />
    </div>
  );
}
