import { supabase } from "@/integrations/supabase/client";

export async function importAvailabilityPackagesFromStorage() {
  try {
    console.log("Calling import-hotel-data function to get availability packages...");
    
    const { data, error } = await supabase.functions.invoke('import-hotel-data', {
      body: {}
    });

    if (error) {
      console.error("Edge function error:", error);
      throw error;
    }

    console.log("Availability packages data retrieved successfully");
    return data;
  } catch (error) {
    console.error("Failed to import availability packages:", error);
    throw error;
  }
}