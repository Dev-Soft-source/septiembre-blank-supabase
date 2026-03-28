
import React from "react";
import { Card } from "@/components/ui/card";

interface ContactInformationProps {
  hotel: any;
}

export function ContactInformation({ hotel }: ContactInformationProps) {
  return (
    <Card className="p-6 bg-[#7204B8]">
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Contact Name</h4>
          <p className="text-sm text-white">{hotel.contact_name || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Contact Email</h4>
          <p className="text-sm text-white">{hotel.contact_email || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Contact Phone</h4>
          <p className="text-sm text-white">{hotel.contact_phone || "Not specified"}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-fuchsia-200">Contact Website</h4>
          <p className="text-sm text-white">{hotel.contact_website || "Not specified"}</p>
        </div>
      </div>
    </Card>
  );
}
