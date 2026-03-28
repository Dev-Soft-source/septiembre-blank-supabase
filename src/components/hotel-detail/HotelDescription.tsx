import React from "react";
import { safeString } from "@/utils/safeDataAccess";

interface HotelDescriptionProps {
  description: string | null;
  idealGuests?: string | null;
  atmosphere?: string | null;
  perfectLocation?: string | null;
}

export function HotelDescriptionSection({
  description,
  idealGuests,
  atmosphere,
  perfectLocation
}: HotelDescriptionProps) {
  // Safe access using utility functions with fallbacks
  const safeDescription = safeString(description, 'noDescription');
  const safeIdealGuests = safeString(idealGuests, 'notAvailable');
  const safeAtmosphere = safeString(atmosphere, 'notAvailable');
  const safePerfectLocation = safeString(perfectLocation, 'notAvailable');

  // Only show if we have actual content (not fallback text)
  const hasDescription = description && typeof description === 'string' && description.trim().length > 0;
  const hasIdealGuests = idealGuests && typeof idealGuests === 'string' && idealGuests.trim().length > 0;
  const hasAtmosphere = atmosphere && typeof atmosphere === 'string' && atmosphere.trim().length > 0;
  const hasPerfectLocation = perfectLocation && typeof perfectLocation === 'string' && perfectLocation.trim().length > 0;

  if (!hasDescription && !hasIdealGuests && !hasAtmosphere && !hasPerfectLocation) {
    return null;
  }

  return (
    <div className="mb-8 space-y-4">
      {hasDescription && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-white text-left">THE HOTEL AT A GLANCE...</h2>
          <p className="text-white">
            {safeDescription}
          </p>
        </div>
      )}
      
      {hasIdealGuests && (
        <div>
          <p className="text-white">
            <span className="font-semibold">ES IDEAL PARA QUIENES DISFRUTAN DE</span> {safeIdealGuests}
          </p>
        </div>
      )}
      
      {hasAtmosphere && (
        <div>
          <p className="text-white">
            <span className="font-semibold">EL AMBIENTE ES</span> {safeAtmosphere}
          </p>
        </div>
      )}
      
      {hasPerfectLocation && (
        <div>
          <p className="text-white">
            <span className="font-semibold">LA UBICACIÓN ES PERFECTA PARA</span> {safePerfectLocation}
          </p>
        </div>
      )}
    </div>
  );
}