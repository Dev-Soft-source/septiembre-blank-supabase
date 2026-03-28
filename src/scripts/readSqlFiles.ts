import { supabase } from '@/integrations/supabase/client';

async function readAllSqlFiles() {
  const files = [
    'hotels_rows.sql',
    'hotel_images_rows.sql', 
    'hotel_themes_rows.sql',
    'hotel_activities_rows.sql',
    'hotel_translations_rows.sql',
    'availability_packages_rows.sql'
  ];

  for (const fileName of files) {
    try {
      console.log(`\n=== Reading ${fileName} ===`);
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('Hotel-Data')
        .download(fileName);

      if (fileError) {
        console.error(`Error reading ${fileName}:`, fileError);
        continue;
      }

      const sqlContent = await fileData.text();
      console.log(`Content of ${fileName}:`);
      console.log(sqlContent);
      console.log(`=== End of ${fileName} ===\n`);
      
    } catch (error) {
      console.error(`Failed to read ${fileName}:`, error);
    }
  }
}

// Execute immediately
readAllSqlFiles();

export { readAllSqlFiles };