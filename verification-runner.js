import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pgdzrvdwgoomjnnegkcn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔧 Running System Verification Tests...');

async function runVerification() {
  try {
    const { data, error } = await supabase.functions.invoke('system-verification');
    
    if (error) {
      console.error('❌ Verification failed:', error);
      return;
    }
    
    if (!data?.success) {
      console.error('❌ System verification encountered errors:', data);
      return;
    }
    
    console.log('\n✅ SYSTEM VERIFICATION RESULTS:');
    console.log('='.repeat(50));
    
    data.results.forEach((result, index) => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.message}`);
      if (result.details && result.status === 'error') {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
    });
    
    console.log('\n📊 SUMMARY:');
    console.log(`Total Tests: ${data.summary.total}`);
    console.log(`Passed: ${data.summary.passed}`);
    console.log(`Failed: ${data.summary.failed}`);
    console.log(`Success Rate: ${data.summary.success_rate}%`);
    console.log(`Duration: ${data.summary.duration}ms`);
    
    if (data.summary.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED - System verification complete!');
    } else {
      console.log(`\n⚠️  ${data.summary.failed} tests failed. Review the details above.`);
    }
    
  } catch (error) {
    console.error('❌ Error running verification:', error);
  }
}

runVerification();