/**
 * Manual Adapter Validation
 * Quick validation script to confirm adapter functionality
 */

import { queryHotelsWithBackendAdapter, queryHotelDetailWithBackendAdapter } from '@/adapters/optimized-query-adapter';
import { FilterState } from '@/components/filters/FilterTypes';

// Quick validation function that can be run in console
async function validateAdapter() {
  console.log('🔍 Starting Manual Adapter Validation...');
  
  // Test 1: Basic query
  console.log('\n1️⃣ Testing basic hotel query...');
  try {
    const { data, error } = await queryHotelsWithBackendAdapter({});
    if (error) {
      console.error('❌ Basic query failed:', error);
      return false;
    }
    console.log(`✅ Basic query successful: ${data.length} hotels found`);
    if (data.length > 0) {
      console.log('Sample hotel:', { 
        name: data[0].name, 
        location: data[0].location,
        price: data[0].price_per_month 
      });
    }
  } catch (err) {
    console.error('❌ Basic query error:', err);
    return false;
  }

  // Test 2: Filter by location
  console.log('\n2️⃣ Testing location filter...');
  try {
    const { data, error } = await queryHotelsWithBackendAdapter({ location: 'Mexico' });
    if (error) {
      console.error('❌ Location filter failed:', error);
      return false;
    }
    console.log(`✅ Location filter successful: ${data.length} hotels in Mexico`);
  } catch (err) {
    console.error('❌ Location filter error:', err);
    return false;
  }

  // Test 3: Price range filter
  console.log('\n3️⃣ Testing price range filter...');
  try {
    const { data, error } = await queryHotelsWithBackendAdapter({ 
      minPrice: 1000, 
      maxPrice: 3000 
    });
    if (error) {
      console.error('❌ Price filter failed:', error);
      return false;
    }
    console.log(`✅ Price filter successful: ${data.length} hotels in price range`);
  } catch (err) {
    console.error('❌ Price filter error:', err);
    return false;
  }

  // Test 4: Hotel detail query
  console.log('\n4️⃣ Testing hotel detail query...');
  try {
    const { data: hotels } = await queryHotelsWithBackendAdapter({});
    if (hotels.length > 0) {
      const { data, error } = await queryHotelDetailWithBackendAdapter(hotels[0].id);
      if (error) {
        console.error('❌ Detail query failed:', error);
        return false;
      }
      console.log(`✅ Detail query successful for: ${data?.name}`);
    }
  } catch (err) {
    console.error('❌ Detail query error:', err);
    return false;
  }

  console.log('\n🎉 All manual validation tests passed!');
  return true;
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Starting Performance Test...');
  
  const start = performance.now();
  const promises = [];
  
  // Run 10 concurrent queries
  for (let i = 0; i < 10; i++) {
    promises.push(queryHotelsWithBackendAdapter({ location: 'Mexico' }));
  }
  
  try {
    const results = await Promise.all(promises);
    const end = performance.now();
    const duration = end - start;
    
    const successCount = results.filter(r => !r.error).length;
    console.log(`✅ Performance test: ${successCount}/10 queries successful in ${duration.toFixed(0)}ms`);
    console.log(`⚡ Average per query: ${(duration / 10).toFixed(0)}ms`);
    
    return duration < 5000; // Should complete in under 5 seconds
  } catch (err) {
    console.error('❌ Performance test failed:', err);
    return false;
  }
}

// Type safety test
async function typeSafetyTest() {
  console.log('\n🔒 Starting Type Safety Test...');
  
  try {
    const { data, error } = await queryHotelsWithBackendAdapter({});
    if (error || !data.length) {
      console.error('❌ Cannot test type safety: no data available');
      return false;
    }
    
    const hotel = data[0];
    
    // Check required fields and types
    const checks = {
      hasStringId: typeof hotel.id === 'string' && hotel.id.length > 0,
      hasStringName: typeof hotel.name === 'string' && hotel.name.length > 0,
      hasStringLocation: typeof hotel.location === 'string' && hotel.location.length > 0,
      hasNumberPrice: typeof hotel.price_per_month === 'number' && hotel.price_per_month > 0,
      hasThemeArray: Array.isArray(hotel.hotel_themes),
      hasActivityArray: Array.isArray(hotel.hotel_activities)
    };
    
    const allPassed = Object.values(checks).every(Boolean);
    
    console.log('Type checks:', checks);
    
    if (allPassed) {
      console.log('✅ Type safety test passed');
      return true;
    } else {
      console.error('❌ Type safety test failed');
      return false;
    }
    
  } catch (err) {
    console.error('❌ Type safety test error:', err);
    return false;
  }
}

// Complete validation suite
export async function runCompleteValidation() {
  console.log('🚀 Running Complete Adapter Validation Suite');
  console.log('===========================================\n');
  
  const results = {
    basic: await validateAdapter(),
    performance: await performanceTest(),
    typeSafety: await typeSafetyTest()
  };
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('\n===========================================');
  console.log('📊 VALIDATION SUMMARY');
  console.log('===========================================');
  console.log(`✅ Passed: ${passedTests}/${totalTests} test suites`);
  console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ADAPTER FULLY VALIDATED - READY FOR PRODUCTION');
  } else {
    console.log('⚠️ ADAPTER NEEDS ATTENTION - SOME TESTS FAILED');
  }
  
  return {
    results,
    isReady: passedTests === totalTests,
    passedTests,
    totalTests
  };
}

// Export individual functions for console use
export { validateAdapter, performanceTest, typeSafetyTest };

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).validateAdapter = runCompleteValidation;
  console.log('🔧 Adapter validation available: call window.validateAdapter() in console');
}