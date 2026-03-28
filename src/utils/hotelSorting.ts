import { extractCardDisplayPrice, SortableHotel } from './cardPriceExtraction';

export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

/**
 * DEPRECATED: Use sortHotelsByCardPrice from hotelSortingNew.ts instead
 * This function is kept for backwards compatibility
 */
async function getDisplayPrice(hotel: SortableHotel): Promise<number> {
  return await extractCardDisplayPrice(hotel);
}

/**
 * DEPRECATED: Use sortHotelsByCardPrice from hotelSortingNew.ts instead
 * This function is kept for backwards compatibility
 */
export async function sortHotels<T extends SortableHotel>(hotels: T[], sortOption: SortOption): Promise<T[]> {
  console.log(`🔄 Sorting ${hotels.length} hotels by: ${sortOption}`);
  
  const hotelsCopy = [...hotels];
  
  switch (sortOption) {
    case 'name_asc':
      console.log('📝 Sorting by name A-Z');
      return hotelsCopy.sort((a, b) => a.name.localeCompare(b.name));
      
    case 'name_desc':
      console.log('📝 Sorting by name Z-A');
      return hotelsCopy.sort((a, b) => b.name.localeCompare(a.name));
      
    case 'price_asc':
    case 'price_desc': {
      console.log(`💰 Sorting by price: ${sortOption === 'price_asc' ? 'low to high' : 'high to low'}`);
      
      // For price sorting, we need to calculate the display price for each hotel
      const hotelsWithPrices = await Promise.all(
        hotelsCopy.map(async (hotel) => {
          const displayPrice = await getDisplayPrice(hotel);
          return {
            hotel,
            displayPrice
          };
        })
      );
      
      // Log price analysis
      console.log('💰 Price analysis:');
      hotelsWithPrices.forEach(({ hotel, displayPrice }) => {
        if (displayPrice !== Infinity) {
          console.log(`   - ${hotel.name}: $${displayPrice}`);
        }
      });
      
      // Sort by display price
      hotelsWithPrices.sort((a, b) => {
        if (sortOption === 'price_asc') {
          return a.displayPrice - b.displayPrice;
        } else {
          return b.displayPrice - a.displayPrice;
        }
      });
      
      const sortedHotels = hotelsWithPrices.map(item => item.hotel);
      
      // Log the final sorted order
      console.log(`💰 Final ${sortOption} order:`);
      sortedHotels.slice(0, 10).forEach((hotel, index) => {
        const priceInfo = hotelsWithPrices.find(h => h.hotel.id === hotel.id);
        console.log(`   ${index + 1}. ${hotel.name}: $${priceInfo?.displayPrice}`);
      });
      
      return sortedHotels;
    }
      
    default:
      console.log('📝 No sorting applied, returning original order');
      return hotelsCopy;
  }
}