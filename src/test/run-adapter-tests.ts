/**
 * Test Runner for Adapter Finalization
 * Execute this file to run all finalization tests
 */

import { runAdapterFinalizationTests } from './adapter-finalization-tests';
import { runBackendConnectionTests } from './backend-connection-test';

async function runAllTests() {
  console.log('🚀 Starting Complete Adapter Test Suite...');
  console.log('=====================================\n');

  // Run original backend connection tests
  console.log('📋 Phase 1: Backend Connection Tests');
  const connectionResults = await runBackendConnectionTests();
  
  console.log('\n=====================================\n');
  
  // Run finalization tests
  console.log('📋 Phase 2: Adapter Finalization Tests');
  const finalizationResults = await runAdapterFinalizationTests();
  
  console.log('\n=====================================');
  console.log('🏁 COMPLETE TEST RESULTS SUMMARY');
  console.log('=====================================\n');
  
  // Connection test summary
  const connectionTests = [
    connectionResults.basicQuery,
    connectionResults.hotelDetail,
    ...connectionResults.filterQueries
  ];
  
  const connectionPassed = connectionTests.filter(t => t.success).length;
  const connectionTotal = connectionTests.length;
  
  console.log(`📊 Backend Connection Tests: ${connectionPassed}/${connectionTotal} passed`);
  
  // Finalization test summary
  console.log(`📊 Finalization Tests: ${finalizationResults.summary.passed}/${finalizationResults.summary.total} passed`);
  console.log(`⏱️ Average Test Duration: ${finalizationResults.summary.avgDuration.toFixed(2)}ms`);
  
  // Overall assessment
  const totalPassed = connectionPassed + finalizationResults.summary.passed;
  const totalTests = connectionTotal + finalizationResults.summary.total;
  const successRate = (totalPassed / totalTests) * 100;
  
  console.log(`\n🎯 OVERALL SUCCESS RATE: ${totalPassed}/${totalTests} (${successRate.toFixed(1)}%)`);
  
  if (successRate >= 95) {
    console.log('✅ ADAPTER READY FOR PRODUCTION');
  } else if (successRate >= 80) {
    console.log('⚠️ ADAPTER NEEDS MINOR FIXES');
  } else {
    console.log('❌ ADAPTER NEEDS MAJOR FIXES');
  }
  
  // Failed test details
  const allFailedTests = [
    ...connectionTests.filter(t => !t.success),
    ...finalizationResults.results.filter(t => !t.success)
  ];
  
  if (allFailedTests.length > 0) {
    console.log('\n❌ Failed Tests Details:');
    allFailedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.testName || 'Connection Test'}`);
      console.log(`   Error: ${test.error?.message || test.error}`);
    });
  }
  
  return {
    connection: connectionResults,
    finalization: finalizationResults,
    summary: {
      totalTests,
      totalPassed,
      successRate,
      isReady: successRate >= 95
    }
  };
}

// Export for use in components or console
export { runAllTests };

// Auto-run when imported directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called manually
  (window as any).runAdapterTests = runAllTests;
  console.log('🔧 Adapter tests available: call window.runAdapterTests() in console');
}