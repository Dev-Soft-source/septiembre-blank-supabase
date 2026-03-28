import React, { useState } from 'react';
import { MapPin, Star, Calendar, Users, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HotelLocation } from '@/components/hotel-detail/HotelLocation';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';

// Placeholder images from context
const placeholderImages = ['https://images.unsplash.com/photo-1721322800607-8c38375eef04', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb', 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f'];

// Sample hotel data
const sampleHotel = {
  id: "sample-hotel-001",
  name: "Hotel Villa Serena",
  stars: 4,
  address: "Avenida del Mar 123",
  city: "Platja d'Aro",
  country: "Spain",
  latitude: 41.8172,
  longitude: 3.0683,
  affinities: ["Nature", "Wellness", "Gastronomy", "Cultural Heritage"],
  activities: ["Hiking", "Beach Activities", "Wine Tasting", "Local Markets"],
  stayDurations: [8, 15, 22, 29],
  pricePerMonth: 1890,
  description: "Hotel Villa Serena is a charming boutique hotel nestled between the Mediterranean coast and rolling hills of Costa Brava. Our property combines traditional Catalan architecture with modern comfort, offering guests an authentic Spanish coastal experience.",
  idealFor: "Hotel Villa Serena is ideal for guests who seek tranquility and authentic experiences. Perfect for couples looking for romantic getaways, solo travelers on wellness retreats, and culture enthusiasts wanting to explore the rich heritage of Catalonia.",
  atmosphere: "The atmosphere is serene and sophisticated, with warm Mediterranean hospitality at its core. Guests enjoy peaceful mornings on terraced gardens, leisurely afternoons by our infinity pool, and evenings filled with the gentle sounds of the nearby sea.",
  location: "Our location is perfect for those who want the best of both worlds - pristine beaches just 200 meters away and charming medieval villages within a short drive. The property sits in a protected natural area, ensuring unspoiled views and peaceful surroundings.",
  roomFeatures: ["Air Conditioning", "Private Bathroom", "Balcony/Terrace", "Free WiFi", "Minibar", "Safe", "Hair Dryer", "Premium Bedding"],
  hotelFeatures: ["Outdoor Pool", "Restaurant", "Bar", "Spa & Wellness", "Parking", "24h Reception", "Concierge", "Laundry Service", "Garden Terrace"]
};
const availabilityPackages = [{
  startDate: '2024-03-01',
  endDate: '2024-03-29',
  duration: 29,
  available: 3
}, {
  startDate: '2024-04-05',
  endDate: '2024-04-19',
  duration: 15,
  available: 1
}, {
  startDate: '2024-05-10',
  endDate: '2024-05-24',
  duration: 15,
  available: 2
}, {
  startDate: '2024-06-01',
  endDate: '2024-06-29',
  duration: 29,
  available: 4
}];
export default function HotelModelPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const renderStars = count => {
    return Array.from({
      length: count
    }, (_, i) => <Star key={`hotel-model-star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
  };
  const renderTag = (tag, type) => <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${type === 'affinity' ? 'bg-purple-900/30 text-purple-300 border border-purple-600/50' : 'bg-blue-900/30 text-blue-300 border border-blue-600/50'}`}>
      {tag}
    </span>;
  const handlePackageClick = pkg => {
    setSelectedPackage(selectedPackage?.startDate === pkg.startDate ? null : pkg);
  };
  return <div className="min-h-screen relative overflow-hidden">
      <HotelStarfield />
      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        
        {/* Top Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white glow-text">
              {sampleHotel.name}
            </h1>
            <div className="flex justify-center items-center space-x-2">
              {renderStars(sampleHotel.stars)}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-purple-200">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{sampleHotel.address}, {sampleHotel.city}, {sampleHotel.country}</span>
          </div>

          {/* Affinities and Activities */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <div>
              <p className="text-white mb-3 text-lg">This hotel is ideal for people who enjoy:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleHotel.affinities.map(tag => renderTag(tag, 'affinity'))}
              </div>
            </div>
            
            <div>
              <p className="text-white mb-3 text-lg">This hotel is perfect for guests interested in:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleHotel.activities.map(tag => renderTag(tag, 'activity'))}
              </div>
            </div>
          </div>

          {/* Stay Duration and Pricing */}
          <div className="space-y-2 text-purple-100 max-w-4xl mx-auto">
            <p className="text-lg text-center break-words">
              This hotel offers stays of {sampleHotel.stayDurations.join(', ')} days duration.
            </p>
            <p className="text-xl font-semibold text-yellow-300 text-center break-words">
              The proportional price for a 30-day stay is €{sampleHotel.pricePerMonth}.
            </p>
          </div>
        </div>

        {/* Visual Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Carousel */}
          <Card className="p-6 bg-purple-900/30 border-purple-700/50 glow-border">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <img src={placeholderImages[currentImageIndex]} alt={`${sampleHotel.name} - Image ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
              {/* Navigation dots positioned absolutely over the image */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {placeholderImages.map((_, index) => <button key={`model-dot-${index}`} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-purple-400' : 'bg-purple-700'}`} />)}
              </div>
            </div>
          </Card>

          {/* Google Map */}
          <Card className="p-6 bg-purple-900/30 border-purple-700/50 glow-border">
            <div className="aspect-video rounded-lg overflow-hidden">
              <HotelLocation
                hotelId={sampleHotel.id}
                latitude={sampleHotel.latitude}
                longitude={sampleHotel.longitude}
                hotelName={sampleHotel.name}
                address={sampleHotel.address}
                city={sampleHotel.city}
                country={sampleHotel.country}
              />
            </div>
          </Card>
        </div>

        {/* Descriptive Section */}
        <Card className="p-8 bg-purple-900/30 border-purple-700/50 glow-border">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 glow-text">About Our Hotel</h2>
              <p className="text-purple-100 text-lg leading-relaxed">{sampleHotel.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Ideal for guests who...</h3>
                <p className="text-purple-100">{sampleHotel.idealFor}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-3">The atmosphere is...</h3>
                <p className="text-purple-100">{sampleHotel.atmosphere}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Our location is perfect for...</h3>
                <p className="text-purple-100">{sampleHotel.location}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Availability Calendar Section */}
        <Card className="p-8 bg-purple-900/30 border-purple-700/50 glow-border">
          <h2 className="text-2xl font-bold text-white mb-6 glow-text">Availability & Pricing</h2>
          
          <div className="space-y-6">
            {/* Calendar visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availabilityPackages.map((pkg, index) => <div key={`model-pkg-${pkg.startDate}-${index}`} className={`p-4 rounded-lg cursor-pointer transition-all ${selectedPackage?.startDate === pkg.startDate ? 'bg-purple-600/50 border-2 border-purple-400' : 'bg-purple-800/30 border border-purple-600/50 hover:bg-purple-700/40'}`} onClick={() => handlePackageClick(pkg)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-300" />
                    <span className="text-white font-medium">{pkg.duration} days</span>
                  </div>
                  <p className="text-purple-200 text-sm">
                    {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Users className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200 text-sm">{pkg.available} rooms left</span>
                  </div>
                </div>)}
            </div>

            {/* Selected Package Details */}
            {selectedPackage && <Card className="p-6 bg-purple-800/40 border-purple-600/50">
                <h3 className="text-xl font-bold text-white mb-4">Package Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-purple-200 mb-2">
                      <strong>Dates:</strong> {new Date(selectedPackage.startDate).toLocaleDateString()} - {new Date(selectedPackage.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-purple-200 mb-2">
                      <strong>Duration:</strong> {selectedPackage.duration} days
                    </p>
                    <p className="text-purple-200 mb-4">
                      <strong>Availability:</strong> {selectedPackage.available} rooms remaining
                    </p>
                    <div className="text-yellow-300 font-semibold">
                      <p>Double Occupancy: €{Math.round(sampleHotel.pricePerMonth * (selectedPackage.duration / 30))}</p>
                      <p>Single Occupancy: €{Math.round(sampleHotel.pricePerMonth * (selectedPackage.duration / 30) * 0.8)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-600/50">
                      <p className="text-yellow-200 text-sm">
                        <strong>Dynamic pricing</strong> – This hotel uses dynamic pricing after each sale. 
                        Secure your rate today before prices go up. Only 15% of the total price is required now; 
                        the rest is paid upon arrival.
                      </p>
                    </div>
                    {selectedPackage.available <= 2 && <div className="p-3 bg-red-900/30 rounded-lg border border-red-600/50">
                        <p className="text-red-200 text-sm font-medium">
                          ⚠️ Only {selectedPackage.available} rooms left for this date!
                        </p>
                      </div>}
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Reserve Now
                    </Button>
                  </div>
                </div>
              </Card>}
          </div>
        </Card>

        {/* Hotel Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Features */}
          <Card className="p-6 bg-purple-900/30 border-purple-700/50 glow-border">
            <h3 className="text-xl font-bold text-white mb-4 glow-text">Room Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {sampleHotel.roomFeatures.map(feature => <div key={feature} className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-100 text-sm">{feature}</span>
                </div>)}
            </div>
          </Card>

          {/* Hotel Features */}
          <Card className="p-6 bg-purple-900/30 border-purple-700/50 glow-border">
            <h3 className="text-xl font-bold text-white mb-4 glow-text">Hotel Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {sampleHotel.hotelFeatures.map(feature => <div key={feature} className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-100 text-sm">{feature}</span>
                </div>)}
            </div>
          </Card>
        </div>

        {/* Reviews Placeholder */}
        <Card className="p-8 bg-purple-900/30 border-purple-700/50 glow-border">
          <h2 className="text-2xl font-bold text-white mb-6 glow-text">Guest Reviews</h2>
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200 text-lg">Guest reviews will appear here</p>
            <p className="text-purple-300 text-sm mt-2">Be the first to share your experience!</p>
          </div>
        </Card>

      </div>
    </div>;
}