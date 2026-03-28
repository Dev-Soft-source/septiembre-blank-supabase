/**
 * Execute Validation Report
 * Main entry point for running validation and generating tabular reports
 */

import { executeValidationReport } from './validation-report-executor';

// Execute validation report immediately
(async function runValidationReport() {
  try {
    console.log('🎯 HOTEL-LIVING VALIDATION REPORT EXECUTION');
    console.log('==========================================');
    console.log('Starting validation report generation...\n');
    
    await executeValidationReport();
    
    console.log('\n✅ Validation report execution completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Check window.validationTabularReport for structured data');
    console.log('2. Check window.validationExecutiveSummary for summary metrics');
    console.log('3. Visit /validation-report page for interactive view');
    console.log('4. Download HTML report using window.validationTabularHTML');
    
  } catch (error) {
    console.error('❌ Validation report execution failed:', error);
  }
})();

// Export for manual execution
export { executeValidationReport };