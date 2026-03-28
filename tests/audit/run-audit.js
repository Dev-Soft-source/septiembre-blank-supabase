#!/usr/bin/env node

/**
 * External Audit Test Runner
 * 
 * This script runs the complete audit validation suite for hotel-living-audit repository.
 * It validates the core booking and availability cycle without modifying existing functionality.
 * 
 * Usage: node tests/audit/run-audit.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 EXTERNAL AUDIT VALIDATION SUITE');
console.log('====================================\n');

const testFiles = [
  'hotel-creation.test.ts',
  'availability-packages.test.ts', 
  'supabase-storage.test.ts',
  'public-display.test.ts'
];

const auditResults = {
  timestamp: new Date().toISOString(),
  environment: 'audit',
  repository: 'hotel-living-audit',
  branch: 'main',
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    duration: 0
  }
};

async function runAuditTests() {
  const startTime = Date.now();
  
  console.log('📋 Test Plan:');
  console.log('1. Hotel Creation Validation');
  console.log('2. Availability Packages Creation'); 
  console.log('3. Supabase Storage Verification');
  console.log('4. Public Display Validation\n');

  for (const testFile of testFiles) {
    const testPath = path.join(__dirname, testFile);
    const testName = testFile.replace('.test.ts', '');
    
    console.log(`🧪 Running: ${testName}`);
    
    try {
      const testStart = Date.now();
      
      // Run individual test file
      execSync(`npx jest ${testPath} --config=tests/audit/jest.config.js --verbose`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      const testDuration = Date.now() - testStart;
      
      auditResults.tests.push({
        name: testName,
        status: 'PASSED',
        duration: testDuration,
        file: testFile
      });
      
      auditResults.summary.passed++;
      
      console.log(`✅ ${testName} - PASSED (${testDuration}ms)\n`);
      
    } catch (error) {
      const testDuration = Date.now() - testStart;
      
      auditResults.tests.push({
        name: testName,
        status: 'FAILED',
        duration: testDuration,
        file: testFile,
        error: error.message
      });
      
      auditResults.summary.failed++;
      
      console.log(`❌ ${testName} - FAILED (${testDuration}ms)`);
      console.log(`Error: ${error.message}\n`);
    }
    
    auditResults.summary.total++;
  }
  
  const totalDuration = Date.now() - startTime;
  auditResults.summary.duration = totalDuration;
  
  // Generate audit report
  const reportPath = path.join(__dirname, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  
  // Print summary
  console.log('📊 AUDIT RESULTS SUMMARY');
  console.log('========================');
  console.log(`Total Tests: ${auditResults.summary.total}`);
  console.log(`Passed: ${auditResults.summary.passed}`);
  console.log(`Failed: ${auditResults.summary.failed}`);
  console.log(`Duration: ${totalDuration}ms`);
  console.log(`Report: ${reportPath}\n`);
  
  if (auditResults.summary.failed > 0) {
    console.log('❌ AUDIT FAILED - Some tests did not pass');
    process.exit(1);
  } else {
    console.log('✅ AUDIT COMPLETED SUCCESSFULLY - All validations passed');
    console.log('🎯 The hotel-living-audit repository is ready for external audit review');
  }
}

// Check if Jest is available
try {
  execSync('npx jest --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Jest is not available. Please install dependencies first:');
  console.error('npm install --save-dev jest ts-jest @types/jest');
  process.exit(1);
}

// Run the audit
runAuditTests().catch(error => {
  console.error('🚨 Audit suite failed with error:', error);
  process.exit(1);
});