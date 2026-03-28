import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas
const bookingCreationSchema = {
  package_id: { type: 'string', format: 'uuid' },
  user_email: { type: 'string', format: 'email' },
  guest_name: { type: 'string', minLength: 1, maxLength: 200 },
  guest_phone: { type: 'string', maxLength: 50 },
  check_in_date: { type: 'string', format: 'date-time' },
  check_out_date: { type: 'string', format: 'date-time' },
  total_price: { type: 'number', minimum: 0 },
  currency: { type: 'string', enum: ['USD', 'EUR', 'GBP'] }
};

function validateBookingData(data: any) {
  const errors: string[] = [];

  // Required fields
  if (!data.package_id) errors.push('package_id is required');
  if (!data.user_email) errors.push('user_email is required');
  if (!data.guest_name) errors.push('guest_name is required');
  if (!data.check_in_date) errors.push('check_in_date is required');
  if (!data.check_out_date) errors.push('check_out_date is required');
  if (data.total_price === undefined) errors.push('total_price is required');

  // Format validation
  if (data.package_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.package_id)) {
    errors.push('package_id must be a valid UUID');
  }

  if (data.user_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user_email)) {
    errors.push('user_email must be a valid email');
  }

  if (data.check_in_date && isNaN(Date.parse(data.check_in_date))) {
    errors.push('check_in_date must be a valid ISO date-time');
  }

  if (data.check_out_date && isNaN(Date.parse(data.check_out_date))) {
    errors.push('check_out_date must be a valid ISO date-time');
  }

  if (data.total_price !== undefined && (typeof data.total_price !== 'number' || data.total_price < 0)) {
    errors.push('total_price must be a positive number');
  }

  if (data.currency && !['USD', 'EUR', 'GBP'].includes(data.currency)) {
    errors.push('currency must be one of: USD, EUR, GBP');
  }

  return errors;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Content-Type
    const contentType = req.headers.get('Content-Type');
    if (contentType !== 'application/json') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_CONTENT_TYPE',
          message: 'Content-Type must be application/json'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await req.json();
    
    // Validate input
    const errors = validateBookingData(body);
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details: errors
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log successful validation
    console.log('✅ Validation passed for booking data:', body);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Validation passed',
        data: body
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Validation endpoint error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});