
import { useState, useEffect } from "react";
import { AdminHotelDetail } from "@/types/hotel";
import { useHotelBasicDetails } from "./useHotelBasicDetails";
import { useHotelImages } from "./useHotelImages";
import { useHotelThemes } from "./useHotelThemes";
import { useHotelActivities } from "./useHotelActivities";
import { useHotelChanges } from "./useHotelChanges";

export function useHotelDetails(id: string | undefined) {
  const { hotel, loading: hotelLoading, refetch: refetchHotel } = useHotelBasicDetails(id);
  const { images, loading: imagesLoading } = useHotelImages(id);
  const { themes, loading: themesLoading } = useHotelThemes(id);
  const { activities, loading: activitiesLoading } = useHotelActivities(id);
  const { changes } = useHotelChanges(hotel);

  // Combined loading state - only show loading when hotel is loading (main data)
  const loading = hotelLoading;

  // Refetch all data
  const refetch = async () => {
    await refetchHotel();
  };

  // Debug logging
  useEffect(() => {
    console.log("useHotelDetails - Hotel ID:", id);
    console.log("useHotelDetails - Hotel data:", hotel);
    console.log("useHotelDetails - Loading states:", { hotelLoading, imagesLoading, themesLoading, activitiesLoading });
    console.log("useHotelDetails - Combined loading:", loading);
  }, [id, hotel, hotelLoading, imagesLoading, themesLoading, activitiesLoading, loading]);

  return { 
    hotel, 
    loading, 
    themes: themes || [], 
    activities: activities || [], 
    images: images || [], 
    changes: changes || [],
    refetch 
  };
}
