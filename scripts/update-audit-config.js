#!/usr/bin/env node

/**
 * Script to update audit repository configuration with new Supabase project
 * Usage: node scripts/update-audit-config.js [NEW_PROJECT_ID] [NEW_ANON_KEY] [NEW_SERVICE_ROLE_KEY]
 */

const fs = require('fs');
const path = require('path');

const [,, newProjectId, newAnonKey, newServiceRoleKey] = process.argv;

if (!newProjectId || !newAnonKey || !newServiceRoleKey) {
  console.log('❌ Usage: node scripts/update-audit-config.js [NEW_PROJECT_ID] [NEW_ANON_KEY] [NEW_SERVICE_ROLE_KEY]');
  process.exit(1);
}

console.log('🔄 Updating audit repository configuration...\n');

// Update .env
const envContent = `# AUDIT REPOSITORY - ISOLATED SUPABASE PROJECT
VITE_SUPABASE_PROJECT_ID="${newProjectId}"
VITE_SUPABASE_PUBLISHABLE_KEY="${newAnonKey}"
VITE_SUPABASE_URL="https://${newProjectId}.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="${newServiceRoleKey}"

# Test Environment
NODE_ENV=test
AUDIT_MODE=true
`;

fs.writeFileSync('.env', envContent);
console.log('✅ Updated .env');

// Update supabase client
const clientContent = `
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://${newProjectId}.supabase.co"
const supabaseAnonKey = "${newAnonKey}"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})`;

fs.writeFileSync('src/integrations/supabase/client.ts', clientContent);
console.log('✅ Updated supabase client');

// Update test files
const testFiles = [
  'src/test/translation-validation-simple.test.ts'
];

testFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/pgdzrvdwgoomjnnegkcn/g, newProjectId);
    content = content.replace(/https:\/\/pgdzrvdwgoomjnnegkcn\.supabase\.co/g, `https://${newProjectId}.supabase.co`);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  }
});

console.log('\n🎉 Configuration updated successfully!');
console.log('📋 Next steps:');
console.log('   1. Set up database schema in new Supabase project');
console.log('   2. Run: node scripts/verify-audit-isolation.js');
console.log('   3. Run audit tests: npm run test:audit');