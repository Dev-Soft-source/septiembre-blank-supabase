/**
 * Final Production Validation
 * Comprehensive test suite confirming production readiness
 */

import { runAdapterFinalizationTests } from './adapter-finalization-tests';
import { runCompleteValidation } from './manual-adapter-validation';
import { runBackendConnectionTests } from './backend-connection-test';

interface ProductionValidationResult {
  isReady: boolean;
  confidence: number;
  issues: string[];
  recommendations: string[];
  metrics: {
    totalTests: number;
    passedTests: number;
    avgPerformance: number;
    errorRate: number;
  };
}

export async function runFinalProductionValidation(): Promise<ProductionValidationResult> {
  console.log('🏭 FINAL PRODUCTION VALIDATION');
  console.log('================================');
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  let totalTests = 0;
  let passedTests = 0;
  let totalDuration = 0;
  let errorCount = 0;

  // Phase 1: Backend Connection Validation
  console.log('\n📡 Phase 1: Backend Connection Validation');
  try {
    const connectionResults = await runBackendConnectionTests();
    
    const connectionTestsArray = [
      connectionResults.basicQuery,
      connectionResults.hotelDetail,
      ...connectionResults.filterQueries
    ];
    
    totalTests += connectionTestsArray.length;
    passedTests += connectionTestsArray.filter(t => t.success).length;
    
    const failedConnection = connectionTestsArray.filter(t => !t.success);
    if (failedConnection.length > 0) {
      issues.push(`${failedConnection.length} backend connection tests failed`);
      errorCount += failedConnection.length;
    }
    
    console.log(`✅ Backend Connection: ${passedTests}/${totalTests} passed`);
    
  } catch (error) {
    issues.push('Backend connection validation failed completely');
    errorCount++;
    console.error('❌ Backend connection validation error:', error);
  }

  // Phase 2: Adapter Finalization Tests
  console.log('\n🔧 Phase 2: Adapter Finalization Tests');
  try {
    const finalizationResults = await runAdapterFinalizationTests();
    
    totalTests += finalizationResults.summary.total;
    passedTests += finalizationResults.summary.passed;
    totalDuration += finalizationResults.summary.avgDuration;
    
    const failedFinalization = finalizationResults.results.filter(r => !r.success);
    if (failedFinalization.length > 0) {
      issues.push(`${failedFinalization.length} finalization tests failed`);
      errorCount += failedFinalization.length;
      
      failedFinalization.forEach(test => {
        issues.push(`Failed: ${test.testName} - ${test.error?.message || test.error}`);
      });
    }
    
    // Performance analysis
    if (finalizationResults.summary.avgDuration > 2000) {
      issues.push('Average query performance exceeds 2000ms');
      recommendations.push('Consider query optimization or database indexing');
    }
    
    console.log(`✅ Finalization Tests: ${finalizationResults.summary.passed}/${finalizationResults.summary.total} passed`);
    
  } catch (error) {
    issues.push('Adapter finalization tests failed completely');
    errorCount++;
    console.error('❌ Finalization tests error:', error);
  }

  // Phase 3: Manual Validation
  console.log('\n🧪 Phase 3: Manual Validation');
  try {
    const manualResults = await runCompleteValidation();
    
    totalTests += manualResults.totalTests;
    passedTests += manualResults.passedTests;
    
    if (!manualResults.isReady) {
      issues.push('Manual validation detected issues');
      errorCount++;
    }
    
    console.log(`✅ Manual Validation: ${manualResults.passedTests}/${manualResults.totalTests} passed`);
    
  } catch (error) {
    issues.push('Manual validation failed completely');
    errorCount++;
    console.error('❌ Manual validation error:', error);
  }

  // Calculate metrics and confidence
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const errorRate = totalTests > 0 ? (errorCount / totalTests) * 100 : 100;
  const avgPerformance = totalDuration / 3; // Average across test phases
  
  // Determine confidence level
  let confidence = 0;
  if (successRate >= 95) confidence = 95;
  else if (successRate >= 90) confidence = 80;
  else if (successRate >= 80) confidence = 60;
  else if (successRate >= 70) confidence = 40;
  else confidence = 20;
  
  // Adjust confidence based on performance
  if (avgPerformance > 3000) confidence = Math.max(0, confidence - 20);
  else if (avgPerformance > 2000) confidence = Math.max(0, confidence - 10);

  // Production readiness determination
  const isReady = successRate >= 95 && errorRate < 5 && avgPerformance < 2000;

  // Generate recommendations
  if (successRate < 95) {
    recommendations.push('Address failing tests before production deployment');
  }
  
  if (avgPerformance > 1000) {
    recommendations.push('Consider performance optimization for production scale');
  }
  
  if (errorRate > 5) {
    recommendations.push('Implement additional error handling and monitoring');
  }
  
  if (isReady) {
    recommendations.push('Implement production monitoring for query performance');
    recommendations.push('Set up automated test runs for continuous validation');
    recommendations.push('Plan regular adapter performance reviews');
  }

  // Final report
  console.log('\n================================');
  console.log('📊 FINAL VALIDATION REPORT');
  console.log('================================');
  console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`);
  console.log(`⚡ Average Performance: ${avgPerformance.toFixed(0)}ms`);
  console.log(`🚨 Error Rate: ${errorRate.toFixed(1)}%`);
  console.log(`🎚️ Confidence Level: ${confidence}%`);
  console.log(`🏭 Production Ready: ${isReady ? 'YES ✅' : 'NO ❌'}`);
  
  if (issues.length > 0) {
    console.log('\n❌ Issues Found:');
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  if (isReady) {
    console.log('\n🎉 ADAPTER VALIDATED FOR PRODUCTION DEPLOYMENT');
  } else {
    console.log('\n⚠️ ADAPTER REQUIRES FIXES BEFORE PRODUCTION');
  }

  return {
    isReady,
    confidence,
    issues,
    recommendations,
    metrics: {
      totalTests,
      passedTests,
      avgPerformance,
      errorRate
    }
  };
}

// Auto-execute if running directly
if (typeof window !== 'undefined') {
  (window as any).runFinalValidation = runFinalProductionValidation;
  console.log('🎯 Final validation available: call window.runFinalValidation() in console');
}