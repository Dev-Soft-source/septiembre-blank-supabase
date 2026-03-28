import { importAvailabilityPackagesFromStorage } from '@/utils/importHotelData';

async function getAvailabilityData() {
  try {
    console.log('Retrieving availability packages data...');
    const result = await importAvailabilityPackagesFromStorage();
    
    if (result?.sqlContent) {
      console.log('SQL Content retrieved:');
      console.log(result.sqlContent);
      return result.sqlContent;
    } else {
      console.error('No SQL content found in result:', result);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving availability data:', error);
    return null;
  }
}

// Execute immediately
getAvailabilityData().then(data => {
  if (data) {
    console.log('=== AVAILABILITY PACKAGES SQL DATA ===');
    console.log(data);
    console.log('=== END DATA ===');
  }
});

export { getAvailabilityData };