#!/usr/bin/env node

/**
 * Complete Package Fix Runner
 * This script executes both the package creation and price correction processes
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://pgdzrvdwgoomjnnegkcn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mjk0NzIsImV4cCI6MjA1ODQwNTQ3Mn0.VWcjjovrdsV7czPVaYJ219GzycoeYisMUpPhyHkvRZ0';

async function runCompletePackageFix() {
  console.log('🚀 Starting Complete Package Fix Process...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Step 1: Create missing packages
    console.log('\n📦 Step 1: Creating missing packages...');
    const { data: createData, error: createError } = await supabase.functions.invoke('create-missing-packages');
    
    if (createError) {
      throw new Error(`Package creation failed: ${createError.message}`);
    }
    
    console.log('✅ Package creation completed:');
    console.log(`   Hotels processed: ${createData.summary?.hotelsProcessed || 0}`);
    console.log(`   Packages created: ${createData.summary?.packagesCreated || 0}`);
    console.log(`   Hotels skipped: ${createData.summary?.hotelsSkipped || 0}`);
    
    // Step 2: Wait for database consistency
    console.log('\n⏳ Waiting for database consistency...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 3: Run price corrector
    console.log('\n💰 Step 2: Running price corrector...');
    const { data: correctData, error: correctError } = await supabase.functions.invoke('global-price-corrector');
    
    if (correctError) {
      throw new Error(`Price correction failed: ${correctError.message}`);
    }
    
    console.log('✅ Price correction completed:');
    console.log(`   Hotels processed: ${correctData.summary?.hotelsProcessed || 0}`);
    console.log(`   Packages checked: ${correctData.summary?.packagesChecked || 0}`);
    console.log(`   Packages corrected: ${correctData.summary?.packagesCorrected || 0}`);
    
    console.log('\n🎉 Complete package fixing process finished successfully!');
    console.log('\n📊 Final Summary:');
    console.log(`   Total hotels processed: ${(createData.summary?.hotelsProcessed || 0) + (correctData.summary?.hotelsProcessed || 0)}`);
    console.log(`   Total packages created: ${createData.summary?.packagesCreated || 0}`);
    console.log(`   Total packages corrected: ${correctData.summary?.packagesCorrected || 0}`);
    
    return {
      success: true,
      createResults: createData,
      correctResults: correctData
    };
    
  } catch (error) {
    console.error('\n❌ Complete package fixing failed:', error.message);
    console.error('Stack trace:', error.stack);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if called directly
if (require.main === module) {
  runCompletePackageFix()
    .then((result) => {
      console.log('\n🏁 Script execution completed');
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('\n💥 Script execution failed:', error);
      process.exit(1);
    });
}

module.exports = { runCompletePackageFix };