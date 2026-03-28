import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '@/integrations/supabase/client';

describe('Public Display Audit Test', () => {
  let testHotelId: string | null = null;
  let testUserId: string | null = null;
  let testPackageIds: string[] = [];

  beforeAll(async () => {
    // Create approved hotel for public display testing
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `audit-display-${Date.now()}@example.com`,
      password: 'AuditTest123!',
      options: {
        data: {
          role: 'hotel'
        }
      }
    });

    if (authError) throw authError;
    testUserId = authData.user?.id || null;

    // Create test hotel
    const { data: hotelData, error: hotelError } = await supabase.rpc('submit_hotel_registration', {
      hotel_data: {
        name: 'Display Test Hotel',
        country: 'Spain',
        city: 'Madrid',
        contact_email: 'display@testhotel.com',
        contact_name: 'Display Tester',
        description: 'Test hotel for public display validation',
        total_rooms: 25,
        price_per_month: 1800,
        property_type: 'Urban Hotel',
        style: 'Modern',
        category: 4,
        main_image_url: 'https://example.com/hotel-image.jpg'
      },
      availability_packages: [
        {
          start_date: '2024-06-01',
          end_date: '2024-06-08',
          duration_days: 8,
          total_rooms: 5,
          available_rooms: 5,
          base_price_usd: 1000,
          current_price_usd: 1000
        },
        {
          start_date: '2024-06-15',
          end_date: '2024-06-29',
          duration_days: 15,
          total_rooms: 8,
          available_rooms: 8,
          base_price_usd: 1500,
          current_price_usd: 1500
        }
      ],
      hotel_images: [],
      hotel_themes: ['Urban', 'Business'],
      hotel_activities: ['Shopping', 'Business Centers']
    });

    if (hotelError) throw hotelError;
    testHotelId = hotelData.hotel_id;

    // Approve hotel for public display (simulate admin approval)
    await supabase
      .from('hotels')
      .update({ status: 'approved' })
      .eq('id', testHotelId);
  });

  afterAll(async () => {
    // Clean up test data
    if (testPackageIds.length > 0) {
      await supabase.from('availability_packages').delete().in('id', testPackageIds);
    }
    if (testHotelId) {
      await supabase.from('hotels').delete().eq('id', testHotelId);
    }
    if (testUserId) {
      await supabase.from('profiles').delete().eq('id', testUserId);
    }
  });

  it('should display approved hotel in public views', async () => {
    expect(testHotelId).toBeTruthy();

    // Test hotel appears in public hotels view
    const { data: publicHotel, error: publicError } = await supabase
      .from('hotels_public_view')
      .select('*')
      .eq('id', testHotelId)
      .single();

    expect(publicError).toBeNull();
    expect(publicHotel).toBeTruthy();
    expect(publicHotel.name).toBe('Display Test Hotel');
    expect(publicHotel.country).toBe('Spain');
    expect(publicHotel.city).toBe('Madrid');
    expect(publicHotel.status).toBe('approved');

    console.log('✅ Public hotel display test passed');
  });

  it('should display availability packages for approved hotel', async () => {
    expect(testHotelId).toBeTruthy();

    // Fetch packages for approved hotel
    const { data: publicPackages, error: packagesError } = await supabase
      .from('availability_packages_public_view')
      .select('*')
      .eq('hotel_id', testHotelId)
      .order('start_date');

    expect(packagesError).toBeNull();
    expect(publicPackages).toBeTruthy();
    expect(publicPackages.length).toBe(2);

    // Validate 8-day package
    const package8Days = publicPackages.find(p => p.duration_days === 8);
    expect(package8Days).toBeTruthy();
    expect(package8Days.total_rooms).toBe(5);
    expect(package8Days.available_rooms).toBe(5);
    expect(package8Days.current_price_usd).toBe(1000);

    // Validate 15-day package
    const package15Days = publicPackages.find(p => p.duration_days === 15);
    expect(package15Days).toBeTruthy();
    expect(package15Days.total_rooms).toBe(8);
    expect(package15Days.available_rooms).toBe(8);
    expect(package15Days.current_price_usd).toBe(1500);

    testPackageIds = publicPackages.map(p => p.id);

    console.log('✅ Public packages display test passed');
  });

  it('should validate hotel themes and activities are publicly accessible', async () => {
    expect(testHotelId).toBeTruthy();

    // Test public access to hotel themes
    const { data: themes, error: themesError } = await supabase
      .from('hotel_themes')
      .select(`
        *,
        themes(name, category)
      `)
      .eq('hotel_id', testHotelId);

    expect(themesError).toBeNull();
    expect(themes).toBeTruthy();
    expect(themes.length).toBe(2);

    // Test public access to hotel activities
    const { data: activities, error: activitiesError } = await supabase
      .from('hotel_activities')
      .select(`
        *,
        activities(name, category)
      `)
      .eq('hotel_id', testHotelId);

    expect(activitiesError).toBeNull();
    expect(activities).toBeTruthy();
    expect(activities.length).toBe(2);

    console.log('✅ Public themes and activities display test passed');
  });

  it('should validate package availability for booking simulation', async () => {
    expect(testPackageIds.length).toBe(2);

    // Test that packages show correct availability
    for (const packageId of testPackageIds) {
      const { data: packageData, error } = await supabase
        .from('availability_packages_public_view')
        .select('*')
        .eq('id', packageId)
        .single();

      expect(error).toBeNull();
      expect(packageData).toBeTruthy();
      expect(packageData.available_rooms).toBeGreaterThan(0);
      expect(packageData.current_price_usd).toBeGreaterThan(0);
      expect(packageData.start_date).toBeTruthy();
      expect(packageData.end_date).toBeTruthy();
    }

    console.log('✅ Package availability validation test passed');
  });

  it('should verify complete data flow from creation to public display', async () => {
    expect(testHotelId).toBeTruthy();

    // Comprehensive end-to-end validation
    const { data: completeHotel, error: hotelError } = await supabase
      .from('hotels_public_view')
      .select('*')
      .eq('id', testHotelId)
      .single();

    expect(hotelError).toBeNull();
    expect(completeHotel).toBeTruthy();

    const { data: completePackages, error: packagesError } = await supabase
      .from('availability_packages_public_view')
      .select('*')
      .eq('hotel_id', testHotelId);

    expect(packagesError).toBeNull();
    expect(completePackages).toBeTruthy();
    expect(completePackages.length).toBe(2);

    // Verify all required fields are present for public display
    expect(completeHotel.name).toBeTruthy();
    expect(completeHotel.country).toBeTruthy();
    expect(completeHotel.city).toBeTruthy();
    expect(completeHotel.description).toBeTruthy();
    expect(completeHotel.price_per_month).toBeGreaterThan(0);

    completePackages.forEach(package => {
      expect(package.start_date).toBeTruthy();
      expect(package.end_date).toBeTruthy();
      expect(package.duration_days).toBeGreaterThan(0);
      expect(package.available_rooms).toBeGreaterThanOrEqual(0);
      expect(package.current_price_usd).toBeGreaterThan(0);
    });

    console.log('✅ Complete data flow validation test passed');
    console.log(`🎯 End-to-end audit complete: Hotel ${testHotelId} with ${completePackages.length} packages successfully created and publicly displayed`);
  });
});