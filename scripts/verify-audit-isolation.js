#!/usr/bin/env node

/**
 * Verification script to ensure audit repository is isolated from production
 */

const fs = require('fs');
const path = require('path');

const PRODUCTION_PROJECT_ID = 'pgdzrvdwgoomjnnegkcn';
const PRODUCTION_URL = 'https://pgdzrvdwgoomjnnegkcn.supabase.co';
const AUDIT_PROJECT_ID = 'daumzjohbruhpsimfydx';
const AUDIT_URL = 'https://daumzjohbruhpsimfydx.supabase.co';

console.log('🔍 Verifying audit repository isolation...\n');

// Files to check for production references
const filesToCheck = [
  '.env',
  '.env.example', 
  'src/integrations/supabase/client.ts',
  'tests/audit/setup.ts',
  'tests/audit/availability-packages.test.ts',
  'tests/audit/hotel-creation.test.ts',
  'tests/audit/supabase-storage.test.ts',
  'src/test/translation-validation-simple.test.ts'
];

let hasProductionReferences = false;

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(PRODUCTION_PROJECT_ID) || content.includes(PRODUCTION_URL)) {
      console.log(`❌ DANGER: Production reference found in ${filePath}`);
      hasProductionReferences = true;
    } else {
      console.log(`✅ Clean: ${filePath}`);
    }
  } else {
    console.log(`⚠️  Missing: ${filePath}`);
  }
});

console.log('\n' + '='.repeat(60));

  if (hasProductionReferences) {
    console.log('❌ CRITICAL: Production database references detected!');
    console.log('   The audit repository is NOT isolated from production.');
    console.log('   Running tests will affect the production database.');
    console.log('\n📋 Action Required:');
    console.log('   1. Create a new isolated Supabase project');
    console.log('   2. Update environment variables');
    console.log('   3. Re-run this verification script');
    process.exit(1);
  } else {
    console.log('✅ SUCCESS: Audit repository is isolated from production');
    console.log(`   Using audit project: ${AUDIT_PROJECT_ID}`);
    console.log(`   Audit URL: ${AUDIT_URL}`);
    console.log('   Safe to run audit tests');
  }