// Global Price Corrector - Immediate Execution Script
// This script runs the global price corrector to fix all hotel package prices

const SUPABASE_URL = 'https://pgdzrvdwgoomjnnegkcn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0';

async function runGlobalPriceCorrector() {
  console.log('🚀 Starting Global Price Corrector...');
  console.log('📊 This will update all hotel package prices according to the Sacred Pricing Table');
  console.log('⏳ Please wait while processing all hotels...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/global-price-corrector`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to run price corrector');
    }

    if (data.success) {
      console.log('✅ GLOBAL PRICE CORRECTOR COMPLETED SUCCESSFULLY!\n');
      
      console.log('📊 SUMMARY:');
      console.log(`   Hotels processed: ${data.summary.hotelsProcessed}`);
      console.log(`   Packages checked: ${data.summary.packagesChecked}`);
      console.log(`   Packages corrected: ${data.summary.packagesCorrected}\n`);

      if (data.results && data.results.length > 0) {
        console.log('🏨 DETAILED RESULTS:');
        
        const correctedHotels = data.results.filter(r => r.correctedPackages > 0);
        const errorHotels = data.results.filter(r => r.errors.length > 0);
        
        console.log(`   ${correctedHotels.length} hotels had prices corrected`);
        console.log(`   ${errorHotels.length} hotels had errors\n`);

        // Show first 10 corrected hotels as examples
        if (correctedHotels.length > 0) {
          console.log('🔧 EXAMPLES OF CORRECTED HOTELS:');
          correctedHotels.slice(0, 10).forEach(hotel => {
            console.log(`   • ${hotel.hotelName}: ${hotel.correctedPackages} packages corrected`);
            if (hotel.warnings.length > 0) {
              hotel.warnings.slice(0, 2).forEach(warning => {
                console.log(`     - ${warning}`);
              });
            }
          });
          if (correctedHotels.length > 10) {
            console.log(`   ... and ${correctedHotels.length - 10} more hotels`);
          }
          console.log('');
        }

        // Show errors if any
        if (errorHotels.length > 0) {
          console.log('❌ HOTELS WITH ERRORS:');
          errorHotels.slice(0, 5).forEach(hotel => {
            console.log(`   • ${hotel.hotelName}:`);
            hotel.errors.slice(0, 2).forEach(error => {
              console.log(`     - ${error}`);
            });
          });
          if (errorHotels.length > 5) {
            console.log(`   ... and ${errorHotels.length - 5} more hotels with errors`);
          }
          console.log('');
        }
      }

      console.log('🎉 All hotel package prices have been corrected according to the Sacred Price Table!');
      console.log('💰 Prices now follow the meal plan percentages and price rounding rules.');
      console.log(`⏰ Completed at: ${new Date().toLocaleString()}\n`);
      
    } else {
      throw new Error(data.error || 'Price correction failed');
    }

  } catch (error) {
    console.error('❌ GLOBAL PRICE CORRECTOR FAILED:');
    console.error(`   Error: ${error.message}`);
    console.error('   Please check the edge function logs for more details.\n');
    process.exit(1);
  }
}

// Run the corrector
runGlobalPriceCorrector();