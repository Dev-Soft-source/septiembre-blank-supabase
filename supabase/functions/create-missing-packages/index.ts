import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HotelData {
  id: string;
  name: string;
  category: number;
  meals_offered: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('🚀 Creating missing packages for all hotels...')

    // Sacred pricing policy
    const SACRED_PRICING_POLICY = {
      "3": {
        8: { double: { min: 120, max: 300 }, individual: { min: 160, max: 400 } },
        15: { double: { min: 220, max: 550 }, individual: { min: 300, max: 745 } },
        22: { double: { min: 320, max: 800 }, individual: { min: 430, max: 1080 } },
        29: { double: { min: 400, max: 1000 }, individual: { min: 540, max: 1350 } }
      },
      "4": {
        8: { double: { min: 170, max: 425 }, individual: { min: 230, max: 575 } },
        15: { double: { min: 320, max: 800 }, individual: { min: 430, max: 1100 } },
        22: { double: { min: 480, max: 1200 }, individual: { min: 650, max: 1625 } },
        29: { double: { min: 640, max: 1600 }, individual: { min: 865, max: 2175 } }
      },
      "5": {
        8: { double: { min: 240, max: 600 }, individual: { min: 325, max: 800 } },
        15: { double: { min: 440, max: 1100 }, individual: { min: 595, max: 1500 } },
        22: { double: { min: 640, max: 1600 }, individual: { min: 865, max: 2160 } },
        29: { double: { min: 1360, max: 3400 }, individual: { min: 1860, max: 3100 } }
      }
    }

    const MEAL_PLAN_PERCENTAGES = {
      'room_only': 0.40,
      'breakfast': 0.60,
      'half_board': 0.80,
      'full_board': 1.00,
      'all_inclusive': 1.00
    }

    function applyPriceRounding(price: number): number {
      const rounded = Math.round(price);
      const lastDigit = rounded % 10;
      
      if ([0, 5, 9].includes(lastDigit)) {
        return rounded;
      }
      
      if (lastDigit <= 2) {
        return rounded - lastDigit;
      } else if (lastDigit <= 6) {
        return rounded + (5 - lastDigit);
      } else {
        return rounded + (9 - lastDigit);
      }
    }

    function calculateMealPlanPrice(stars: number, duration: number, occupancy: string, mealPlan: string): number {
      const hotelCategory = stars >= 5 ? "5" : stars >= 4 ? "4" : "3";
      const durationKey = duration as keyof typeof SACRED_PRICING_POLICY["3"];
      const occupancyKey = occupancy === 'single' ? 'individual' : 'double';
      
      const range = SACRED_PRICING_POLICY[hotelCategory as keyof typeof SACRED_PRICING_POLICY][durationKey][occupancyKey as keyof typeof SACRED_PRICING_POLICY["3"][8]];
      const percentage = MEAL_PLAN_PERCENTAGES[mealPlan as keyof typeof MEAL_PLAN_PERCENTAGES] || 0.80;
      
      const priceRange = range.max - range.min;
      const basePrice = range.min + (priceRange * (percentage - 0.40) / 0.60);
      
      return applyPriceRounding(basePrice);
    }

    function getDefaultMealPlan(hotelMeals: string[], hotelCategory: number): string {
      if (!hotelMeals || hotelMeals.length === 0) {
        if (hotelCategory >= 5) return 'full_board';
        if (hotelCategory >= 4) return 'half_board';
        return 'breakfast';
      }
      
      if (hotelMeals.includes('all_inclusive')) return 'all_inclusive';
      if (hotelMeals.includes('full_board')) return 'full_board';
      if (hotelMeals.includes('half_board')) return 'half_board';
      if (hotelMeals.includes('breakfast')) return 'breakfast';
      return 'room_only';
    }

    // Get all approved hotels
    const { data: hotels, error: hotelsError } = await supabaseClient
      .from('hotels')
      .select('id, name, category, meals_offered')
      .eq('status', 'approved');

    if (hotelsError) {
      throw new Error(`Failed to fetch hotels: ${hotelsError.message}`);
    }

    console.log(`📊 Found ${hotels.length} approved hotels to process`);

    // Get current packages to find hotels without packages
    const { data: existingPackages, error: packagesError } = await supabaseClient
      .from('availability_packages')
      .select('hotel_id');

    if (packagesError) {
      throw new Error(`Failed to fetch existing packages: ${packagesError.message}`);
    }

    // Find hotels with no packages
    const hotelsWithPackages = new Set(existingPackages.map(pkg => pkg.hotel_id));
    const hotelsWithoutPackages = hotels.filter(hotel => !hotelsWithPackages.has(hotel.id)) as HotelData[];

    console.log(`🏨 Found ${hotelsWithoutPackages.length} hotels without packages`);

    const results: Array<{
      hotelId: string;
      hotelName: string;
      packagesCreated: number;
      errors: string[];
    }> = [];

    let totalPackagesCreated = 0;

    // Create packages for hotels without any
    for (const hotel of hotelsWithoutPackages) {
      console.log(`🔧 Creating packages for: ${hotel.name} (${hotel.category}★)`);
      
      const hotelResult = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        packagesCreated: 0,
        errors: []
      };

      const requiredDurations = [8, 15, 22, 29];
      const defaultMealPlan = getDefaultMealPlan(hotel.meals_offered || [], hotel.category || 3);
      
      console.log(`🍽️ Using meal plan: ${defaultMealPlan} for hotel ${hotel.name}`);

      // Create packages for each duration and occupancy
      for (const duration of requiredDurations) {
        for (const occupancy of ['double', 'single']) {
          try {
            const price = calculateMealPlanPrice(
              hotel.category || 3,
              duration,
              occupancy,
              defaultMealPlan
            );

            // Create start date (2 months from now, staggered by duration)
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() + 2);
            startDate.setDate(1);
            
            // Stagger packages by duration to avoid overlap
            if (duration === 15) startDate.setMonth(startDate.getMonth() + 1);
            if (duration === 22) startDate.setMonth(startDate.getMonth() + 2);
            if (duration === 29) startDate.setMonth(startDate.getMonth() + 3);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + duration - 1);

            const { error: insertError } = await supabaseClient
              .from('availability_packages')
              .insert({
                hotel_id: hotel.id,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                duration_days: duration,
                total_rooms: 10,
                available_rooms: 8,
                room_type: occupancy === 'double' ? 'Double Room' : 'Single Room',
                occupancy_mode: occupancy,
                base_price_usd: price,
                current_price_usd: price
              });

            if (insertError) {
              hotelResult.errors.push(`Failed to create ${duration}-day ${occupancy}: ${insertError.message}`);
            } else {
              hotelResult.packagesCreated++;
              totalPackagesCreated++;
              console.log(`✅ Created ${duration}-day ${occupancy} package: $${price}`);
            }
          } catch (error) {
            hotelResult.errors.push(`Error creating ${duration}-day ${occupancy}: ${error.message}`);
          }
        }
      }

      results.push(hotelResult);
      console.log(`✅ Hotel ${hotel.name}: Created ${hotelResult.packagesCreated} packages`);
    }

    console.log(`🎉 Package creation completed!`);
    console.log(`📊 Total packages created: ${totalPackagesCreated}`);
    console.log(`🏨 Hotels processed: ${hotelsWithoutPackages.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Missing packages created successfully',
        summary: {
          hotelsProcessed: hotelsWithoutPackages.length,
          packagesCreated: totalPackagesCreated,
          hotelsSkipped: hotels.length - hotelsWithoutPackages.length
        },
        results: results,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Package Creation Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})