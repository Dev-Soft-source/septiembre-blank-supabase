import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useAvailabilityPackages } from "@/hooks/useAvailabilityPackages";

interface AvailabilityPackagesSectionProps {
  hotel: any; // hotel data passed from parent
}

export function AvailabilityPackagesSection({ hotel }: AvailabilityPackagesSectionProps) {
  // Custom hook to fetch availability packages by hotel ID
  const { packages, isLoading, error } = useAvailabilityPackages(hotel.id);

  // Helper function to format availability dates and room count
  const formatDateRange = (startDate: string, endDate: string, availableRooms: number) => {
    const start = format(new Date(startDate), "dd/MM/yyyy");
    const end = format(new Date(endDate), "dd/MM/yyyy");
    return `${start} – ${end} – ${availableRooms} room${availableRooms !== 1 ? "s" : ""}`;
  };

  // Loading state UI
  if (isLoading) {
    return (
      <Card className="p-6 bg-[#7204B8] mb-8">
        <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">
          Detailed Availability Information
        </h3>
        <p className="text-white">Loading availability packages...</p>
      </Card>
    );
  }

  // Log errors but don’t break UI
  if (error) {
    console.error("Error loading availability packages:", error);
  }

  return (
    <Card className="p-6 bg-[#7204B8] mb-8">
      {/* Title */}
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">
        Detailed Availability Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div>
          {/* Available Dates */}
          <h4 className="text-sm font-medium text-fuchsia-200 mb-3">Available Dates</h4>
          {packages && packages.length > 0 ? (
            <div className="space-y-2">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-fuchsia-900/50 rounded text-sm text-white"
                >
                  {formatDateRange(pkg.start_date, pkg.end_date, pkg.available_rooms)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">
              No availability packages specified
            </p>
          )}

          {/* Stay Lengths */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-fuchsia-200 mb-2">Stay Lengths</h5>
            {hotel.stay_lengths && hotel.stay_lengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hotel.stay_lengths.map((length: number) => (
                  <span
                    key={length}
                    className="px-2 py-1 bg-fuchsia-900/50 rounded text-xs text-white"
                  >
                    {length} days
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">No stay lengths specified</p>
            )}
          </div>

          {/* Meal Plans */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-fuchsia-200 mb-2">Meal Plans</h5>
            {hotel.meal_plans && hotel.meal_plans.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hotel.meal_plans.map((plan: string) => (
                  <span
                    key={plan}
                    className="px-2 py-1 bg-fuchsia-900/50 rounded text-xs text-white"
                  >
                    {plan}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">No meal plans specified</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200 mb-3">
            Room Types & Availability
          </h4>
          {hotel.room_types && hotel.room_types.length > 0 ? (
            <div className="space-y-3">
              {hotel.room_types.map((room: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-purple-900/20 rounded-lg border border-purple-700/30"
                >
                  <h5 className="text-sm font-medium text-purple-300">
                    {room.name || `Room Type ${index + 1}`}
                  </h5>
                  <p className="text-sm text-gray-400">
                    {room.roomCount || room.room_count || 0} rooms available
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No room types specified</p>
          )}
        </div>
      </div>
    </Card>
  );
}
