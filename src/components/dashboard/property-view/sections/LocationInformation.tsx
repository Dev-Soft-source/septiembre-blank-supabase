
import React from "react";
import { Card } from "@/components/ui/card";

interface LocationInformationProps {
  hotel: any;
}

export function LocationInformation({ hotel }: LocationInformationProps) {
  return (
    <Card className="p-6 bg-[#7204B8]">
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Location</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Country</h4>
          <p className="text-sm text-white">{hotel.country || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">City</h4>
          <p className="text-sm text-white">{hotel.city || "Not specified"}</p>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium text-fuchsia-200">Address</h4>
          <p className="text-sm text-white">{hotel.address || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Postal Code</h4>
          <p className="text-sm text-white">{hotel.postal_code || "Not specified"}</p>
        </div>
      </div>
    </Card>
  );
}
