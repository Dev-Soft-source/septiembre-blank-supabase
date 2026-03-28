export interface PricingMatrixItem {
  duration: number;
  doubleRoom: number;
  singleRoom: number;
}

export interface PricingMatrixProps {
  pricingMatrix: PricingMatrixItem[];
}

export type RoomUsageType = 'single' | 'double';

export interface BookingPriceCalculation {
  pricePerPerson: number;
  totalGuests: number;
  totalPrice: number;
  roomUsageType: RoomUsageType;
  duration: number;
}