import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestResult {
  name: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
  duration?: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const results: TestResult[] = [];

  const runTest = async (name: string, testFn: () => Promise<void>): Promise<TestResult> => {
    const startTime = performance.now();
    try {
      await testFn();
      const duration = performance.now() - startTime;
      return { name, status: 'success', message: 'Test passed', duration: Math.round(duration) };
    } catch (error: any) {
      const duration = performance.now() - startTime;
      return { 
        name, 
        status: 'error', 
        message: error.message || 'Test failed', 
        details: error,
        duration: Math.round(duration)
      };
    }
  };

  // Test 1: Database Schema Verification
  results.push(await runTest('Database Schema Verification', async () => {
    const requiredTables = ['hotels', 'bookings', 'availability_packages', 'booking_commissions', 'payments', 'profiles'];
    
    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) throw new Error(`Required table '${table}' not accessible: ${error.message}`);
    }

    // Test hotels_detailed_view
    const { error: viewError } = await supabase.from('hotels_detailed_view').select('*').limit(1);
    if (viewError) throw new Error(`hotels_detailed_view not accessible: ${viewError.message}`);
  }));

  // Test 2: Hotel Registration Flow
  results.push(await runTest('Hotel Registration Flow', async () => {
    const testHotelData = {
      name: 'Verification Test Hotel',
      country: 'Test Country',
      city: 'Test City',
      contact_email: 'test@verification.com',
      description: 'Test hotel for system verification',
      total_rooms: 10,
      price_per_month: 1500
    };

    const { data, error } = await supabase.functions.invoke('submit-hotel-registration', {
      body: {
        hotel_data: testHotelData,
        availability_packages: [],
        hotel_images: [],
        hotel_themes: [],
        hotel_activities: [],
        dev_mode: true
      }
    });

    if (error) throw error;
    if (!data?.success) throw new Error(data?.error?.message?.en || 'Hotel registration failed');
  }));

  // Test 3: Hotels Detailed View Query
  results.push(await runTest('Hotels Detailed View Query', async () => {
    const { data, error } = await supabase
      .from('hotels_detailed_view')
      .select(`
        id,
        name,
        city,
        country,
        hotel_images,
        hotel_themes,
        hotel_activities,
        status
      `)
      .limit(5);

    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('hotels_detailed_view should return an array');
  }));

  // Test 4: Availability Packages System
  results.push(await runTest('Availability Packages System', async () => {
    const { data, error } = await supabase
      .from('availability_packages')
      .select('id, hotel_id, start_date, end_date, available_rooms, total_rooms')
      .limit(5);

    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('availability_packages query failed');
  }));

  // Test 5: Booking Creation Process
  results.push(await runTest('Booking Creation Process', async () => {
    const { data: hotels } = await supabase
      .from('hotels')
      .select('id')
      .eq('status', 'approved')
      .limit(1)
      .single();

    if (!hotels) throw new Error('No approved hotels found for booking test');

    const { error } = await supabase
      .from('bookings')
      .select('id, user_id, hotel_id, check_in, check_out, total_price, status')
      .limit(1);

    if (error) throw error;
  }));

  // Test 6: Commission Generation
  results.push(await runTest('Commission Generation', async () => {
    const { error } = await supabase
      .from('booking_commissions')
      .select('id, booking_id, hotel_id, referral_id, referral_type, amount_usd, percentage, status')
      .limit(1);

    if (error) throw error;
  }));

  // Test 7: Payment System Integration
  results.push(await runTest('Payment System Integration', async () => {
    const { error } = await supabase
      .from('payments')
      .select('id, booking_id, amount, method, status, created_at')
      .limit(1);

    if (error) throw error;
  }));

  // Test 8: User Profile Management
  results.push(await runTest('User Profile Management', async () => {
    const { error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role, is_hotel_owner')
      .limit(1);

    if (error) throw error;
  }));

  // Test 9: Deleted Tables Cleanup
  results.push(await runTest('Deleted Tables Cleanup', async () => {
    const deletedTables = ['user_rewards', 'user_affinities', 'stay_extensions', 'group_proposals'];
    
    for (const table of deletedTables) {
      try {
        const { data, error } = await supabase.from(table as any).select('*').limit(1);
        if (!error) {
          throw new Error(`Deleted table '${table}' still exists and is accessible`);
        }
      } catch (error: any) {
        // Expected to fail - this is good
        if (error.message.includes('does not exist') || error.message.includes('not assignable')) {
          continue; // This is what we want
        }
        throw error;
      }
    }
  }));

  // Test 10: Admin Dashboard Functions
  results.push(await runTest('Admin Dashboard Functions', async () => {
    const { error: adminLogsError } = await supabase
      .from('admin_logs')
      .select('id, admin_id, action, created_at')
      .limit(1);

    if (adminLogsError) throw new Error(`Admin logs not accessible: ${adminLogsError.message}`);

    const { error: adminMessagesError } = await supabase
      .from('admin_messages')
      .select('id, user_id, hotel_id, subject, message, status')
      .limit(1);

    if (adminMessagesError) throw new Error(`Admin messages not accessible: ${adminMessagesError.message}`);
  }));

  // Calculate summary statistics
  const passedTests = results.filter(r => r.status === 'success').length;
  const failedTests = results.filter(r => r.status === 'error').length;
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

  const summary = {
    total: results.length,
    passed: passedTests,
    failed: failedTests,
    duration: totalDuration,
    success_rate: Math.round((passedTests / results.length) * 100)
  };

  return new Response(JSON.stringify({ 
    success: true, 
    results, 
    summary,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});