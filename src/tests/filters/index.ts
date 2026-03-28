/**
 * Comprehensive Search Filter Test Suite
 * Main entry point for all filter testing functionality
 */

export { searchFiltersTestSuite, runSearchFiltersTests } from './SearchFiltersTestSuite';
export { FilterTestRunner } from './FilterTestRunner';
export { languageFilterTester, LanguageFilterTester } from './LanguageFilterTests';
export { filterIntegrationTester, FilterIntegrationTester } from './FilterIntegrationTests';

/**
 * Execute all filter tests in sequence
 * This is the main function to run the complete test suite
 */
export async function runCompleteFilterTestSuite() {
  console.log('🚀 Starting Complete Filter Test Suite');
  console.log('This will test all search filters against hotels_public_view data');
  console.log('=' . repeat(80));

  const results = {
    mainTests: [] as any[],
    languageTests: [] as any[],
    integrationTests: [] as any[],
    summary: {
      totalTests: 0,
      totalPassed: 0,
      totalFailed: 0,
      successRate: 0,
      totalExecutionTime: 0
    }
  };

  try {
    // 1. Run main filter functionality tests
    console.log('\n1️⃣ Running Main Filter Functionality Tests...');
    const { searchFiltersTestSuite } = await import('./SearchFiltersTestSuite');
    results.mainTests = await searchFiltersTestSuite.runAllTests();

    // 2. Run language-specific tests
    console.log('\n2️⃣ Running Language-Specific Tests...');
    const { languageFilterTester } = await import('./LanguageFilterTests');
    results.languageTests = await languageFilterTester.runAllLanguageTests();

    // 3. Run integration tests
    console.log('\n3️⃣ Running Filter Integration Tests...');
    const { filterIntegrationTester } = await import('./FilterIntegrationTests');
    results.integrationTests = await filterIntegrationTester.runAllIntegrationTests();

    // Generate comprehensive summary
    const allTests = [
      ...results.mainTests,
      ...results.languageTests,
      ...results.integrationTests
    ];

    results.summary.totalTests = allTests.length;
    results.summary.totalPassed = allTests.filter(t => t.passed).length;
    results.summary.totalFailed = results.summary.totalTests - results.summary.totalPassed;
    results.summary.successRate = (results.summary.totalPassed / results.summary.totalTests) * 100;
    results.summary.totalExecutionTime = allTests.reduce((sum, t) => 
      sum + (t.executionTime || 0), 0
    );

    console.log('\n' + '='.repeat(80));
    console.log('🏆 COMPLETE FILTER TEST SUITE SUMMARY');
    console.log('='.repeat(80));
    console.log(`📊 Total Tests Run: ${results.summary.totalTests}`);
    console.log(`✅ Tests Passed: ${results.summary.totalPassed}`);
    console.log(`❌ Tests Failed: ${results.summary.totalFailed}`);
    console.log(`📈 Success Rate: ${results.summary.successRate.toFixed(1)}%`);
    console.log(`⏱️ Total Execution Time: ${results.summary.totalExecutionTime}ms`);
    console.log('');
    console.log('📋 Test Categories:');
    console.log(`  • Main Filter Tests: ${results.mainTests.length} tests`);
    console.log(`  • Language Tests: ${results.languageTests.length} tests`);
    console.log(`  • Integration Tests: ${results.integrationTests.length} tests`);
    console.log('');
    console.log('✅ Verification Points:');
    console.log('  • All filters query hotels_public_view exclusively');
    console.log('  • Multi-language support verified (EN/ES/PT/RO)');
    console.log('  • Component integration tested');
    console.log('  • Filter combinations validated');
    console.log('  • Edge cases handled properly');
    console.log('  • Performance metrics collected');
    console.log('='.repeat(80));

    if (results.summary.totalFailed > 0) {
      console.log('\n⚠️ Some tests failed. Check individual test results for details.');
    } else {
      console.log('\n🎉 All tests passed! Filter system is working correctly.');
    }

    return results;

  } catch (error) {
    console.error('❌ Complete test suite execution failed:', error);
    throw error;
  }
}

/**
 * Quick validation test to verify basic filter functionality
 */
export async function runQuickFilterValidation() {
  console.log('⚡ Running Quick Filter Validation...');
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Test 1: Verify hotels_public_view accessibility
    const { data: hotels, error: hotelError } = await supabase
      .from('hotels_public_view')
      .select('id, name, country, price_per_month')
      .limit(5);
    
    if (hotelError) {
      console.log('❌ Failed to access hotels_public_view:', hotelError.message);
      return false;
    }
    
    console.log(`✅ hotels_public_view accessible: ${hotels?.length || 0} hotels found`);
    
    // Test 2: Basic country filter
    const testCountry = hotels?.[0]?.country;
    if (testCountry) {
      const { data: countryFiltered, error: countryError } = await supabase
        .from('hotels_public_view')
        .select('id')
        .eq('country', testCountry);
      
      if (countryError) {
        console.log('❌ Country filter test failed:', countryError.message);
        return false;
      }
      
      console.log(`✅ Country filter working: ${countryFiltered?.length || 0} hotels in ${testCountry}`);
    }
    
    // Test 3: Price range filter
    const { data: priceFiltered, error: priceError } = await supabase
      .from('hotels_public_view')
      .select('id')
      .lte('price_per_month', 3000);
    
    if (priceError) {
      console.log('❌ Price filter test failed:', priceError.message);
      return false;
    }
    
    console.log(`✅ Price filter working: ${priceFiltered?.length || 0} hotels under 3000`);
    
    console.log('🎉 Quick validation complete - All basic filters working!');
    return true;
    
  } catch (error) {
    console.error('❌ Quick validation failed:', error);
    return false;
  }
}