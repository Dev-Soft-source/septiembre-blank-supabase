
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminHotelDetail } from "@/types/hotel";
import { BasicInformation } from "./sections/BasicInformation";
import { LocationInformation } from "./sections/LocationInformation";
import { AccommodationTerms } from "./sections/AccommodationTerms";
import { ThemesActivities } from "./sections/ThemesActivities";
import { FeaturesSection } from "./sections/FeaturesSection";
import { ContactInformation } from "./sections/ContactInformation";
import { FaqSection } from "./sections/FaqSection";
import { ImageGallery } from "./sections/ImageGallery";
import { RoomTypesSection } from "./sections/RoomTypesSection";
import { Card } from "@/components/ui/card";
import { AvailabilityPackagesSection } from "./sections/AvailabilityPackagesSection";
import { useAvailabilityPackages } from "@/hooks/useAvailabilityPackages";

interface PropertyDetailViewProps {
  hotel: any;
  onEdit?: () => void;
}

export default function PropertyDetailView({ hotel, onEdit }: PropertyDetailViewProps) {
  console.log("PropertyDetailView hotel data:", hotel);
  
  // Fetch availability packages for the correct count
  const { packages } = useAvailabilityPackages(hotel.id);
  
  // Helper function to get badge variant based on status
  const getStatusBadge = () => {
    switch (hotel.status) {
      case 'pending':
        return <Badge variant="outline" className="ml-2 bg-yellow-100/20 text-yellow-300 border-yellow-400">Pending Approval</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="ml-2 bg-red-100/20 text-red-300 border-red-400">Rejected</Badge>;
      case 'approved':
        return <Badge variant="outline" className="ml-2 bg-green-100/20 text-green-300 border-green-400">Approved</Badge>;
      default:
        return <Badge variant="outline" className="ml-2 bg-yellow-100/20 text-yellow-300 border-yellow-400">Pending Approval</Badge>;
    }
  };
  
  return (
    <div className="relative bg-fuchsia-950/30 p-4 sm:p-6 rounded-xl">
      {/* Edit Button */}
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit Property
        </Button>
      </div>

      {/* Property Title with Status Badge */}
      <h2 className="text-base sm:text-lg font-semibold mb-6 pr-24 flex items-center">
        {hotel.name}
        {getStatusBadge()}
      </h2>

      {hotel.rejection_reason && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <h3 className="font-semibold text-red-400">Rejection Reason:</h3>
          <p className="mt-1 text-white/80">{hotel.rejection_reason}</p>
        </div>
      )}

      {/* Basic Information Section - Images, Basic Info, Location */}
      <div className="space-y-8">
        <ImageGallery hotel={hotel} />
        <BasicInformation hotel={hotel} />
        <LocationInformation hotel={hotel} />
      </div>

      {/* Property Overview Section */}
      <Card className="p-6 bg-[#7204B8] mb-8 mt-8">
        <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Property Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-sm text-gray-400 mb-2">Check-in / Check-out Day</h4>
            <p className="text-sm font-semibold text-white">{hotel.preferredWeekday || "Monday"}</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm text-gray-400 mb-2">Total Available Rooms</h4>
            <p className="text-sm font-semibold text-white">
              {hotel.room_types?.reduce((total: number, room: any) => total + (room.roomCount || room.room_count || 0), 0) || 0} rooms
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-sm text-gray-400 mb-2">Availability Dates</h4>
            <p className="text-sm font-semibold text-white">
              {packages?.length || 0} date periods
            </p>
          </div>
        </div>
      </Card>

      {/* Pricing Section */}
      {hotel.room_types && hotel.room_types.length > 0 && hotel.room_types.some((room: any) => room.rates && Object.keys(room.rates).length > 0) && (
        <Card className="p-6 bg-[#7204B8] mb-8">
          <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Pricing</h3>
          {hotel.room_types.map((room: any, index: number) => {
            if (!room.rates || Object.keys(room.rates).length === 0) return null;
            
            return (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="text-sm font-medium text-purple-300 mb-2">{room.name || `Room Type ${index + 1}`}</h4>
                <p className="text-sm text-gray-400 mb-2">Duration: 32 days</p>
                <p className="text-sm text-gray-400 mb-2">Meal Plan: half board</p>
                {Object.entries(room.rates).map(([duration, price]) => (
                  <p key={duration} className="text-base font-bold text-white">${String(price)}</p>
                ))}
              </div>
            );
          })}
        </Card>
      )}

      {/* Hotel Highlights Section */}
      {(hotel.atmosphere || hotel.ideal_guests || hotel.perfect_location) && (
        <Card className="p-6 bg-[#7204B8] mb-8">
          <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Hotel Highlights</h3>
          <div className="space-y-4">
            {hotel.atmosphere && (
              <div>
                <h4 className="text-sm font-medium text-fuchsia-200 mb-2">The atmosphere of this hotel is</h4>
                <p className="text-sm text-gray-300">{hotel.atmosphere}</p>
              </div>
            )}
            {hotel.ideal_guests && (
              <div>
                <h4 className="text-sm font-medium text-fuchsia-200 mb-2">This hotel is ideal for guests who enjoy</h4>
                <p className="text-sm text-gray-300">{hotel.ideal_guests}</p>
              </div>
            )}
            {hotel.perfect_location && (
              <div>
                <h4 className="text-sm font-medium text-fuchsia-200 mb-2">Our location is perfect for</h4>
                <p className="text-sm text-gray-300">{hotel.perfect_location}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Detailed Availability Information with Packages */}
      <AvailabilityPackagesSection hotel={hotel} />
      
      <div className="space-y-8">
        <AccommodationTerms hotel={hotel} />
        <RoomTypesSection hotel={hotel} />
        <FeaturesSection hotel={hotel} />
        <Card className="p-6 bg-[#7204B8]">
          <ThemesActivities hotel={hotel} />
        </Card>
        <ContactInformation hotel={hotel} />
        <FaqSection hotel={hotel} />
      </div>
    </div>
  );
}
