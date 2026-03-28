import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';

export default function GruposHoteleros() {
  // Using the actual tourism association logo images
  const logoImages = [
    "/lovable-uploads/5cbd633b-b2bf-4e1f-9fe4-fab1de1d8a5c.png",
    "/lovable-uploads/b9c1ed04-7687-49e6-9a11-46835e5acd0c.png",
    "/lovable-uploads/eae6cb02-cdc5-4fe6-a981-4bf49ddd7900.png",
    "/lovable-uploads/ef083610-434b-4eda-bfa0-16b6b8854bda.png",
    "/lovable-uploads/93348642-73b4-4ced-85ed-0ffcc4ffd5dc.png"
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          {/* Desktop layout: Two rows */}
          <div className="hidden md:block">
            {/* First row - 3 logos */}
            <div className="grid grid-cols-3 gap-16 md:gap-20 max-w-6xl mx-auto mb-4">
              {logoImages.slice(0, 3).map((logo, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img 
                    src={logo} 
                    alt={`Hotel Group Logo ${index + 1}`}
                    className="w-auto h-56 md:h-72 lg:h-80 object-contain animate-fade-in"
                    style={{ 
                      maxWidth: '600px',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }}
                    onLoad={() => console.log(`Logo ${index + 1} loaded successfully`)}
                    onError={(e) => {
                      console.error(`Failed to load logo ${index + 1}:`, logo);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Second row - 2 logos centered */}
            <div className="flex justify-center gap-16 md:gap-20 max-w-6xl mx-auto">
              {logoImages.slice(3).map((logo, index) => (
                <div key={index + 3} className="flex items-center justify-center">
                  <img 
                    src={logo} 
                    alt={`Hotel Group Logo ${index + 4}`}
                    className="w-auto h-60 md:h-80 lg:h-96 object-contain animate-fade-in"
                    style={{ 
                      maxWidth: '600px',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }}
                    onLoad={() => console.log(`Logo ${index + 4} loaded successfully`)}
                    onError={(e) => {
                      console.error(`Failed to load logo ${index + 4}:`, logo);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile layout: Single column */}
          <div className="md:hidden flex flex-col items-center space-y-8 max-w-4xl mx-auto">
            {logoImages.map((logo, index) => (
              <div key={index} className="flex items-center justify-center w-full">
                <img 
                  src={logo} 
                  alt={`Hotel Group Logo ${index + 1}`}
                  className="w-auto h-96 sm:h-120 object-contain animate-fade-in"
                  style={{ 
                    maxWidth: '840px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                  onLoad={() => console.log(`Logo ${index + 1} loaded successfully`)}
                  onError={(e) => {
                    console.error(`Failed to load logo ${index + 1}:`, logo);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}