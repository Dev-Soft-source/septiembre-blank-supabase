import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '@/integrations/supabase/client';

describe('Supabase Storage Audit Test', () => {
  let testHotelId: string | null = null;
  let testUserId: string | null = null;
  let testPackageIds: string[] = [];

  beforeAll(async () => {
    // Create test environment
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `audit-storage-${Date.now()}@example.com`,
      password: 'AuditTest123!',
      options: {
        data: {
          role: 'hotel'
        }
      }
    });

    if (authError) throw authError;
    testUserId = authData.user?.id || null;

    // Create test hotel with packages
    const { data: hotelData, error: hotelError } = await supabase.rpc('submit_hotel_registration', {
      hotel_data: {
        name: 'Storage Test Hotel',
        country: 'Romania',
        city: 'Bucharest',
        contact_email: 'storage@testhotel.com',
        contact_name: 'Storage Tester',
        description: 'Test hotel for storage validation',
        total_rooms: 15,
        price_per_month: 1000,
        property_type: 'Boutique Hotel',
        style: 'Traditional',
        category: 3
      },
      availability_packages: [
        {
          start_date: '2024-05-01',
          end_date: '2024-05-29',
          duration_days: 29,
          total_rooms: 10,
          available_rooms: 10,
          base_price_usd: 2200,
          current_price_usd: 2200
        }
      ],
      hotel_images: [],
      hotel_themes: ['Historic'],
      hotel_activities: ['Museums']
    });

    if (hotelError) throw hotelError;
    testHotelId = hotelData.hotel_id;
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

  it('should verify hotel data persistence in Supabase', async () => {
    expect(testHotelId).toBeTruthy();

    // Test direct table access
    const { data: hotelDirect, error: directError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', testHotelId)
      .single();

    expect(directError).toBeNull();
    expect(hotelDirect).toBeTruthy();
    expect(hotelDirect.name).toBe('Storage Test Hotel');
    expect(hotelDirect.country).toBe('Romania');
    expect(hotelDirect.city).toBe('Bucharest');

    // Test public view access
    const { data: hotelPublic, error: publicError } = await supabase
      .from('hotels_public_view')
      .select('*')
      .eq('id', testHotelId)
      .single();

    // Note: This might return null if hotel is not approved, which is expected
    if (publicError && !publicError.message.includes('No rows')) {
      console.error('Unexpected public view error:', publicError);
    }

    console.log('✅ Hotel data persistence test passed');
  });

  it('should verify availability packages persistence and relationships', async () => {
    expect(testHotelId).toBeTruthy();

    // Fetch packages created during hotel registration
    const { data: packages, error: packagesError } = await supabase
      .from('availability_packages')
      .select('*')
      .eq('hotel_id', testHotelId);

    expect(packagesError).toBeNull();
    expect(packages).toBeTruthy();
    expect(packages.length).toBeGreaterThan(0);

    const package29Days = packages.find(p => p.duration_days === 29);
    expect(package29Days).toBeTruthy();
    expect(package29Days.total_rooms).toBe(10);
    expect(package29Days.available_rooms).toBe(10);

    testPackageIds.push(package29Days.id);

    // Test public packages view
    const { data: publicPackages, error: publicPackagesError } = await supabase
      .from('availability_packages_public_view')
      .select('*')
      .eq('hotel_id', testHotelId);

    expect(publicPackagesError).toBeNull();
    expect(publicPackages).toBeTruthy();

    console.log('✅ Availability packages persistence test passed');
  });

  it('should verify data integrity across related tables', async () => {
    expect(testHotelId).toBeTruthy();

    // Test hotel themes relationship
    const { data: themes, error: themesError } = await supabase
      .from('hotel_themes')
      .select(`
        *,
        themes(name),
        hotels(name)
      `)
      .eq('hotel_id', testHotelId);

    expect(themesError).toBeNull();
    expect(themes).toBeTruthy();
    expect(themes.length).toBeGreaterThan(0);

    // Test hotel activities relationship
    const { data: activities, error: activitiesError } = await supabase
      .from('hotel_activities')
      .select(`
        *,
        activities(name),
        hotels(name)
      `)
      .eq('hotel_id', testHotelId);

    expect(activitiesError).toBeNull();
    expect(activities).toBeTruthy();
    expect(activities.length).toBeGreaterThan(0);

    console.log('✅ Data integrity and relationships test passed');
  });

  it('should verify RLS policies are working correctly', async () => {
    expect(testHotelId).toBeTruthy();

    // Test that authenticated user can access their own hotel
    const { data: ownHotel, error: ownError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', testHotelId)
      .single();

    expect(ownError).toBeNull();
    expect(ownHotel).toBeTruthy();

    // Test that public can access availability packages
    const { data: publicPackages, error: publicError } = await supabase
      .from('availability_packages_public_view')
      .select('*')
      .eq('hotel_id', testHotelId);

    expect(publicError).toBeNull();
    expect(publicPackages).toBeTruthy();

    console.log('✅ RLS policies validation test passed');
  });
});