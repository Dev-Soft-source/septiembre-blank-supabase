/**
 * Complete Validation Executor
 * Main entry point for running all validation tests
 */

import { runConsolidatedFinalValidation } from './consolidated-final-validation-report';
import { runEnhancedConsolidatedValidation } from './enhanced-consolidated-validation';

// Execute complete validation
(async function executeCompleteValidation() {
  try {
    console.log('🎯 HOTEL-LIVING COMPLETE SYSTEM VALIDATION');
    console.log('==========================================');
    console.log('Starting comprehensive validation of all system components...\n');
    
    // Run enhanced validation with realistic simulations
    const { report, readableReport } = await runEnhancedConsolidatedValidation();
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 FINAL VALIDATION REPORT');
    console.log('='.repeat(50));
    console.log(readableReport);
    
    // Save report to console for export
    (window as any).validationReport = report;
    (window as any).readableValidationReport = readableReport;
    
    console.log('\n💾 Reports saved to:');
    console.log('   • window.validationReport (structured data)');
    console.log('   • window.readableValidationReport (formatted text)');
    
  } catch (error) {
    console.error('❌ Validation execution failed:', error);
  }
})();

// Export for manual execution
export { runConsolidatedFinalValidation, runEnhancedConsolidatedValidation };