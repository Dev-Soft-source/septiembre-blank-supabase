import React from "react";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { getMonthName } from "@/utils/dateUtils";

export const AvailabilityInfo = ({ hotel }) => {
  // Format stay lengths for display
  const formatStayLength = (days) => {
    return days === 1 ? `${days} day` : `${days} days`;
  };
  
  const formatAvailabilityDates = () => {
    // Get all availability dates from room types
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
    
    // Add specific room type availability dates
    if (hotel.room_types && hotel.room_types.length > 0) {
      hotel.room_types.forEach(room => {
        if (room.availabilityDates) {
          room.availabilityDates.forEach((date: string) => {
            try {
              const parsedDate = parseISO(date);
              const formattedDate = format(parsedDate, 'MMMM d, yyyy');
              allDates.add(formattedDate);
            } catch (error) {
              console.error('Error parsing date:', date, error);
            }
          });
        }
      });
    }
    
    return Array.from(allDates);
  };

  return (
    <Card className="p-6 bg-[#5A0080]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700">Availability Information</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="font-medium text-fuchsia-200">Availability Dates</h4>
          {formatAvailabilityDates().length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {formatAvailabilityDates().map(date => (
                <span 
                  key={date} 
                  className="px-3 py-1 bg-fuchsia-900/50 rounded-full text-sm"
                >
                  {date}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No availability dates specified</p>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Stay Lengths</h4>
          {hotel.stay_lengths && hotel.stay_lengths.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {hotel.stay_lengths.map(length => (
                <span 
                  key={length} 
                  className="px-3 py-1 bg-fuchsia-900/50 rounded-full text-sm"
                >
                  {formatStayLength(length)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No stay lengths specified</p>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Meal Plans</h4>
          {hotel.meal_plans && hotel.meal_plans.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {hotel.meal_plans.map(plan => (
                <span 
                  key={plan} 
                  className="px-3 py-1 bg-fuchsia-900/50 rounded-full text-sm"
                >
                  {plan}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No meal plans specified</p>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-fuchsia-200">Check-in Day</h4>
          <p className="mt-1">{hotel.preferredWeekday || "Monday"}</p>
        </div>
      </div>
    </Card>
  );
};
