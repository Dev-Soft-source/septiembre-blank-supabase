import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CorrectionResult {
  hotelId: string;
  hotelName: string;
  correctedPackages: number;
  errors: string[];
  warnings: string[];
}

interface HotelData {
  id: string;
  name: string;
  category: number;
  meals_offered: string[];
}

interface PackageData {
  id: string;
  hotel_id: string;
  duration_days: number;
  occupancy_mode: string;
  current_price_usd: number;
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

    console.log('🚀 Starting Global Price Corrector...')

    // Sacred pricing policy - copied from utils
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
      'room_only': 0.40,      // 40% - minimum price (accommodation only)
      'breakfast': 0.60,      // 60% of max price range
      'half_board': 0.80,     // 80% of max price range  
      'full_board': 1.00,     // 100% - maximum price
      'all_inclusive': 1.00   // 100% - same as full board for now
    }

    // Helper functions
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
      
      // Calculate price based on percentage within the range
      const priceRange = range.max - range.min;
      const basePrice = range.min + (priceRange * (percentage - 0.40) / 0.60);
      
      return applyPriceRounding(basePrice);
    }

    function getDefaultMealPlan(hotelMeals: string[], hotelCategory: number): string {
      if (!hotelMeals || hotelMeals.length === 0) {
        // Default based on hotel category
        if (hotelCategory >= 5) return 'full_board';
        if (hotelCategory >= 4) return 'half_board';
        return 'breakfast';
      }
      
      // Check what meals are offered and pick the best one
      if (hotelMeals.includes('all_inclusive')) return 'all_inclusive';
      if (hotelMeals.includes('full_board')) return 'full_board';
      if (hotelMeals.includes('half_board')) return 'half_board';
      if (hotelMeals.includes('breakfast')) return 'breakfast';
      return 'room_only';
    }

    // Step 1: Get all hotels
    const { data: hotels, error: hotelsError } = await supabaseClient
      .from('hotels')
      .select('id, name, category, meals_offered')
      .eq('status', 'approved');

    if (hotelsError) {
      throw new Error(`Failed to fetch hotels: ${hotelsError.message}`);
    }

    console.log(`📊 Found ${hotels.length} approved hotels to process`);

    // Step 2: Get all availability packages
    const { data: packages, error: packagesError } = await supabaseClient
      .from('availability_packages')
      .select('id, hotel_id, duration_days, occupancy_mode, current_price_usd');

    if (packagesError) {
      throw new Error(`Failed to fetch packages: ${packagesError.message}`);
    }

    console.log(`📦 Found ${packages.length} availability packages to check`);

    const results: CorrectionResult[] = [];
    let totalCorrectedPackages = 0;

    // Step 3: Process each hotel
    for (const hotel of hotels as HotelData[]) {
      console.log(`🏨 Processing hotel: ${hotel.name} (${hotel.category}★)`);
      
      const hotelPackages = packages.filter(pkg => pkg.hotel_id === hotel.id) as PackageData[];
      const hotelResult: CorrectionResult = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        correctedPackages: 0,
        errors: [],
        warnings: []
      };

      // PHASE 1: CREATE MISSING PACKAGES FOR HOTELS WITH NO PACKAGES
      if (hotelPackages.length === 0) {
        console.log(`🔧 Creating missing packages for hotel: ${hotel.name}`);
        
        // Create all 4 required durations (8, 15, 22, 29 days)
        const requiredDurations = [8, 15, 22, 29];
        const defaultMealPlan = getDefaultMealPlan(hotel.meals_offered || [], hotel.category || 3);
        let packagesCreated = 0;
        
        // Generate packages for both double and single occupancy
        for (const duration of requiredDurations) {
          for (const occupancy of ['double', 'single']) {
            try {
              const price = calculateMealPlanPrice(
                hotel.category || 3,
                duration,
                occupancy,
                defaultMealPlan
              );
              
              // Create start date (2 months from now)
              const startDate = new Date();
              startDate.setMonth(startDate.getMonth() + 2);
              startDate.setDate(1); // First of month
              
              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + duration - 1);
              
              // Insert new package
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
                hotelResult.errors.push(`Failed to create ${duration}-day ${occupancy} package: ${insertError.message}`);
              } else {
                packagesCreated++;
                hotelResult.warnings.push(`Created ${duration}-day ${occupancy} package: $${price}`);
              }
            } catch (error) {
              hotelResult.errors.push(`Error creating ${duration}-day ${occupancy} package: ${error.message}`);
            }
          }
        }
        
        hotelResult.correctedPackages = packagesCreated;
        results.push(hotelResult);
        console.log(`✅ Created ${packagesCreated} packages for ${hotel.name}`);
        continue;
      }

      // Get default meal plan for this hotel
      const defaultMealPlan = getDefaultMealPlan(hotel.meals_offered || [], hotel.category || 3);
      console.log(`🍽️ Using meal plan: ${defaultMealPlan} for hotel ${hotel.name}`);

      // Step 4: Process each package
      for (const pkg of hotelPackages) {
        try {
          // Calculate correct price
          const occupancy = pkg.occupancy_mode === 'single' ? 'single' : 'double';
          const correctPrice = calculateMealPlanPrice(
            hotel.category || 3,
            pkg.duration_days,
            occupancy,
            defaultMealPlan
          );

          // Check if correction is needed
          if (Math.abs(pkg.current_price_usd - correctPrice) > 1) { // Allow 1 USD tolerance
            console.log(`💰 Correcting package ${pkg.id}: ${pkg.current_price_usd} → ${correctPrice}`);
            
            // Update the package
            const { error: updateError } = await supabaseClient
              .from('availability_packages')
              .update({
                current_price_usd: correctPrice,
                base_price_usd: correctPrice,
                updated_at: new Date().toISOString()
              })
              .eq('id', pkg.id);

            if (updateError) {
              hotelResult.errors.push(`Failed to update package ${pkg.id}: ${updateError.message}`);
            } else {
              hotelResult.correctedPackages++;
              totalCorrectedPackages++;
              hotelResult.warnings.push(`Package ${pkg.duration_days} days (${occupancy}): ${pkg.current_price_usd} → ${correctPrice}`);
            }
          }
        } catch (error) {
          hotelResult.errors.push(`Error processing package ${pkg.id}: ${error.message}`);
        }
      }

      results.push(hotelResult);
    }

    console.log(`✅ Global Price Corrector completed!`);
    console.log(`📊 Total packages corrected: ${totalCorrectedPackages}`);
    console.log(`🏨 Hotels processed: ${hotels.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Global price correction completed',
        summary: {
          hotelsProcessed: hotels.length,
          packagesChecked: packages.length,
          packagesCorrected: totalCorrectedPackages,
        },
        results: results,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Global Price Corrector Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})