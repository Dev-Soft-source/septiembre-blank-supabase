
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Export activities function started")

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify admin access
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User authenticated:', user.email)

    // Check user roles directly
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError)
      return new Response(
        JSON.stringify({ error: 'Error checking user roles' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User roles found:', userRoles)
    
    const isAdmin = userRoles?.some(role => role.role === 'admin') || false

    if (!isAdmin) {
      console.error('User is not admin:', user.email, 'Roles:', userRoles)
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Admin access verified for:', user.email)

    // Export all activities with complete structure
    const { data: activities, error: activitiesError } = await supabaseClient
      .from('activities')
      .select(`
        id,
        name,
        category,
        level,
        parent_id,
        sort_order,
        created_at
      `)
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch activities' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully exported ${activities?.length || 0} activities`)

    // Create structured export data
    const exportData = {
      export_date: new Date().toISOString(),
      total_activities: activities?.length || 0,
      structure: {
        level_1_categories: activities?.filter(a => a.level === 1).length || 0,
        level_2_subcategories: activities?.filter(a => a.level === 2).length || 0,
        level_3_items: activities?.filter(a => a.level === 3).length || 0
      },
      activities: activities || []
    }

    // Return as downloadable JSON
    return new Response(
      JSON.stringify(exportData, null, 2),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="activities-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      }
    )

  } catch (error) {
    console.error('Export activities error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
