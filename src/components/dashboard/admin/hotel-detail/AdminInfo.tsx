
import React from "react";
import { Clock, ExternalLink, FileText, Download } from "lucide-react";
import { AdminHotelDetail } from "@/types/hotel";
import { useHotelOwners } from "./hooks/useHotelOwners";
import { useBookingsCount } from "./hooks/useBookingsCount";
import { OwnerSelector } from "./components/OwnerSelector";
import { StatusSelector } from "./components/StatusSelector";
import { AdminInfoDetails } from "./components/AdminInfoDetails";
import { Button } from "@/components/ui/button";
import { createWorkbookFromMultipleSheets } from "@/utils/lazyExcel";
import { formatDate } from "@/components/dashboard/utils/dateUtils";

interface AdminInfoProps {
  hotel: AdminHotelDetail;
  refetch?: () => Promise<void>; // Optional refetch function to update data
}

export function AdminInfo({ hotel, refetch }: AdminInfoProps) {
  const hotelOwners = useHotelOwners();
  const totalBookings = useBookingsCount(hotel.id);
  
  // Get the main hotel image or first image if no main image is set
  const mainImage = hotel.hotel_images?.find(img => img.is_main)?.image_url || 
                   hotel.hotel_images?.[0]?.image_url || 
                   hotel.main_image_url;

  // Function to export hotel data to Excel using dynamic import
  const exportToExcel = async () => {
    try {
      // Prepare data for export  
      const roomTypesSummary = []; // room_types was removed from schema

      // Create main hotel data row
      const hotelData = [{
        "Hotel ID": hotel.id,
        "Name": hotel.name,
        "Status": hotel.status || "pending",
        "Published": hotel.status === 'approved' ? "Yes" : "No",
        "Owner ID": hotel.owner_id || "No owner",
        "City": hotel.city,
        "Country": hotel.country,
        "Created At": formatDate(hotel.created_at),
        "Updated At": formatDate(hotel.updated_at),
        "Total Bookings": totalBookings,
        "Total Rooms": hotel.total_rooms || 0,
        "Description": hotel.description || "No description"
      }];

      // Prepare sheets data
      const sheets: Record<string, any[]> = {
        "Hotel Info": hotelData
      };

      // Add room types sheet if any exist
      if (roomTypesSummary.length > 0) {
        sheets["Room Types"] = roomTypesSummary;
      }
      
      // Add themes sheet if any exist
      if (hotel.hotel_themes?.length > 0) {
        sheets["Themes"] = hotel.hotel_themes.map(theme => ({
          "Theme ID": theme.theme_id,
          "Theme Name": theme.themes?.name || "Unknown"
        }));
      }
      
      // Add activities sheet if any exist
      if (hotel.hotel_activities?.length > 0) {
        sheets["Activities"] = hotel.hotel_activities.map(activity => ({
          "Activity ID": activity.activity_id,
          "Activity Name": activity.activities?.name || "Unknown"
        }));
      }
      
      // Generate filename with hotel name and current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `hotel-${hotel.id.substring(0, 8)}-${date}.xlsx`;
      
      // Create and download the file using dynamic import
      await createWorkbookFromMultipleSheets(sheets, filename);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="rounded-xl p-6 bg-[#5d0083]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700 flex items-center gap-2">
        <Clock className="w-5 h-5 text-purple-400" />
        Administrative Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mainImage && (
          <div className="md:col-span-2 flex justify-center mb-4">
            <img 
              src={mainImage} 
              alt={`${hotel.name} thumbnail`} 
              className="w-32 h-32 rounded shadow-md object-cover border-2 border-purple-400" 
            />
          </div>
        )}
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400">Owner</p>
          <OwnerSelector
            hotelId={hotel.id}
            currentOwnerId={hotel.owner_id || null}
            hotelOwners={hotelOwners}
            onSuccess={refetch}
          />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400">Status</p>
          <StatusSelector
            hotelId={hotel.id}
            currentStatus={hotel.status || "pending"} 
            onSuccess={refetch}
          />
        </div>
        <AdminInfoDetails hotel={hotel} totalBookings={totalBookings} />
        
        {/* Export and View buttons */}
        <div className="md:col-span-2 mt-4 flex justify-center gap-4 flex-wrap">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3a0052] hover:bg-[#4a0062] text-white rounded-md transition-colors"
          >
            <FileText className="h-4 w-4" />
            Export Hotel Data
          </button>
          
          <a
            href={`/hotel/${hotel.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3a0052] hover:bg-[#4a0062] text-white rounded-md transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View as visitor
          </a>
        </div>
      </div>
    </div>
  );
}
