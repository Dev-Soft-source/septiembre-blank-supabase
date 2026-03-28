/**
 * Performance Validation Suite
 * Tests adapter performance with large datasets and complex scenarios
 * as outlined in the normalization plan
 */

import { queryOptimizedHotelsWithAdapter, queryOptimizedHotelDetailWithAdapter } from '@/adapters/optimized-query-adapter';
import { FilterState } from '@/components/filters/FilterTypes';

interface PerformanceResult {
  scenario: string;
  executionTime: number;
  resultsCount: number;
  success: boolean;
  error?: Error;
  memoryUsage?: number;
}

interface PerformanceReport {
  testDate: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageQueryTime: number;
  slowestQuery: PerformanceResult;
  fastestQuery: PerformanceResult;
  results: PerformanceResult[];
}

/**
 * Performance test scenarios for validation
 */
const PERFORMANCE_TEST_SCENARIOS: Array<{
  name: string;
  filters: FilterState;
  expectedMaxTime: number; // milliseconds
  description: string;
}> = [
  {
    name: "Basic pagination - No filters",
    filters: {},
    expectedMaxTime: 200,
    description: "Baseline query with no filters, should be fastest"
  },
  {
    name: "Simple country filter",
    filters: { country: "ES" },
    expectedMaxTime: 250,
    description: "Single indexed field filter"
  },
  {
    name: "Price range filter", 
    filters: { minPrice: 1000, maxPrice: 2500 },
    expectedMaxTime: 300,
    description: "Numeric range on indexed field"
  },
  {
    name: "Text search",
    filters: { searchTerm: "luxury spa resort" },
    expectedMaxTime: 400,
    description: "Full-text search across multiple fields"
  },
  {
    name: "Multiple basic filters",
    filters: { 
      country: "ES", 
      propertyType: "Resort", 
      stars: ["5"] 
    },
    expectedMaxTime: 350,
    description: "Multiple simple indexed filters"
  },
  {
    name: "Theme/affinity filtering",
    filters: { 
      affinities: ["wellness", "fitness", "spa"] 
    },
    expectedMaxTime: 400,
    description: "Array overlap query on themes"
  },
  {
    name: "Activity filtering",
    filters: { 
      activities: ["yoga", "meditation", "spa_massage"] 
    },
    expectedMaxTime: 400,
    description: "Array overlap query on activities"
  },
  {
    name: "Hotel features - optimized",
    filters: { 
      hotelFeatures: ["wifi", "pool", "gym", "spa"] 
    },
    expectedMaxTime: 300,
    description: "OPTIMIZED: Pre-computed boolean columns instead of JSONB"
  },
  {
    name: "Room features - optimized", 
    filters: { 
      roomFeatures: ["balcony", "kitchen", "air_conditioning"] 
    },
    expectedMaxTime: 300,
    description: "OPTIMIZED: Pre-computed boolean columns instead of JSONB"
  },
  {
    name: "Complex multi-feature query",
    filters: {
      country: "ES",
      minPrice: 1500,
      maxPrice: 3000,
      hotelFeatures: ["wifi", "pool"],
      roomFeatures: ["balcony"],
      affinities: ["wellness"]
    },
    expectedMaxTime: 500,
    description: "Complex query combining multiple filter types"
  },
  {
    name: "Heavy text search with filters",
    filters: {
      searchTerm: "beachfront luxury hotel with spa facilities",
      country: "ES",
      propertyType: "Resort",
      hotelFeatures: ["spa", "pool", "restaurant"]
    },
    expectedMaxTime: 600,
    description: "Text search combined with multiple filters"
  },
  {
    name: "Large feature combination",
    filters: {
      hotelFeatures: ["wifi", "pool", "gym", "spa", "restaurant", "bar", "parking"],
      roomFeatures: ["balcony", "kitchen", "air_conditioning", "safe", "minibar"]
    },
    expectedMaxTime: 400,
    description: "Many feature filters - tests optimized boolean column performance"
  }
];

/**
 * Measure memory usage before and after query execution
 */
function measureMemoryUsage(): number {
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
  }
  return 0;
}

/**
 * Execute a single performance test scenario
 */
async function executePerformanceTest(scenario: typeof PERFORMANCE_TEST_SCENARIOS[0]): Promise<PerformanceResult> {
  const memoryBefore = measureMemoryUsage();
  const startTime = performance.now();
  
  try {
    console.log(`🧪 Testing: ${scenario.name}`);
    
    const { data, error } = await queryOptimizedHotelsWithAdapter(
      scenario.filters,
      { limit: 50, includeCount: false }
    );
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    const memoryAfter = measureMemoryUsage();
    const memoryUsage = memoryAfter - memoryBefore;
    
    if (error) {
      console.error(`❌ ${scenario.name} failed:`, error);
      return {
        scenario: scenario.name,
        executionTime,
        resultsCount: 0,
        success: false,
        error,
        memoryUsage
      };
    }
    
    const success = executionTime <= scenario.expectedMaxTime;
    const status = success ? "✅ PASS" : "⚠️ SLOW";
    
    console.log(`${status} ${scenario.name}: ${executionTime.toFixed(2)}ms (expected: <${scenario.expectedMaxTime}ms) - ${data.length} results`);
    
    return {
      scenario: scenario.name,
      executionTime,
      resultsCount: data.length,
      success,
      memoryUsage
    };
    
  } catch (error) {
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    console.error(`❌ ${scenario.name} error:`, error);
    return {
      scenario: scenario.name,
      executionTime,
      resultsCount: 0,
      success: false,
      error: error as Error,
      memoryUsage: measureMemoryUsage() - memoryBefore
    };
  }
}

/**
 * Test hotel detail query performance
 */
async function testDetailQueryPerformance(): Promise<PerformanceResult> {
  try {
    // Get a hotel ID from basic query first
    const { data: hotels } = await queryOptimizedHotelsWithAdapter({}, { limit: 1 });
    
    if (!hotels || hotels.length === 0) {
      throw new Error("No hotels available for detail test");
    }
    
    const testHotelId = hotels[0].id;
    const startTime = performance.now();
    
    const { data, error } = await queryOptimizedHotelDetailWithAdapter(testHotelId);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    if (error) {
      throw error;
    }
    
    const success = executionTime <= 300; // Expected max 300ms for detail
    console.log(`${success ? "✅ PASS" : "⚠️ SLOW"} Hotel detail query: ${executionTime.toFixed(2)}ms`);
    
    return {
      scenario: "Hotel detail query",
      executionTime,
      resultsCount: data ? 1 : 0,
      success
    };
    
  } catch (error) {
    console.error("❌ Hotel detail performance test failed:", error);
    return {
      scenario: "Hotel detail query",
      executionTime: 0,
      resultsCount: 0,
      success: false,
      error: error as Error
    };
  }
}

/**
 * Test pagination performance with large offset simulation
 */
async function testPaginationPerformance(): Promise<PerformanceResult[]> {
  const paginationTests = [
    { page: 1, description: "First page (cursor: none)" },
    { page: 10, description: "Page 10 simulation" },
    { page: 50, description: "Page 50 simulation" }
  ];
  
  const results: PerformanceResult[] = [];
  let cursor: string | undefined;
  
  for (const test of paginationTests) {
    const startTime = performance.now();
    
    try {
      const { data, error, nextCursor } = await queryOptimizedHotelsWithAdapter(
        {},
        { limit: 50, cursor }
      );
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      if (error) {
        throw error;
      }
      
      cursor = nextCursor; // Use for next iteration
      
      const success = executionTime <= 300;
      console.log(`${success ? "✅ PASS" : "⚠️ SLOW"} Pagination ${test.description}: ${executionTime.toFixed(2)}ms`);
      
      results.push({
        scenario: `Pagination - ${test.description}`,
        executionTime,
        resultsCount: data.length,
        success
      });
      
    } catch (error) {
      console.error(`❌ Pagination test failed for ${test.description}:`, error);
      results.push({
        scenario: `Pagination - ${test.description}`,
        executionTime: 0,
        resultsCount: 0,
        success: false,
        error: error as Error
      });
    }
  }
  
  return results;
}

/**
 * Run complete performance validation suite
 */
export async function runPerformanceValidationSuite(): Promise<PerformanceReport> {
  console.log("🚀 Starting Performance Validation Suite...");
  console.log("📊 Testing optimized adapter against performance targets\n");
  
  const startTime = Date.now();
  const results: PerformanceResult[] = [];
  
  // Test all query scenarios
  for (const scenario of PERFORMANCE_TEST_SCENARIOS) {
    const result = await executePerformanceTest(scenario);
    results.push(result);
    
    // Small delay between tests to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test hotel detail performance
  const detailResult = await testDetailQueryPerformance();
  results.push(detailResult);
  
  // Test pagination performance
  const paginationResults = await testPaginationPerformance();
  results.push(...paginationResults);
  
  // Generate performance report
  const endTime = Date.now();
  const executionTimes = results.map(r => r.executionTime);
  const passedTests = results.filter(r => r.success).length;
  const failedTests = results.length - passedTests;
  
  const report: PerformanceReport = {
    testDate: new Date().toISOString(),
    totalTests: results.length,
    passedTests,
    failedTests,
    averageQueryTime: executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length,
    slowestQuery: results.reduce((prev, current) => 
      prev.executionTime > current.executionTime ? prev : current
    ),
    fastestQuery: results.reduce((prev, current) => 
      prev.executionTime < current.executionTime ? prev : current  
    ),
    results
  };
  
  // Print comprehensive report
  console.log("\n📈 PERFORMANCE VALIDATION REPORT");
  console.log("=====================================");
  console.log(`Test Date: ${report.testDate}`);
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Passed: ${report.passedTests} (${((passedTests/report.totalTests)*100).toFixed(1)}%)`);
  console.log(`Failed: ${report.failedTests} (${((failedTests/report.totalTests)*100).toFixed(1)}%)`);
  console.log(`Average Query Time: ${report.averageQueryTime.toFixed(2)}ms`);
  console.log(`Fastest Query: ${report.fastestQuery.scenario} (${report.fastestQuery.executionTime.toFixed(2)}ms)`);
  console.log(`Slowest Query: ${report.slowestQuery.scenario} (${report.slowestQuery.executionTime.toFixed(2)}ms)`);
  console.log(`Total Suite Time: ${endTime - startTime}ms\n`);
  
  // Performance recommendations
  if (failedTests > 0) {
    console.log("⚠️ PERFORMANCE RECOMMENDATIONS:");
    results.filter(r => !r.success).forEach(result => {
      console.log(`- Optimize: ${result.scenario} (${result.executionTime.toFixed(2)}ms)`);
    });
  }
  
  if (report.averageQueryTime > 350) {
    console.log("⚠️ Average query time exceeds 350ms - consider additional optimizations");
  }
  
  return report;
}

/**
 * Stress test with concurrent queries
 */
export async function runConcurrentStressTest(concurrency = 10): Promise<PerformanceResult[]> {
  console.log(`🧪 Running concurrent stress test with ${concurrency} parallel queries...`);
  
  const testQuery = async (index: number): Promise<PerformanceResult> => {
    const startTime = performance.now();
    
    try {
      const { data, error } = await queryOptimizedHotelsWithAdapter(
        { country: "ES", minPrice: 1000 },
        { limit: 25 }
      );
      
      const endTime = performance.now();
      
      if (error) throw error;
      
      return {
        scenario: `Concurrent query ${index + 1}`,
        executionTime: endTime - startTime,
        resultsCount: data.length,
        success: true
      };
      
    } catch (error) {
      return {
        scenario: `Concurrent query ${index + 1}`,
        executionTime: performance.now() - startTime,
        resultsCount: 0,
        success: false,
        error: error as Error
      };
    }
  };
  
  const startTime = performance.now();
  const promises = Array.from({ length: concurrency }, (_, i) => testQuery(i));
  const results = await Promise.all(promises);
  const endTime = performance.now();
  
  const successCount = results.filter(r => r.success).length;
  const avgTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;
  
  console.log(`✅ Concurrent test complete: ${successCount}/${concurrency} succeeded`);
  console.log(`Average individual query time: ${avgTime.toFixed(2)}ms`);
  console.log(`Total concurrent execution time: ${(endTime - startTime).toFixed(2)}ms`);
  
  return results;
}