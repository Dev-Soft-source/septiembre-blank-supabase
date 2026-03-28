
import React from "react";
import { HotelDetailProps } from "@/types/hotel/detail";
import { HotelDetailContentEnhanced } from "./HotelDetailContentEnhanced";

interface HotelDetailContentProps {
  hotel: HotelDetailProps;
  isLoading?: boolean;
}

export function HotelDetailContent({ hotel, isLoading }: HotelDetailContentProps) {
  return <HotelDetailContentEnhanced hotel={hotel} isLoading={isLoading} />;
}
