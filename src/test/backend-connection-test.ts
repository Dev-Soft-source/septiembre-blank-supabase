/**
 * Backend Connection Test Suite
 * Tests the frontend-backend connection without modifying backend
 */

import { queryHotelsWithBackendAdapter, queryHotelDetailWithBackendAdapter } from "@/adapters/query-adapter";
import { FilterState } from "@/components/filters/FilterTypes";

// Test basic hotel query
export async function testBasicHotelQuery() {
  console.log("🧪 Testing basic hotel query...");
  
  try {
    const { data, error } = await queryHotelsWithBackendAdapter({});
    
    if (error) {
      console.error("❌ Basic query failed:", error);
      return { success: false, error };
    }
    
    console.log("✅ Basic query successful:", {
      hotelsFound: data.length,
      sampleHotel: data[0] ? {
        id: data[0].id,
        name: data[0].name,
        location: data[0].location
      } : null
    });
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Basic query error:", err);
    return { success: false, error: err };
  }
}

// Test filter queries
export async function testFilterQueries() {
  console.log("🧪 Testing filter queries...");
  
  const testFilters: FilterState[] = [
    // Test location filter
    { location: "Mexico" },
    // Test price filter
    { minPrice: 1000, maxPrice: 2000 },
    // Test theme filter
    { theme: [{ id: "wellness", name: "Wellness", level: 1, category: "AFFINITY" }] },
    // Test hotel features
    { hotelFeatures: ["wifi", "pool"] },
    // Test room features  
    { roomFeatures: ["balcony", "kitchen"] }
  ];
  
  const results = [];
  
  for (const filters of testFilters) {
    try {
      console.log("🔍 Testing filters:", filters);
      const { data, error } = await queryHotelsWithBackendAdapter(filters);
      
      if (error) {
        console.error("❌ Filter query failed:", filters, error);
        results.push({ filters, success: false, error });
      } else {
        console.log("✅ Filter query successful:", {
          filters,
          hotelsFound: data.length
        });
        results.push({ filters, success: true, count: data.length });
      }
    } catch (err) {
      console.error("❌ Filter query error:", filters, err);
      results.push({ filters, success: false, error: err });
    }
  }
  
  return results;
}

// Test hotel detail query
export async function testHotelDetailQuery() {
  console.log("🧪 Testing hotel detail query...");
  
  try {
    // First get a hotel ID from basic query
    const { data: hotels } = await queryHotelsWithBackendAdapter({});
    
    if (!hotels || hotels.length === 0) {
      console.warn("⚠️ No hotels available for detail test");
      return { success: false, error: "No hotels available" };
    }
    
    const testHotelId = hotels[0].id;
    console.log("🎯 Testing detail query for hotel ID:", testHotelId);
    
    const { data, error } = await queryHotelDetailWithBackendAdapter(testHotelId);
    
    if (error) {
      console.error("❌ Hotel detail query failed:", error);
      return { success: false, error };
    }
    
    console.log("✅ Hotel detail query successful:", {
      hotelId: data.id,
      hotelName: data.name,
      hasActivities: !!data.hotel_activities?.length,
      hasImages: !!data.hotel_images?.length
    });
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Hotel detail query error:", err);
    return { success: false, error: err };
  }
}

// Run all tests
export async function runBackendConnectionTests() {
  console.log("🚀 Starting Backend Connection Tests...");
  
  const results = {
    basicQuery: await testBasicHotelQuery(),
    filterQueries: await testFilterQueries(), 
    hotelDetail: await testHotelDetailQuery()
  };
  
  console.log("📊 Test Results Summary:");
  console.log("- Basic Query:", results.basicQuery.success ? "✅ PASS" : "❌ FAIL");
  console.log("- Filter Queries:", results.filterQueries.every(r => r.success) ? "✅ PASS" : "❌ SOME FAILED");
  console.log("- Hotel Detail:", results.hotelDetail.success ? "✅ PASS" : "❌ FAIL");
  
  return results;
}