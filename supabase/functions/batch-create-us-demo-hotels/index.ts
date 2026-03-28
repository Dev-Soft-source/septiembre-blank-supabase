import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Hotel {
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  property_type: string;
  style: string;
  category: number;
  ideal_guests: string;
  atmosphere: string;
  perfect_location: string;
  room_description: string;
  weekly_laundry_included: boolean;
  external_laundry_available: boolean;
  stay_lengths: number[];
  meals_offered: string[];
  features_hotel: Record<string, boolean>;
  features_room: Record<string, boolean>;
  available_months: string[];
  main_image_url: string;
  price_per_month: number;
  terms: string;
  check_in_weekday: string;
  images: string[];
  themes: string[];
  activities: string[];
  packages: Array<{
    start_date: string;
    end_date: string;
    duration_days: number;
    total_rooms: number;
    available_rooms: number;
  }>;
}

const demoHotels: Hotel[] = [
  {
    name: "Coastal Breeze Inn",
    description: "A charming coastal retreat offering stunning ocean views and peaceful accommodations just steps from the beach.",
    country: "USA",
    city: "Carmel-by-the-Sea",
    address: "4th Avenue & Torres Street",
    postal_code: "93921",
    contact_name: "Sarah Williams",
    contact_email: "info@coastalbreezeinn.com",
    contact_phone: "+1-831-555-0125",
    property_type: "Boutique Hotel",
    style: "Classic",
    category: 3,
    ideal_guests: "Couples seeking romantic getaways and solo travelers looking for coastal tranquility",
    atmosphere: "Relaxed and intimate with ocean-inspired decor and calming coastal ambiance",
    perfect_location: "Perfect for beach lovers, artists, and those seeking a peaceful retreat from city life",
    room_description: "Comfortable oceanview rooms with coastal decor, private balconies, and modern amenities",
    weekly_laundry_included: false,
    external_laundry_available: true,
    stay_lengths: [8, 15],
    meals_offered: ["Continental Breakfast"],
    features_hotel: {
      "Ocean View": true,
      "Beach Access": true,
      "WiFi": true,
      "Parking": true,
      "Garden": true
    },
    features_room: {
      "Private Bathroom": true,
      "Balcony": true,
      "Ocean View": true,
      "Air Conditioning": true,
      "Coffee Maker": true
    },
    available_months: ["2024-03", "2024-04", "2024-05", "2024-06", "2024-09", "2024-10"],
    main_image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    price_per_month: 2295,
    terms: "Quiet hours 10 PM - 8 AM. No smoking. Pets welcome with additional fee.",
    check_in_weekday: "Monday",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
    ],
    themes: ["Beach", "Relaxation", "Romantic"],
    activities: ["Beach Activities", "Walking", "Photography"],
    packages: [
      {
        start_date: "2024-03-01",
        end_date: "2024-03-08",
        duration_days: 8,
        total_rooms: 12,
        available_rooms: 3
      },
      {
        start_date: "2024-04-15",
        end_date: "2024-04-29",
        duration_days: 15,
        total_rooms: 12,
        available_rooms: 4
      }
    ]
  },
  {
    name: "Mountain View Lodge",
    description: "A rustic mountain retreat surrounded by pristine wilderness and hiking trails, perfect for nature enthusiasts.",
    country: "USA",
    city: "Estes Park",
    address: "1520 Fall River Road",
    postal_code: "80517",
    contact_name: "Robert Johnson",
    contact_email: "reservations@mountainviewlodge.com",
    contact_phone: "+1-970-555-0198",
    property_type: "Lodge",
    style: "Rural",
    category: 3,
    ideal_guests: "Nature lovers, hikers, and families seeking outdoor adventures",
    atmosphere: "Rustic and cozy with mountain lodge charm and wildlife viewing opportunities",
    perfect_location: "Ideal for accessing Rocky Mountain National Park and outdoor activities",
    room_description: "Comfortable lodge rooms with mountain views, rustic decor, and modern conveniences",
    weekly_laundry_included: true,
    external_laundry_available: true,
    stay_lengths: [15, 22],
    meals_offered: ["Continental Breakfast", "Packed Lunches"],
    features_hotel: {
      "Mountain View": true,
      "Hiking Trails": true,
      "WiFi": true,
      "Parking": true,
      "Fireplace": true,
      "Pet Friendly": true
    },
    features_room: {
      "Private Bathroom": true,
      "Mountain View": true,
      "Heating": true,
      "Coffee Maker": true,
      "Mini Fridge": true
    },
    available_months: ["2024-05", "2024-06", "2024-07", "2024-08", "2024-09"],
    main_image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    price_per_month: 3225,
    terms: "No smoking. Pets welcome. Quiet hours after 10 PM. Mountain safety guidelines apply.",
    check_in_weekday: "Sunday",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    themes: ["Mountain", "Adventure", "Nature"],
    activities: ["Hiking", "Wildlife Watching", "Photography"],
    packages: [
      {
        start_date: "2024-06-01",
        end_date: "2024-06-15",
        duration_days: 15,
        total_rooms: 18,
        available_rooms: 5
      },
      {
        start_date: "2024-07-10",
        end_date: "2024-07-31",
        duration_days: 22,
        total_rooms: 18,
        available_rooms: 3
      }
    ]
  },
  {
    name: "Historic Charleston Inn",
    description: "An elegant boutique inn in Charleston's historic district, featuring antebellum architecture and Southern hospitality.",
    country: "USA",
    city: "Charleston",
    address: "58 Meeting Street",
    postal_code: "29401",
    contact_name: "Margaret Thompson",
    contact_email: "stay@historiccharlestoninn.com",
    contact_phone: "+1-843-555-0167",
    property_type: "Boutique Hotel",
    style: "Classic Elegant",
    category: 4,
    ideal_guests: "History enthusiasts, couples, and cultural travelers seeking Southern charm",
    atmosphere: "Sophisticated and historic with antebellum elegance and modern luxury",
    perfect_location: "Perfect for exploring Charleston's historic district, gardens, and cultural attractions",
    room_description: "Elegant rooms with period furnishings, high ceilings, and modern amenities in historic setting",
    weekly_laundry_included: true,
    external_laundry_available: true,
    stay_lengths: [22, 29],
    meals_offered: ["Continental Breakfast", "Afternoon Tea"],
    features_hotel: {
      "Historic Building": true,
      "Garden Courtyard": true,
      "WiFi": true,
      "Concierge": true,
      "Valet Parking": true
    },
    features_room: {
      "Private Bathroom": true,
      "High Ceilings": true,
      "Air Conditioning": true,
      "Historic Details": true,
      "Coffee Maker": true
    },
    available_months: ["2024-03", "2024-04", "2024-10", "2024-11"],
    main_image_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    price_per_month: 4575,
    terms: "Historic property guidelines apply. No smoking. Adults preferred. Valet parking required.",
    check_in_weekday: "Monday",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
    ],
    themes: ["Historic", "Cultural", "Luxury"],
    activities: ["Cultural Tours", "Walking", "Photography"],
    packages: [
      {
        start_date: "2024-04-05",
        end_date: "2024-04-26",
        duration_days: 22,
        total_rooms: 24,
        available_rooms: 4
      },
      {
        start_date: "2024-10-15",
        end_date: "2024-11-12",
        duration_days: 29,
        total_rooms: 24,
        available_rooms: 2
      }
    ]
  },
  {
    name: "Desert Oasis Hotel",
    description: "A modern desert retreat offering spectacular views of red rock formations and starlit skies.",
    country: "USA",
    city: "Sedona",
    address: "2250 West Highway 89A",
    postal_code: "86336",
    contact_name: "David Martinez",
    contact_email: "reservations@desertoasishotel.com",
    contact_phone: "+1-928-555-0143",
    property_type: "Resort Hotel",
    style: "Modern",
    category: 4,
    ideal_guests: "Spiritual seekers, artists, and wellness enthusiasts drawn to Sedona's energy",
    atmosphere: "Serene and mystical with desert-inspired design and panoramic red rock views",
    perfect_location: "Ideal for accessing vortex sites, art galleries, and desert hiking trails",
    room_description: "Contemporary rooms with desert views, spa-inspired bathrooms, and peaceful ambiance",
    weekly_laundry_included: true,
    external_laundry_available: true,
    stay_lengths: [15, 22],
    meals_offered: ["Continental Breakfast", "Wellness Menu"],
    features_hotel: {
      "Red Rock Views": true,
      "Spa Services": true,
      "Pool": true,
      "WiFi": true,
      "Meditation Garden": true
    },
    features_room: {
      "Private Bathroom": true,
      "Desert View": true,
      "Air Conditioning": true,
      "Mini Fridge": true,
      "Coffee Maker": true
    },
    available_months: ["2024-03", "2024-04", "2024-05", "2024-09", "2024-10", "2024-11"],
    main_image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    price_per_month: 3825,
    terms: "Wellness retreat guidelines. No smoking. Quiet meditation hours. Desert safety protocols.",
    check_in_weekday: "Sunday",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    ],
    themes: ["Desert", "Wellness", "Spiritual"],
    activities: ["Meditation", "Hiking", "Yoga"],
    packages: [
      {
        start_date: "2024-04-20",
        end_date: "2024-05-04",
        duration_days: 15,
        total_rooms: 32,
        available_rooms: 5
      },
      {
        start_date: "2024-09-15",
        end_date: "2024-10-06",
        duration_days: 22,
        total_rooms: 32,
        available_rooms: 3
      }
    ]
  },
  {
    name: "Lakeside Retreat",
    description: "A peaceful lakefront property offering water activities and serene forest surroundings in the heart of Minnesota's lake country.",
    country: "USA",
    city: "Grand Rapids",
    address: "1847 Golf Course Road",
    postal_code: "55744",
    contact_name: "Jennifer Anderson",
    contact_email: "info@lakesideretreat.com",
    contact_phone: "+1-218-555-0189",
    property_type: "Lodge",
    style: "Rural",
    category: 3,
    ideal_guests: "Families, fishing enthusiasts, and nature lovers seeking lakefront tranquility",
    atmosphere: "Relaxed and family-friendly with rustic charm and lakefront access",
    perfect_location: "Perfect for fishing, water sports, and exploring Minnesota's pristine lake region",
    room_description: "Comfortable lakefront rooms with rustic decor, lake views, and cozy furnishings",
    weekly_laundry_included: false,
    external_laundry_available: true,
    stay_lengths: [8, 15],
    meals_offered: ["Continental Breakfast"],
    features_hotel: {
      "Lakefront": true,
      "Boat Rental": true,
      "Fishing": true,
      "WiFi": true,
      "Parking": true,
      "Fire Pit": true
    },
    features_room: {
      "Private Bathroom": true,
      "Lake View": true,
      "Heating": true,
      "Coffee Maker": true,
      "Mini Fridge": true
    },
    available_months: ["2024-05", "2024-06", "2024-07", "2024-08", "2024-09"],
    main_image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    price_per_month: 1875,
    terms: "Lake safety rules apply. No smoking. Pet-friendly with restrictions. Fishing license required.",
    check_in_weekday: "Saturday",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
    ],
    themes: ["Lake", "Nature", "Family"],
    activities: ["Fishing", "Boating", "Swimming"],
    packages: [
      {
        start_date: "2024-06-15",
        end_date: "2024-06-22",
        duration_days: 8,
        total_rooms: 16,
        available_rooms: 4
      },
      {
        start_date: "2024-07-20",
        end_date: "2024-08-03",
        duration_days: 15,
        total_rooms: 16,
        available_rooms: 2
      }
    ]
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting batch hotel creation...')

    // Get themes and activities for mapping
    const { data: themes } = await supabaseClient.from('themes').select('id, name')
    const { data: activities } = await supabaseClient.from('activities').select('id, name')

    const themeMap = new Map(themes?.map(t => [t.name, t.id]) || [])
    const activityMap = new Map(activities?.map(a => [a.name, a.id]) || [])

    // Use existing user as owner (from current session or create a demo user)
    const { data: { user } } = await supabaseClient.auth.getUser()
    let ownerId = user?.id

    // If no user, create a demo owner ID that we'll use
    if (!ownerId) {
      ownerId = '00000000-0000-0000-0000-000000000001' // Demo owner ID
    }

    let hotelCount = 0

    for (const hotel of demoHotels) {
      try {
        console.log(`Creating hotel: ${hotel.name}`)

        // Insert hotel
        const { data: hotelData, error: hotelError } = await supabaseClient
          .from('hotels')
          .insert({
            owner_id: ownerId,
            name: hotel.name,
            description: hotel.description,
            country: hotel.country,
            city: hotel.city,
            address: hotel.address,
            postal_code: hotel.postal_code,
            contact_name: hotel.contact_name,
            contact_email: hotel.contact_email,
            contact_phone: hotel.contact_phone,
            property_type: hotel.property_type,
            style: hotel.style,
            category: hotel.category,
            ideal_guests: hotel.ideal_guests,
            atmosphere: hotel.atmosphere,
            perfect_location: hotel.perfect_location,
            room_description: hotel.room_description,
            weekly_laundry_included: hotel.weekly_laundry_included,
            external_laundry_available: hotel.external_laundry_available,
            stay_lengths: hotel.stay_lengths,
            meals_offered: hotel.meals_offered,
            features_hotel: hotel.features_hotel,
            features_room: hotel.features_room,
            available_months: hotel.available_months,
            main_image_url: hotel.main_image_url,
            price_per_month: hotel.price_per_month,
            terms: hotel.terms,
            check_in_weekday: hotel.check_in_weekday,
            status: 'approved' // Auto-approve demo hotels
          })
          .select()
          .single()

        if (hotelError) {
          console.error(`Error creating hotel ${hotel.name}:`, hotelError)
          continue
        }

        const hotelId = hotelData.id

        // Insert hotel images
        for (const imageUrl of hotel.images) {
          await supabaseClient
            .from('hotel_images')
            .insert({
              hotel_id: hotelId,
              image_url: imageUrl,
              is_main: imageUrl === hotel.main_image_url
            })
        }

        // Insert hotel themes
        for (const themeName of hotel.themes) {
          const themeId = themeMap.get(themeName)
          if (themeId) {
            await supabaseClient
              .from('hotel_themes')
              .insert({
                hotel_id: hotelId,
                theme_id: themeId
              })
          }
        }

        // Insert hotel activities
        for (const activityName of hotel.activities) {
          const activityId = activityMap.get(activityName)
          if (activityId) {
            await supabaseClient
              .from('hotel_activities')
              .insert({
                hotel_id: hotelId,
                activity_id: activityId
              })
          }
        }

        // Insert availability packages
        for (const pkg of hotel.packages) {
          await supabaseClient
            .from('availability_packages')
            .insert({
              hotel_id: hotelId,
              start_date: pkg.start_date,
              end_date: pkg.end_date,
              duration_days: pkg.duration_days,
              total_rooms: pkg.total_rooms,
              available_rooms: pkg.available_rooms
            })
        }

        // Create translations for all languages
        const languages = [
          { code: 'es', name: 'Spanish' },
          { code: 'en', name: 'English' },
          { code: 'pt', name: 'Portuguese' },
          { code: 'ro', name: 'Romanian' }
        ]

        for (const lang of languages) {
          let translatedName = hotel.name
          let translatedDescription = hotel.description
          let translatedIdealGuests = hotel.ideal_guests
          let translatedAtmosphere = hotel.atmosphere
          let translatedPerfectLocation = hotel.perfect_location

          // Basic translations for demo purposes
          if (lang.code !== 'en') {
            // Simple translation examples - in production use proper translation service
            if (lang.code === 'es') {
              translatedDescription = `Un encantador retiro ${hotel.description.toLowerCase()}`
              translatedIdealGuests = `Viajeros y huéspedes ideales ${hotel.ideal_guests.toLowerCase()}`
              translatedAtmosphere = `Ambiente y atmósfera ${hotel.atmosphere.toLowerCase()}`
              translatedPerfectLocation = `Ubicación perfecta ${hotel.perfect_location.toLowerCase()}`
            } else if (lang.code === 'pt') {
              translatedDescription = `Um retiro encantador ${hotel.description.toLowerCase()}`
              translatedIdealGuests = `Viajantes e hóspedes ideais ${hotel.ideal_guests.toLowerCase()}`
              translatedAtmosphere = `Ambiente e atmosfera ${hotel.atmosphere.toLowerCase()}`
              translatedPerfectLocation = `Localização perfeita ${hotel.perfect_location.toLowerCase()}`
            } else if (lang.code === 'ro') {
              translatedDescription = `O retragere fermecătoare ${hotel.description.toLowerCase()}`
              translatedIdealGuests = `Călători și oaspeți ideali ${hotel.ideal_guests.toLowerCase()}`
              translatedAtmosphere = `Ambianță și atmosferă ${hotel.atmosphere.toLowerCase()}`
              translatedPerfectLocation = `Locație perfectă ${hotel.perfect_location.toLowerCase()}`
            }
          }

          await supabaseClient
            .from('hotel_translations')
            .insert({
              hotel_id: hotelId,
              language_code: lang.code,
              translated_name: translatedName,
              translated_description: translatedDescription,
              translated_ideal_guests: translatedIdealGuests,
              translated_atmosphere: translatedAtmosphere,
              translated_perfect_location: translatedPerfectLocation,
              translation_status: 'completed',
              auto_generated: true
            })
        }

        hotelCount++
        console.log(`Successfully created hotel ${hotelCount}: ${hotel.name}`)

      } catch (error) {
        console.error(`Error processing hotel ${hotel.name}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully created ${hotelCount} demo hotels`,
        hotelsCreated: hotelCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in batch hotel creation:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to create demo hotels',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})