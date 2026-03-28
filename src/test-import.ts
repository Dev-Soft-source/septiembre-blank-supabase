import { importAvailabilityPackagesFromStorage } from './utils/importHotelData';

// Test function to get availability packages data
export async function testImportAvailabilityPackages() {
  try {
    const data = await importAvailabilityPackagesFromStorage();
    console.log('Availability packages data:', data);
    return data;
  } catch (error) {
    console.error('Error importing availability packages:', error);
  }
}

// Make it available globally for testing
(window as any).testImportAvailabilityPackages = testImportAvailabilityPackages;

// Call immediately for testing
testImportAvailabilityPackages();