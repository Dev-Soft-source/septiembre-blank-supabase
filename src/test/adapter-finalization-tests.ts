/**
 * Adapter Finalization Tests
 * Comprehensive testing suite to validate optimized query adapter functionality
 */

import { queryHotelsWithBackendAdapter, queryHotelDetailWithBackendAdapter } from "@/adapters/optimized-query-adapter";
import { FilterState } from "@/components/filters/FilterTypes";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  resultsCount?: number;
  error?: any;
  details?: any;
}

// Test 1: Filter Testing - All hotel filters with real data
export async function testAllFilters(): Promise<TestResult[]> {
  console.log("🧪 Testing All Hotel Filters...");
  
  const filterTests: { name: string; filters: FilterState }[] = [
    {
      name: "Theme Filter",
      filters: { theme: [{ id: "wellness", name: "Wellness", level: 1 as 1, category: "AFFINITY" }] }
    },
    {
      name: "Activity Filter", 
      filters: { activities: ["yoga", "swimming"] }
    },
    {
      name: "Location Filter",
      filters: { location: "Mexico" }
    },
    {
      name: "Price Range Filter",
      filters: { minPrice: 1000, maxPrice: 3000 }
    },
    {
      name: "Hotel Features Filter",
      filters: { hotelFeatures: ["wifi", "pool"] }
    },
    {
      name: "Room Features Filter", 
      filters: { roomFeatures: ["balcony", "kitchen"] }
    },
    {
      name: "Property Type Filter",
      filters: { propertyType: "hotel" }
    },
    {
      name: "Property Style Filter",
      filters: { propertyStyle: "modern" }
    },
    {
      name: "Available Months Filter",
      filters: { month: "january" }
    },
    {
      name: "Combined Filters",
      filters: { 
        location: "Mexico",
        minPrice: 1000,
        hotelFeatures: ["wifi"],
        theme: [{ id: "wellness", name: "Wellness", level: 1 as 1, category: "AFFINITY" }]
      }
    }
  ];

  const results: TestResult[] = [];

  for (const test of filterTests) {
    const startTime = performance.now();
    try {
      console.log(`🔍 Testing: ${test.name}`, test.filters);
      const { data, error } = await queryHotelsWithBackendAdapter(test.filters);
      const duration = performance.now() - startTime;

      if (error) {
        console.error(`❌ ${test.name} failed:`, error);
        results.push({
          testName: test.name,
          success: false,
          duration,
          error
        });
      } else {
        console.log(`✅ ${test.name} passed: ${data.length} results in ${duration.toFixed(2)}ms`);
        results.push({
          testName: test.name,
          success: true,
          duration,
          resultsCount: data.length,
          details: { sampleHotel: data[0]?.name }
        });
      }
    } catch (err) {
      const duration = performance.now() - startTime;
      console.error(`❌ ${test.name} error:`, err);
      results.push({
        testName: test.name,
        success: false,
        duration,
        error: err
      });
    }
  }

  return results;
}

// Test 2: Type Safety Validation
export async function testTypeSafety(): Promise<TestResult> {
  console.log("🧪 Testing Type Safety...");
  const startTime = performance.now();
  
  try {
    const { data, error } = await queryHotelsWithBackendAdapter({});
    const duration = performance.now() - startTime;
    
    if (error) {
      return {
        testName: "Type Safety",
        success: false,
        duration,
        error
      };
    }

    // Validate that all expected fields are present and correctly typed
    const sampleHotel = data[0];
    if (!sampleHotel) {
      return {
        testName: "Type Safety", 
        success: false,
        duration,
        error: "No hotels returned for type validation"
      };
    }

    const typeValidation = {
      hasId: typeof sampleHotel.id === 'string',
      hasName: typeof sampleHotel.name === 'string',
      hasLocation: typeof sampleHotel.location === 'string',
      hasPricePerMonth: typeof sampleHotel.price_per_month === 'number',
      hasThemes: Array.isArray(sampleHotel.hotel_themes),
      hasActivities: Array.isArray(sampleHotel.hotel_activities)
    };

    const allTypesValid = Object.values(typeValidation).every(Boolean);
    
    console.log("🔍 Type validation results:", typeValidation);
    
    return {
      testName: "Type Safety",
      success: allTypesValid,
      duration,
      details: typeValidation
    };

  } catch (err) {
    const duration = performance.now() - startTime;
    return {
      testName: "Type Safety",
      success: false,
      duration,
      error: err
    };
  }
}

// Test 3: Performance Verification
export async function testPerformance(): Promise<TestResult[]> {
  console.log("🧪 Testing Performance...");
  
  const performanceTests = [
    { name: "Basic Query", filters: {} },
    { name: "Complex Filter Query", filters: { 
      location: "Mexico",
      minPrice: 1000,
      maxPrice: 5000,
      hotelFeatures: ["wifi", "pool"],
      theme: [{ id: "wellness", name: "Wellness", level: 1 as 1, category: "AFFINITY" }]
    }},
    { name: "Multiple Concurrent Queries", filters: { location: "Mexico" } }
  ];

  const results: TestResult[] = [];

  // Test individual query performance
  for (const test of performanceTests.slice(0, 2)) {
    const startTime = performance.now();
    try {
      const { data, error } = await queryHotelsWithBackendAdapter(test.filters);
      const duration = performance.now() - startTime;
      
      results.push({
        testName: test.name,
        success: !error && duration < 2000, // Should complete in under 2 seconds
        duration,
        resultsCount: data?.length || 0,
        error: error || (duration >= 2000 ? "Query too slow" : undefined)
      });

      console.log(`⏱️ ${test.name}: ${duration.toFixed(2)}ms (${data?.length || 0} results)`);
    } catch (err) {
      const duration = performance.now() - startTime;
      results.push({
        testName: test.name,
        success: false,
        duration,
        error: err
      });
    }
  }

  // Test concurrent queries
  const startTime = performance.now();
  try {
    const concurrentPromises = Array(5).fill(0).map(() => 
      queryHotelsWithBackendAdapter({ location: "Mexico" })
    );
    
    const concurrentResults = await Promise.all(concurrentPromises);
    const duration = performance.now() - startTime;
    
    const allSuccessful = concurrentResults.every(result => !result.error);
    
    results.push({
      testName: "Multiple Concurrent Queries",
      success: allSuccessful && duration < 5000,
      duration,
      resultsCount: concurrentResults[0]?.data?.length || 0,
      details: { concurrentQueries: 5 }
    });

    console.log(`⏱️ Concurrent Queries: ${duration.toFixed(2)}ms for 5 parallel queries`);
  } catch (err) {
    const duration = performance.now() - startTime;
    results.push({
      testName: "Multiple Concurrent Queries",
      success: false,
      duration,
      error: err
    });
  }

  return results;
}

// Test 4: Backend View Validation
export async function testBackendViewUsage(): Promise<TestResult> {
  console.log("🧪 Testing Backend View Usage...");
  const startTime = performance.now();
  
  try {
    // Verify that hotels_with_filters_view exists and works
    const { data: viewData, error: viewError } = await supabase
      .from('hotels_with_filters_view')
      .select('*')
      .limit(1);

    const duration = performance.now() - startTime;

    if (viewError) {
      return {
        testName: "Backend View Validation",
        success: false,
        duration,
        error: viewError
      };
    }

    // Test that our adapter uses this view correctly
    const { data: adapterData, error: adapterError } = await queryHotelsWithBackendAdapter({});
    
    return {
      testName: "Backend View Validation",
      success: !adapterError && !!adapterData,
      duration,
      details: {
        viewExists: !viewError,
        adapterWorks: !adapterError,
        sampleRecord: viewData?.[0]?.name
      }
    };

  } catch (err) {
    const duration = performance.now() - startTime;
    return {
      testName: "Backend View Validation",
      success: false,
      duration,
      error: err
    };
  }
}

// Test 5: Hotel Detail Query
export async function testHotelDetailQuery(): Promise<TestResult> {
  console.log("🧪 Testing Hotel Detail Query...");
  const startTime = performance.now();
  
  try {
    // Get a hotel ID first
    const { data: hotels } = await queryHotelsWithBackendAdapter({});
    if (!hotels || hotels.length === 0) {
      return {
        testName: "Hotel Detail Query",
        success: false,
        duration: performance.now() - startTime,
        error: "No hotels available for detail test"
      };
    }

    const testHotelId = hotels[0].id;
    const { data, error } = await queryHotelDetailWithBackendAdapter(testHotelId);
    const duration = performance.now() - startTime;

    if (error) {
      return {
        testName: "Hotel Detail Query",
        success: false,
        duration,
        error
      };
    }

    return {
      testName: "Hotel Detail Query",
      success: true,
      duration,
      details: {
        hotelId: data.id,
        hotelName: data.name,
        hasImages: !!data.hotel_images?.length,
        hasActivities: !!data.hotel_activities?.length,
        hasThemes: !!data.hotel_themes?.length
      }
    };

  } catch (err) {
    const duration = performance.now() - startTime;
    return {
      testName: "Hotel Detail Query",
      success: false,
      duration,
      error: err
    };
  }
}

// Run all finalization tests
export async function runAdapterFinalizationTests(): Promise<{
  summary: { total: number; passed: number; failed: number; avgDuration: number };
  results: TestResult[];
}> {
  console.log("🚀 Starting Adapter Finalization Tests...");
  
  const allResults: TestResult[] = [];
  
  // Run all test suites
  const filterResults = await testAllFilters();
  const typeSafetyResult = await testTypeSafety();
  const performanceResults = await testPerformance();
  const backendViewResult = await testBackendViewUsage();
  const hotelDetailResult = await testHotelDetailQuery();

  allResults.push(...filterResults, typeSafetyResult, ...performanceResults, backendViewResult, hotelDetailResult);

  const summary = {
    total: allResults.length,
    passed: allResults.filter(r => r.success).length,
    failed: allResults.filter(r => !r.success).length,
    avgDuration: allResults.reduce((sum, r) => sum + r.duration, 0) / allResults.length
  };

  console.log("📊 Finalization Test Summary:");
  console.log(`- Total Tests: ${summary.total}`);
  console.log(`- Passed: ${summary.passed} ✅`);
  console.log(`- Failed: ${summary.failed} ${summary.failed > 0 ? '❌' : '✅'}`);
  console.log(`- Average Duration: ${summary.avgDuration.toFixed(2)}ms`);

  // Log failed tests
  const failedTests = allResults.filter(r => !r.success);
  if (failedTests.length > 0) {
    console.log("\n❌ Failed Tests:");
    failedTests.forEach(test => {
      console.log(`- ${test.testName}: ${test.error?.message || test.error}`);
    });
  }

  return { summary, results: allResults };
}