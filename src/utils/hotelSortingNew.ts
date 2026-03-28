/**
 * New hotel sorting utility that uses the exact same price as displayed on hotel cards
 */

import { extractCardDisplayPrice, SortableHotel } from './cardPriceExtraction';
import { NameSortOption, PriceSortOption } from '@/store/sortingStore';

/**
 * Sort hotels by name or price using the exact displayed card price
 */
export async function sortHotelsByCardPrice<T extends SortableHotel>(
  hotels: T[], 
  nameSortOption: NameSortOption | null,
  priceSortOption: PriceSortOption | null
): Promise<T[]> {
  console.log('🚨🚨🚨 SORTING FUNCTION CALLED!');
  console.log(`🚨 Sorting ${hotels.length} hotels - name: ${nameSortOption}, price: ${priceSortOption}`);
  
  const hotelsCopy = [...hotels];
  
  // If no sorting options are selected, return original order
  if (!nameSortOption && !priceSortOption) {
    console.log('🚨 No sorting options - returning original order');
    return hotelsCopy;
  }
  
  // Name sorting (synchronous)
  if (nameSortOption) {
    console.log(`🚨 Sorting by name: ${nameSortOption}`);
    if (nameSortOption === 'name_asc') {
      return hotelsCopy.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return hotelsCopy.sort((a, b) => b.name.localeCompare(a.name));
    }
  }
  
  // Price sorting (asynchronous - uses card display price)
  if (priceSortOption) {
    console.log(`🚨 Sorting by price: ${priceSortOption}`);
    
    // Extract display prices for all hotels
    const hotelsWithPrices = await Promise.all(
      hotelsCopy.map(async (hotel) => {
        const displayPrice = await extractCardDisplayPrice(hotel);
        return {
          hotel,
          displayPrice
        };
      })
    );
    
    // Log price analysis
    console.log('🚨 Card display prices:');
    hotelsWithPrices.forEach(({ hotel, displayPrice }) => {
      if (displayPrice !== Infinity) {
        console.log(`🚨   - ${hotel.name}: $${displayPrice.toLocaleString()}`);
      } else {
        console.log(`🚨   - ${hotel.name}: Price on request`);
      }
    });
    
    // Sort by display price
    hotelsWithPrices.sort((a, b) => {
      if (priceSortOption === 'price_asc') {
        return a.displayPrice - b.displayPrice;
      } else {
        return b.displayPrice - a.displayPrice;
      }
    });
    
    const sortedHotels = hotelsWithPrices.map(item => item.hotel);
    
    // Log the final sorted order
    console.log(`🚨 Final ${priceSortOption} order:`);
    sortedHotels.slice(0, 10).forEach((hotel, index) => {
      const priceInfo = hotelsWithPrices.find(h => h.hotel.id === hotel.id);
      if (priceInfo?.displayPrice !== Infinity) {
        console.log(`🚨   ${index + 1}. ${hotel.name}: $${priceInfo?.displayPrice?.toLocaleString()}`);
      } else {
        console.log(`🚨   ${index + 1}. ${hotel.name}: Price on request`);
      }
    });
    
    return sortedHotels;
  }
  
  return hotelsCopy;
}