
/**
 * Configuration for booking colors based on room type and duration
 */
export const getBookingColor = (roomTypeId: string, duration: number): string => {
  if (roomTypeId === "single") {
    return duration <= 8 ? "bg-[#B1E2DC]" : "bg-[#FFE299]";
  } else {
    return duration <= 16 ? "bg-[#F8D0EC]" : "bg-[#C9E7F8]";
  }
};

/**
 * CSS class based on whether a booking is highlighted
 */
export const getHighlightClass = (isHighlighted: boolean): string => {
  return isHighlighted 
    ? 'border-2 border-fuchsia-500 shadow-lg' 
    : 'border border-gray-300/20';
};
