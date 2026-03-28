// BROWSER CONSOLE TEST FOR STABILITY VALIDATION TESTS
// Copy and paste this entire script into your browser console on /stability-tests page
// This will provide the RAW JSON PROOF the user requested

console.clear();
console.log('🧪 STABILITY VALIDATION EDGE FUNCTION - DIRECT CONSOLE TEST');
console.log('='.repeat(70));

async function testStabilityFunction(testType) {
  const url = 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/stability-validation-tests';
  const payload = { testType };
  
  console.log(`\n📍 TESTING: ${testType.toUpperCase()}`);
  console.log('─'.repeat(50));
  console.log(`URL: ${url}`);
  console.log(`Payload:`, payload);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0'
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`🔹 HTTP Status: ${response.status} ${response.statusText}`);
    console.log(`🔹 Headers:`, Object.fromEntries(response.headers.entries()));
    
    const rawText = await response.text();
    console.log(`🔹 Raw Response Body:`, rawText);
    
    if (response.ok) {
      try {
        const jsonData = JSON.parse(rawText);
        console.log(`✅ PARSED JSON DATA:`, jsonData);
        console.log(`✅ SUCCESS: ${testType} returned valid JSON`);
        return { success: true, data: jsonData, status: response.status };
      } catch (parseError) {
        console.error(`⚠️ JSON Parse Error:`, parseError);
        return { success: false, error: 'Invalid JSON', raw: rawText, status: response.status };
      }
    } else {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return { success: false, error: `HTTP ${response.status}`, raw: rawText, status: response.status };
    }
    
  } catch (networkError) {
    console.error(`🚨 Network Error:`, networkError);
    return { success: false, error: networkError.message };
  }
}

async function runAllTests() {
  const testTypes = ['ping', 'circuit-breaker', 'cache', 'pool', 'alerts'];
  const results = {};
  
  console.log(`\n🚀 RUNNING ALL TESTS (${testTypes.length} total)`);
  console.log('═'.repeat(70));
  
  for (const testType of testTypes) {
    const result = await testStabilityFunction(testType);
    results[testType] = result;
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 FINAL SUMMARY:');
  console.log('═'.repeat(70));
  
  let passCount = 0;
  let failCount = 0;
  
  Object.entries(results).forEach(([testType, result]) => {
    if (result.success) {
      console.log(`✅ ${testType}: PASS - ${JSON.stringify(result.data)}`);
      passCount++;
    } else {
      console.error(`❌ ${testType}: FAIL - ${result.error}`);
      failCount++;
    }
  });
  
  console.log(`\n🎯 RESULTS: ${passCount} PASS, ${failCount} FAIL`);
  console.log(`📅 Completed at: ${new Date().toISOString()}`);
  
  return results;
}

// Quick test function for individual tests
window.testStability = testStabilityFunction;
window.runAllStabilityTests = runAllTests;

console.log('\n📝 USAGE:');
console.log('  await testStability("ping")           - Test single endpoint');
console.log('  await runAllStabilityTests()          - Test all endpoints');
console.log('  testStability("circuit-breaker")      - Test circuit breaker');
console.log('  testStability("cache")                - Test cache system');
console.log('  testStability("pool")                 - Test connection pool');
console.log('  testStability("alerts")               - Test alerting system');

console.log('\n🎯 STARTING FULL TEST SUITE...\n');

// Auto-run all tests
runAllStabilityTests();