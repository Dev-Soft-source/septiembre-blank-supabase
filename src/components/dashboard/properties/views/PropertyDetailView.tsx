import React from 'react';
import { Card } from "@/components/ui/card";
import { Hotel } from "@/integrations/supabase/types-custom";
import { ImageGallery } from "../../property-view/sections/ImageGallery";
import { ThemesActivities } from "../../property-view/sections/ThemesActivities";
import { formatDatesForDisplay } from "@/utils/availabilityUtils";
interface PropertyDetailViewProps {
  hotel: Hotel;
  onBack: () => void;
  onEdit: () => void;
}
export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  hotel,
  onBack,
  onEdit
}) => {
  console.log("PropertyDetailView - Hotel data:", hotel);

  // Helper function to render features
  const renderFeatures = (features: Record<string, boolean> | undefined, title: string) => {
    if (!features || Object.keys(features).length === 0) {
      return <div>
          <h4 className="font-medium text-fuchsia-200 mb-2">{title}</h4>
          <p className="text-gray-400">No features specified</p>
        </div>;
    }
    const enabledFeatures = Object.entries(features).filter(([_, selected]) => selected).map(([feature]) => feature);
    return <div>
        <h4 className="font-medium text-fuchsia-200 mb-2">{title}</h4>
        {enabledFeatures.length > 0 ? <div className="flex flex-wrap gap-2">
            {enabledFeatures.map(feature => <span key={feature} className="px-3 py-1 bg-fuchsia-700/30 rounded-full text-sm text-white border border-fuchsia-500/30">
                {feature.replace(/_/g, ' ')}
              </span>)}
          </div> : <p className="text-gray-400">No features specified</p>}
      </div>;
  };

  // Format availability dates for display
  const formatAvailabilityDates = () => {
    const allDates = new Set<string>();

    // Add full month availability dates
    if (hotel.available_months && hotel.available_months.length > 0) {
      hotel.available_months.forEach((month: string) => {
        if (month) {
          const normalizedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
          allDates.add(`${normalizedMonth} (Full Month)`);
        }
      });
    }

    // Add specific dates from room types
    if (hotel.room_types && hotel.room_types.length > 0) {
      hotel.room_types.forEach(room => {
        if (room.availabilityDates) {
          room.availabilityDates.forEach((date: string) => {
            try {
              const parsedDate = new Date(date);
              const formattedDate = parsedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              allDates.add(formattedDate);
            } catch (error) {
              console.error('Error parsing date:', error);
            }
          });
        }
      });
    }
    return Array.from(allDates);
  };

  // Calculate total available rooms
  const getTotalAvailableRooms = () => {
    if (!hotel.room_types || hotel.room_types.length === 0) {
      return 0;
    }
    return hotel.room_types.reduce((total, room) => {
      const roomCount = room.roomCount || room.room_count || 0;
      return total + (typeof roomCount === 'number' ? roomCount : 0);
    }, 0);
  };
  return <div className="space-y-6 bg-[#7204B8] rounded-2xl p-6">
      <div className="flex justify-between items-center">
        <button className="px-4 py-2 rounded bg-fuchsia-700 text-white" onClick={onBack}>
          ← Back to Properties
        </button>
        <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={onEdit}>
          Edit Property
        </button>
      </div>
      
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Essential Property Information - NEW SECTION */}
        <Card className="p-6 border-2 border-fuchsia-500/50 bg-[#7204B8]">
          <h3 className="text-base font-semibold text-white mb-4">Property Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check-in/Check-out Day */}
            <div className="text-center">
              <h4 className="text-sm font-medium text-fuchsia-200 mb-2">Check-in / Check-out Day</h4>
              <div className="inline-flex items-center px-4 py-2 bg-[#7204B8] rounded-lg">
                <span className="text-sm font-semibold text-white">
                  {hotel.preferredWeekday || "Monday"}
                </span>
              </div>
            </div>

            {/* Available Rooms */}
            <div className="text-center">
              <h4 className="text-sm font-medium text-fuchsia-200 mb-2">Total Available Rooms</h4>
              <div className="inline-flex items-center px-4 py-2 bg-[#7204B8] rounded-lg">
                <span className="text-sm font-semibold text-white">
                  {getTotalAvailableRooms()} rooms
                </span>
              </div>
            </div>

            {/* Availability Status */}
            <div className="text-center">
              <h4 className="text-sm font-medium text-fuchsia-200 mb-2">Availability Dates</h4>
              <div className="inline-flex items-center px-4 py-2 bg-[#7204B8] rounded-lg">
                <span className="text-sm font-semibold text-white">
                  {formatAvailabilityDates().length} date periods
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Availability Information */}
        <Card className="p-6 bg-[#7204B8]">
          <h3 className="text-base font-semibold text-white mb-4">Detailed Availability Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200 mb-3">Available Dates</h4>
              {formatAvailabilityDates().length > 0 ? <div className="space-y-2">
                  {formatAvailabilityDates().map(date => <div key={date} className="px-3 py-2 bg-fuchsia-700/30 rounded-lg text-sm text-white border border-fuchsia-500/30">
                      {date}
                    </div>)}
                </div> : <p className="text-gray-400 italic">No availability dates specified</p>}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200 mb-3">Room Types & Availability</h4>
              {hotel.room_types && hotel.room_types.length > 0 ? <div className="space-y-2">
                  {hotel.room_types.map((room, index) => <div key={`room-type-${room.id || room.name}-${index}`} className="px-3 py-2 bg-blue-700/30 rounded-lg text-sm text-white border border-blue-500/30">
                      <div className="text-sm font-medium">{room.name || `Room Type ${index + 1}`}</div>
                      <div className="text-xs text-gray-300">
                        {room.roomCount || room.room_count || 0} rooms available
                      </div>
                    </div>)}
                </div> : <p className="text-gray-400 italic">No room types specified</p>}
            </div>
          </div>
          
          {hotel.stay_lengths && hotel.stay_lengths.length > 0 && <div className="mt-6">
              <h4 className="text-sm font-medium text-fuchsia-200 mb-2">Stay Lengths</h4>
              <div className="flex flex-wrap gap-2">
                {hotel.stay_lengths.map(length => <span key={length} className="px-3 py-1 bg-fuchsia-700/30 rounded-full text-sm text-white border border-fuchsia-500/30">
                    {length} days
                  </span>)}
              </div>
            </div>}
          
          {hotel.meal_plans && hotel.meal_plans.length > 0 && <div className="mt-4">
              <h4 className="text-sm font-medium text-fuchsia-200 mb-2">Meal Plans</h4>
              <div className="flex flex-wrap gap-2">
                {hotel.meal_plans.map(plan => <span key={plan} className="px-3 py-1 bg-fuchsia-700/30 rounded-full text-sm text-white border border-fuchsia-500/30">
                    {plan}
                  </span>)}
              </div>
            </div>}
        </Card>

        {/* Basic Information */}
        <Card className="p-6 bg-[#7204B8]">
          <h2 className="text-base font-semibold text-white mb-4">{hotel.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Location</h4>
              <p className="text-sm">{hotel.city}, {hotel.country}</p>
              {hotel.address && <p className="text-sm text-gray-300">{hotel.address}</p>}
            </div>
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Property Type</h4>
              <p className="text-sm">{hotel.property_type || "Not specified"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Style</h4>
              <p className="text-sm">{hotel.style || "Not specified"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-fuchsia-200">Category</h4>
              <p className="text-sm">{hotel.category ? `${hotel.category} Stars` : "Not specified"}</p>
            </div>
          </div>
          
          {hotel.description && <div className="mt-4">
              <h4 className="text-sm font-medium text-fuchsia-200">Description</h4>
              <p className="text-sm text-white whitespace-pre-wrap">{hotel.description}</p>
            </div>}
        </Card>

        {/* Hotel Highlights - The Missing Sections */}
        {(hotel.atmosphere || hotel.ideal_guests || hotel.perfect_location) && <Card className="p-6 bg-[#7204B8]">
            <h3 className="text-base font-semibold text-white mb-4">Hotel Highlights</h3>
            <div className="space-y-4 text-white">
              {hotel.atmosphere && <div>
                  <h4 className="text-sm font-medium text-fuchsia-200">The atmosphere of this hotel is</h4>
                  <p className="text-sm">{hotel.atmosphere}</p>
                </div>}
              {hotel.ideal_guests && <div>
                  <h4 className="text-sm font-medium text-fuchsia-200">This hotel is ideal for guests who enjoy</h4>
                  <p className="text-sm">{hotel.ideal_guests}</p>
                </div>}
              {hotel.perfect_location && <div>
                  <h4 className="text-sm font-medium text-fuchsia-200">Our location is perfect for</h4>
                  <p className="text-sm">{hotel.perfect_location}</p>
                </div>}
            </div>
          </Card>}

        {/* Images */}
        <ImageGallery hotel={hotel} />

        {/* Hotel Features and Room Features */}
        <Card className="p-6 bg-[#7204B8]">
          <h3 className="text-base font-semibold text-white mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            {renderFeatures(hotel.features_hotel, "Hotel Features")}
            {renderFeatures(hotel.features_room, "Room Features")}
          </div>
        </Card>

        {/* Pricing */}
        {hotel.rates && Object.keys(hotel.rates).length > 0 && <Card className="p-6 bg-[#7204B8]">
            <h3 className="text-base font-semibold text-white mb-4">Pricing</h3>
            <div className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(hotel.rates).map(([rateKey, price]) => {
              // Parse the rate key (e.g., "Double Room-32 days-allInclusive")
              const parts = rateKey.split('-');
              const roomType = parts[0] || 'Room';
              const duration = parts[1] || 'stay';
              const mealPlan = parts[2] || 'standard';
              return <div key={rateKey} className="p-3 bg-fuchsia-900/30 rounded-lg">
                      <h4 className="text-sm font-medium text-fuchsia-200">{roomType}</h4>
                      <p className="text-sm text-gray-300">Duration: {duration}</p>
                      <p className="text-sm text-gray-300">Meal Plan: {mealPlan.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                      <p className="text-sm font-semibold mt-2">${price}</p>
                    </div>;
            })}
              </div>
            </div>
          </Card>}
        
        {/* Themes and Activities */}
        <ThemesActivities hotel={hotel} />
        
        {/* Status Information */}
        <Card className="p-6 bg-[#7204B8]">
          <h3 className="text-base font-semibold text-white mb-4">Status Information</h3>
          <div className="text-white">
            <div className="mb-2">
              <span className="text-sm font-medium text-fuchsia-200">Current Status: </span>
              <span className={`px-2 py-1 rounded text-sm ${hotel.status === 'approved' ? 'bg-green-600' : hotel.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                {hotel.status === 'pending' ? 'Pending Approval' : hotel.status === 'approved' ? 'Approved' : hotel.status === 'rejected' ? 'Rejected' : hotel.status}
              </span>
            </div>
            {hotel.rejection_reason && hotel.status === 'rejected' && <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded">
                <h4 className="text-sm font-medium text-red-200">Rejection Reason</h4>
                <p className="text-sm text-white">{hotel.rejection_reason}</p>
              </div>}
          </div>
        </Card>
      </div>
    </div>;
};