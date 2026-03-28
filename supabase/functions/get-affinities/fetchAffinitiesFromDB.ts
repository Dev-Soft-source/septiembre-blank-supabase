
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function fetchAffinitiesFromDB() {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Fetch themes/affinities from the database
  const { data: themes, error: themesError } = await supabase
    .from('themes')
    .select('*')
    .order('name');

  if (themesError) {
    console.error("Error fetching themes:", themesError);
    throw new Error(`Failed to fetch themes: ${themesError.message}`);
  }

  // Fetch theme categories if they exist
  const { data: categories, error: categoriesError } = await supabase
    .from('theme_categories')
    .select('*')
    .order('name');

  if (categoriesError) {
    console.warn("No theme categories found or error fetching:", categoriesError);
  }

  return {
    themes: themes || [],
    categories: categories || []
  };
}
