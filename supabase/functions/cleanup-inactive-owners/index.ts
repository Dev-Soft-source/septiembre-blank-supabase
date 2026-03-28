
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const SUPABASE_URL = "https://pgdzrvdwgoomjnnegkcn.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Add CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Starting cleanup of inactive hotel owner accounts...");
    
    // Find inactive hotel owners to be deleted
    const { data: inactiveOwners, error: findError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, created_at')
      .eq('is_hotel_owner', true)
      .lt('created_at', new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString());
    
    if (findError) {
      throw new Error(`Error finding inactive owners: ${findError.message}`);
    }
    
    console.log(`Found ${inactiveOwners?.length || 0} potentially inactive hotel owners`);
    
    // For each owner, check if they have hotels
    const ownersToDelete = [];
    
    for (const owner of inactiveOwners || []) {
      const { data: hotels, error: hotelError } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', owner.id)
        .limit(1);
      
      if (hotelError) {
        console.error(`Error checking hotels for owner ${owner.id}: ${hotelError.message}`);
        continue;
      }
      
      // If owner has no hotels, mark for deletion
      if (!hotels || hotels.length === 0) {
        ownersToDelete.push(owner);
      }
    }
    
    console.log(`Found ${ownersToDelete.length} inactive owners with no hotels to delete`);
    
    if (ownersToDelete.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No inactive hotel owners to delete", 
        deleted: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Delete the inactive owners
    const ownerIds = ownersToDelete.map(owner => owner.id);
    
    // Log the owners that will be deleted
    console.log("Deleting inactive owners:", ownersToDelete.map(o => ({
      id: o.id,
      name: `${o.first_name || ''} ${o.last_name || ''}`.trim() || 'Unknown',
      email: o.email,
      created_at: o.created_at
    })));
    
    // First delete the profiles
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .in('id', ownerIds);
    
    if (deleteProfileError) {
      throw new Error(`Error deleting profiles: ${deleteProfileError.message}`);
    }
    
    // Then delete the auth users (this cascades to profiles due to references)
    const { error: deleteUserError } = await supabase.auth.admin.deleteUsers(ownerIds);
    
    if (deleteUserError) {
      throw new Error(`Error deleting auth users: ${deleteUserError.message}`);
    }
    
    return new Response(JSON.stringify({ 
      message: "Successfully deleted inactive hotel owners", 
      deleted: ownersToDelete.length,
      owners: ownersToDelete.map(o => ({
        id: o.id,
        name: `${o.first_name || ''} ${o.last_name || ''}`.trim() || 'Unknown',
        email: o.email,
        created_at: o.created_at
      }))
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error in cleanup function:", error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
