import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { supabase } from '@/integrations/supabase/client';

describe('Hotel Creation Audit Test', () => {
  let testHotelId: string | null = null;
  let testUserId: string | null = null;

  beforeAll(async () => {
    // Create test user for hotel creation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `audit-hotel-${Date.now()}@example.com`,
      password: 'AuditTest123!',
      options: {
        data: {
          role: 'hotel'
        }
      }
    });

    if (authError) {
      console.error('Failed to create test user:', authError);
      throw authError;
    }

    testUserId = authData.user?.id || null;
  });

  afterAll(async () => {
    // Clean up test data
    if (testHotelId) {
      await supabase.from('hotels').delete().eq('id', testHotelId);
    }
    
    if (testUserId) {
      await supabase.from('profiles').delete().eq('id', testUserId);
    }
  });

  it('should create a hotel record successfully', async () => {
    expect(testUserId).toBeTruthy();

    const hotelData = {
      name: 'Audit Test Hotel',
      country: 'Spain',
      city: 'Barcelona', 
      contact_email: 'audit@testhotel.com',
      contact_name: 'Audit Tester',
      description: 'Test hotel for external audit validation',
      total_rooms: 10,
      price_per_month: 1200,
      property_type: 'Hotel',
      style: 'Modern',
      category: 3,
      status: 'pending'
    };

    // Call the hotel registration function
    const { data, error } = await supabase.rpc('submit_hotel_registration', {
      hotel_data: hotelData,
      availability_packages: [],
      hotel_images: [],
      hotel_themes: ['Beach', 'City'],
      hotel_activities: ['Swimming', 'Sightseeing']
    });

    expect(error).toBeNull();
    expect(data).toBeTruthy();
    expect(data.success).toBe(true);
    expect(data.hotel_id).toBeTruthy();

    testHotelId = data.hotel_id;

    // Verify hotel was created in database
    const { data: hotelRecord, error: fetchError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', testHotelId)
      .single();

    expect(fetchError).toBeNull();
    expect(hotelRecord).toBeTruthy();
    expect(hotelRecord.name).toBe(hotelData.name);
    expect(hotelRecord.country).toBe(hotelData.country);
    expect(hotelRecord.city).toBe(hotelData.city);
    expect(hotelRecord.status).toBe('pending');

    console.log('✅ Hotel creation test passed - Hotel ID:', testHotelId);
  });

  it('should validate hotel themes and activities were linked', async () => {
    expect(testHotelId).toBeTruthy();

    // Check hotel themes
    const { data: themes, error: themesError } = await supabase
      .from('hotel_themes')
      .select('*, themes(name)')
      .eq('hotel_id', testHotelId);

    expect(themesError).toBeNull();
    expect(themes).toHaveLength(2);

    // Check hotel activities
    const { data: activities, error: activitiesError } = await supabase
      .from('hotel_activities')
      .select('*, activities(name)')
      .eq('hotel_id', testHotelId);

    expect(activitiesError).toBeNull();
    expect(activities).toHaveLength(2);

    console.log('✅ Hotel themes and activities validation passed');
  });
});