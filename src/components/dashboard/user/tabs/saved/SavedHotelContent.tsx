
import React from "react";
import { MapPin, Star } from "lucide-react";

interface SavedHotelContentProps {
  name: string;
  city: string;
  country: string;
  description: string | null;
  price: number;
}

export default function SavedHotelContent({ 
  name, 
  city, 
  country, 
  description, 
  price 
}: SavedHotelContentProps) {
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-1">{name || 'Unknown Hotel'}</h3>
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{city}, {country}</span>
      </div>
      <div className="flex mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
        {description || 'No description available'}
      </p>
      
      <div className="mt-4">
        <span className="block text-lg font-bold">
          ${price || 0}
        </span>
        <span className="text-xs text-muted-foreground">per month</span>
      </div>
    </div>
  );
}
