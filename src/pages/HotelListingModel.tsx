import React, { useState } from 'react';
import { Calendar, MapPin, Star, Users, Activity, Wifi, Car, Utensils, Dumbbell, Wine, Waves, Shield, Clock, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for the model page
const mockHotelData = {
  name: "Grand Plaza Hotel & Spa",
  starCategory: 4,
  address: {
    street: "Avenida da Liberdade, 123",
    city: "Lisboa",
    postalCode: "1250-145",
    country: "Portugal"
  },
  affinities: ["Business Travel", "Luxury Experience", "City Exploration", "Cultural Tourism"],
  activities: ["Spa & Wellness", "Fine Dining", "Shopping", "Museums", "Historic Tours"],
  description: "Experience unparalleled luxury in the heart of Lisbon at our distinguished Grand Plaza Hotel & Spa. This elegant establishment combines Portuguese heritage with modern sophistication, offering guests an extraordinary stay in one of Europe's most captivating capitals.",
  idealGuests: "Discerning travelers seeking refined accommodations with personalized service, business professionals requiring premium facilities, and couples looking for a romantic urban retreat.",
  atmosphere: "Sophisticated and welcoming, blending contemporary elegance with traditional Portuguese charm. Our spaces foster both relaxation and productivity, creating an ambiance of understated luxury.",
  perfectLocation: "Strategically positioned on Lisbon's most prestigious avenue, just steps from luxury boutiques, renowned restaurants, and major cultural attractions. Perfect for exploring the city's rich history while enjoying modern conveniences.",
  images: [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
  ],
  coordinates: { lat: 38.7223, lng: -9.1393 },
  availabilityPackages: [
    { startDate: "2024-08-01", endDate: "2024-08-29", duration: 29, price: 3200, remainingRooms: 3 },
    { startDate: "2024-09-05", endDate: "2024-09-20", duration: 15, price: 1800, remainingRooms: 1 },
    { startDate: "2024-10-10", endDate: "2024-10-31", duration: 22, price: 2400, remainingRooms: 5 }
  ],
  roomFeatures: ["Air Conditioning", "High-Speed WiFi", "Smart TV", "Minibar", "Safe", "Premium Bedding", "City View", "24/7 Room Service"],
  hotelFeatures: ["Spa & Wellness Center", "Fitness Center", "Business Center", "Restaurant", "Bar & Lounge", "Valet Parking", "Concierge Service", "Pet Friendly"]
};

export default function HotelListingModel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Star key={`listing-star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Top Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-primary">{mockHotelData.name}</h1>
            <div className="flex items-center gap-1">
              {renderStars(mockHotelData.starCategory)}
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{`${mockHotelData.address.street}, ${mockHotelData.address.city}, ${mockHotelData.address.postalCode}, ${mockHotelData.address.country}`}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">This hotel is ideal for people who enjoy:</span>
              <div className="flex flex-wrap gap-2">
                {mockHotelData.affinities.map((affinity, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {affinity}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Activity className="h-4 w-4 text-secondary" />
              <span className="font-medium text-secondary">This hotel is perfect for guests interested in:</span>
              <div className="flex flex-wrap gap-2">
                {mockHotelData.activities.map((activity, index) => (
                  <Badge key={index} variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Photo Carousel */}
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <img 
                src={mockHotelData.images[currentImageIndex]} 
                alt={`Hotel view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {mockHotelData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Google Maps */}
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Google Maps Integration</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {mockHotelData.coordinates.lat}, {mockHotelData.coordinates.lng}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Descriptive Section */}
        <Card className="p-6 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-3">About the Hotel</h2>
              <p className="text-muted-foreground leading-relaxed">{mockHotelData.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Ideal for guests who...</h3>
                <p className="text-sm text-muted-foreground">{mockHotelData.idealGuests}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">The atmosphere is...</h3>
                <p className="text-sm text-muted-foreground">{mockHotelData.atmosphere}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Our location is perfect for...</h3>
                <p className="text-sm text-muted-foreground">{mockHotelData.perfectLocation}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Dynamic Availability and Pricing Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Availability & Pricing
          </h2>
          
          <div className="space-y-4 mb-6">
            <p className="text-muted-foreground">Available date ranges:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockHotelData.availabilityPackages.map((pkg, index) => (
                <Card 
                  key={index}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPackage?.startDate === pkg.startDate ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="text-center space-y-2">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground`}>
                      {formatDateRange(pkg.startDate, pkg.endDate)}
                    </div>
                    <p className="text-sm font-medium">{pkg.duration} days</p>
                    <p className="text-lg font-bold text-primary">€{pkg.price.toLocaleString()}</p>
                    {pkg.remainingRooms <= 3 && (
                      <p className="text-sm text-orange-600 font-medium">
                        Only {pkg.remainingRooms} room{pkg.remainingRooms !== 1 ? 's' : ''} left!
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {selectedPackage && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">Selected Package Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Check-in:</span>
                    <p className="font-medium">{new Date(selectedPackage.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Check-out:</span>
                    <p className="font-medium">{new Date(selectedPackage.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{selectedPackage.duration} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Price:</span>
                    <p className="font-medium text-primary">€{selectedPackage.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">Dynamic pricing – Secure your rate today before prices go up.</span>
                </div>
                <Button className="w-full md:w-auto">Book Now</Button>
              </div>
            </Card>
          )}
        </Card>

        {/* Hotel & Room Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Room Features
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockHotelData.roomFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Hotel Features
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockHotelData.hotelFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Reviews Placeholder */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Guest Reviews</h2>
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Reviews and ratings will be displayed here</p>
            <p className="text-sm">Coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}