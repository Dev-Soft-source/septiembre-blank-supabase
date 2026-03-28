import { supabase } from '@/integrations/supabase/client';

// Direct read and display SQL content
async function readSqlContent() {
  try {
    console.log('Reading hotels_rows.sql...');
    const { data: hotelsData, error: hotelsError } = await supabase.storage
      .from('Hotel-Data')
      .download('hotels_rows.sql');
    
    if (!hotelsError && hotelsData) {
      const hotelsSQL = await hotelsData.text();
      console.log('=== HOTELS SQL CONTENT ===');
      console.log(hotelsSQL);
      console.log('=== END HOTELS SQL ===');
    }

    console.log('Reading availability_packages_rows.sql...');
    const { data: packagesData, error: packagesError } = await supabase.storage
      .from('Hotel-Data')
      .download('availability_packages_rows.sql');
    
    if (!packagesError && packagesData) {
      const packagesSQL = await packagesData.text();
      console.log('=== AVAILABILITY PACKAGES SQL CONTENT ===');
      console.log(packagesSQL);
      console.log('=== END PACKAGES SQL ===');
    }

    console.log('Reading hotel_images_rows.sql...');
    const { data: imagesData, error: imagesError } = await supabase.storage
      .from('Hotel-Data')
      .download('hotel_images_rows.sql');
    
    if (!imagesError && imagesData) {
      const imagesSQL = await imagesData.text();
      console.log('=== HOTEL IMAGES SQL CONTENT ===');
      console.log(imagesSQL);
      console.log('=== END IMAGES SQL ===');
    }

  } catch (error) {
    console.error('Error reading SQL files:', error);
  }
}

// Execute on load

//readSqlContent();

export { readSqlContent };