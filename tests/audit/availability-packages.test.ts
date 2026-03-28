import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '@/integrations/supabase/client';

describe('Availability Packages Audit Test', () => {
  let testHotelId: string | null = null;
  let testUserId: string | null = null;
  let testPackageIds: string[] = [];

  beforeAll(async () => {
    // Create test user and hotel for package testing
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `audit-packages-${Date.now()}@example.com`,
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
        name: 'Package Test Hotel',
        country: 'Portugal',
        city: 'Lisbon',
        contact_email: 'packages@testhotel.com',
        contact_name: 'Package Tester',
        description: 'Test hotel for availability packages audit',
        total_rooms: 20,
        price_per_month: 1500,
        property_type: 'Hotel',
        style: 'Contemporary',
        category: 4
      },
      availability_packages: [],
      hotel_images: [],
      hotel_themes: ['City'],
      hotel_activities: ['Cultural Tours']
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

  it('should create availability packages with different durations', async () => {
    expect(testHotelId).toBeTruthy();

    const packages = [
      {
        hotel_id: testHotelId,
        start_date: '2024-03-01',
        end_date: '2024-03-08',
        duration_days: 8,
        total_rooms: 5,
        available_rooms: 5,
        occupancy_mode: 'double',
        base_price_usd: 800,
        current_price_usd: 800
      },
      {
        hotel_id: testHotelId,
        start_date: '2024-03-15',
        end_date: '2024-03-29',
        duration_days: 15,
        total_rooms: 8,
        available_rooms: 8,
        occupancy_mode: 'double',
        base_price_usd: 1200,
        current_price_usd: 1200
      },
      {
        hotel_id: testHotelId,
        start_date: '2024-04-01',
        end_date: '2024-04-22',
        duration_days: 22,
        total_rooms: 3,
        available_rooms: 3,
        occupancy_mode: 'single',
        base_price_usd: 1800,
        current_price_usd: 1800
      }
    ];

    for (const packageData of packages) {
      const { data, error } = await supabase
        .from('availability_packages')
        .insert(packageData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.id).toBeTruthy();
      expect(data.duration_days).toBe(packageData.duration_days);
      expect(data.hotel_id).toBe(testHotelId);

      testPackageIds.push(data.id);
    }

    expect(testPackageIds).toHaveLength(3);
    console.log('✅ Availability packages creation test passed - Package IDs:', testPackageIds);
  });

  it('should validate packages are correctly stored with all properties', async () => {
    expect(testPackageIds.length).toBe(3);

    const { data: storedPackages, error } = await supabase
      .from('availability_packages')
      .select('*')
      .in('id', testPackageIds)
      .order('start_date');

    expect(error).toBeNull();
    expect(storedPackages).toHaveLength(3);

    // Validate 8-day package
    const package8Days = storedPackages[0];
    expect(package8Days.duration_days).toBe(8);
    expect(package8Days.total_rooms).toBe(5);
    expect(package8Days.available_rooms).toBe(5);
    expect(package8Days.occupancy_mode).toBe('double');

    // Validate 15-day package
    const package15Days = storedPackages[1];
    expect(package15Days.duration_days).toBe(15);
    expect(package15Days.total_rooms).toBe(8);
    expect(package15Days.available_rooms).toBe(8);

    // Validate 22-day package
    const package22Days = storedPackages[2];
    expect(package22Days.duration_days).toBe(22);
    expect(package22Days.occupancy_mode).toBe('single');

    console.log('✅ Package storage validation test passed');
  });
});