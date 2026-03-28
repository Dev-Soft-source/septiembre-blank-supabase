/**
 * Execute Validation Script
 * Import and run this to execute validation tests
 */

import { runCompleteValidation } from './manual-adapter-validation';

// Execute validation on module load
console.log('🎯 Executing adapter validation...');

runCompleteValidation()
  .then((results) => {
    console.log('✅ Validation execution completed');
    console.log('Results:', results);
  })
  .catch((error) => {
    console.error('❌ Validation execution failed:', error);
  });

export {};