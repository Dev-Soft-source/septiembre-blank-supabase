// Run Global Price Corrector immediately
console.log('🚀 Running Global Price Corrector NOW...');

fetch('https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/global-price-corrector', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0',
  },
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('✅ SUCCESS! Global Price Corrector completed!');
    console.log(`📊 Summary: ${data.summary.packagesCorrected} packages corrected across ${data.summary.hotelsProcessed} hotels`);
    
    if (data.results && data.results.length > 0) {
      const corrected = data.results.filter(r => r.correctedPackages > 0).length;
      console.log(`🔧 ${corrected} hotels had price corrections applied`);
    }
  } else {
    console.error('❌ Price correction failed:', data.error);
  }
})
.catch(error => {
  console.error('❌ Error running price corrector:', error);
});

console.log('⏳ Price corrector is running... Check console for results.');