/**
 * Adapter Performance Comparative Testing Suite
 * Compares old vs optimized adapter performance
 */

import { supabase } from "@/integrations/supabase/client";
import { queryOptimizedHotelsWithAdapter } from "@/adapters/optimized-query-adapter";

export interface PerformanceComparison {
  testName: string;
  oldVersion: {
    executionTime: number;
    resultCount: number;
    queryComplexity: string;
  };
  optimizedVersion: {
    executionTime: number;
    resultCount: number;
    queryComplexity: string;
  };
  improvement: {
    timeReduction: number;
    percentageImprovement: number;
    consistencyCheck: boolean;
  };
}

export interface FilterTestCase {
  name: string;
  filters: {
    themes?: string[];
    activities?: string[];
    months?: string[];
    propertyStyle?: string[];
    country?: string;
    destination?: string;
  };
  expectedMinResults?: number;
}

const testCases: FilterTestCase[] = [
  {
    name: "Theme Filter - Romantic",
    filters: { themes: ["romantic"] },
    expectedMinResults: 1
  },
  {
    name: "Activity Filter - Spa & Wellness",
    filters: { activities: ["spa", "wellness"] },
    expectedMinResults: 1
  },
  {
    name: "Month Filter - December",
    filters: { months: ["december"] },
    expectedMinResults: 1
  },
  {
    name: "Property Style Filter - Boutique Hotel",
    filters: { propertyStyle: ["boutique_hotel"] },
    expectedMinResults: 1
  },
  {
    name: "Combined Filter - Romantic + Spa + December",
    filters: { 
      themes: ["romantic"], 
      activities: ["spa"], 
      months: ["december"] 
    },
    expectedMinResults: 0
  },
  {
    name: "Country Filter - Spain",
    filters: { country: "Spain" },
    expectedMinResults: 1
  },
  {
    name: "Complex Multi-Filter",
    filters: {
      themes: ["adventure", "family"],
      activities: ["outdoor", "cultural"],
      months: ["july", "august"],
      country: "Portugal"
    },
    expectedMinResults: 0
  }
];

class LegacyHotelAdapter {
  /**
   * Simulates old adapter behavior with multiple queries
   */
  async searchHotels(filters: FilterTestCase['filters']) {
    const startTime = performance.now();
    
    // Old approach: Multiple separate queries with JSONB intersections
    let query = supabase
      .from('hotels')
      .select(`
        *,
        hotel_themes(themes(name)),
        hotel_activities(activities(name)),
        hotel_months(months(name)),
        hotel_property_styles(property_styles(name))
      `)
      .eq('status', 'active');

    // Multiple JSONB intersection queries (inefficient)
    if (filters.themes?.length) {
      for (const theme of filters.themes) {
        query = query.contains('themes', [theme]);
      }
    }
    
    if (filters.activities?.length) {
      for (const activity of filters.activities) {
        query = query.contains('activities', [activity]);
      }
    }
    
    if (filters.months?.length) {
      for (const month of filters.months) {
        query = query.contains('available_months', [month]);
      }
    }
    
    if (filters.propertyStyle?.length) {
      for (const style of filters.propertyStyle) {
        query = query.contains('property_style', [style]);
      }
    }
    
    if (filters.country) {
      query = query.eq('country', filters.country);
    }
    
    if (filters.destination) {
      query = query.ilike('destination', `%${filters.destination}%`);
    }

    const { data, error } = await query.limit(50);
    const endTime = performance.now();
    
    if (error) throw error;
    
    return {
      data: data || [],
      executionTime: endTime - startTime,
      queryComplexity: 'Multiple JSONB intersections + JOIN operations'
    };
  }
}

export class AdapterPerformanceComparator {
  private legacyAdapter: LegacyHotelAdapter;
  
  constructor() {
    this.legacyAdapter = new LegacyHotelAdapter();
  }
  
  async runPerformanceComparison(): Promise<PerformanceComparison[]> {
    const results: PerformanceComparison[] = [];
    
    console.log('🚀 Starting Adapter Performance Comparison...');
    
    for (const testCase of testCases) {
      console.log(`📊 Testing: ${testCase.name}`);
      
      try {
        // Test legacy adapter
        const legacyResult = await this.legacyAdapter.searchHotels(testCase.filters);
        
        // Test optimized adapter - convert filters to match FilterState
        const optimizedStartTime = performance.now();
        const adaptedFilters = {
          ...testCase.filters,
          propertyStyle: testCase.filters.propertyStyle?.[0] || undefined
        };
        const optimizedResponse = await queryOptimizedHotelsWithAdapter(adaptedFilters, { limit: 50 });
        const optimizedEndTime = performance.now();
        
        const optimizedResult = {
          data: optimizedResponse.data || [],
          executionTime: optimizedEndTime - optimizedStartTime,
          queryComplexity: 'Single optimized view query'
        };
        
        // Compare results
        const timeReduction = legacyResult.executionTime - optimizedResult.executionTime;
        const percentageImprovement = legacyResult.executionTime > 0 ? (timeReduction / legacyResult.executionTime) * 100 : 0;
        
        // Consistency check - results should be similar
        const consistencyCheck = Math.abs(legacyResult.data.length - optimizedResult.data.length) <= 2;
        
        const comparison: PerformanceComparison = {
          testName: testCase.name,
          oldVersion: {
            executionTime: legacyResult.executionTime,
            resultCount: legacyResult.data.length,
            queryComplexity: legacyResult.queryComplexity
          },
          optimizedVersion: {
            executionTime: optimizedResult.executionTime,
            resultCount: optimizedResult.data.length,
            queryComplexity: 'Single optimized view query'
          },
          improvement: {
            timeReduction,
            percentageImprovement,
            consistencyCheck
          }
        };
        
        results.push(comparison);
        
        console.log(`✅ ${testCase.name}: ${percentageImprovement.toFixed(1)}% improvement`);
        
      } catch (error) {
        console.error(`❌ Error testing ${testCase.name}:`, error);
        
        results.push({
          testName: testCase.name,
          oldVersion: { executionTime: 0, resultCount: 0, queryComplexity: 'Error' },
          optimizedVersion: { executionTime: 0, resultCount: 0, queryComplexity: 'Error' },
          improvement: { timeReduction: 0, percentageImprovement: 0, consistencyCheck: false }
        });
      }
    }
    
    return results;
  }
  
  generatePerformanceReport(results: PerformanceComparison[]): string {
    const successfulTests = results.filter(r => r.improvement.consistencyCheck);
    const avgImprovement = successfulTests.reduce((sum, r) => sum + r.improvement.percentageImprovement, 0) / successfulTests.length;
    
    let report = `
# Adapter Performance Comparison Report

## Executive Summary
- Total Tests: ${results.length}
- Successful Tests: ${successfulTests.length}
- Average Performance Improvement: ${avgImprovement.toFixed(1)}%

## Detailed Results

`;
    
    results.forEach(result => {
      report += `
### ${result.testName}

**Legacy Adapter:**
- Execution Time: ${result.oldVersion.executionTime.toFixed(2)}ms
- Result Count: ${result.oldVersion.resultCount}
- Query Complexity: ${result.oldVersion.queryComplexity}

**Optimized Adapter:**
- Execution Time: ${result.optimizedVersion.executionTime.toFixed(2)}ms
- Result Count: ${result.optimizedVersion.resultCount}
- Query Complexity: ${result.optimizedVersion.queryComplexity}

**Improvement:**
- Time Reduction: ${result.improvement.timeReduction.toFixed(2)}ms
- Performance Gain: ${result.improvement.percentageImprovement.toFixed(1)}%
- Results Consistent: ${result.improvement.consistencyCheck ? '✅' : '❌'}

---
`;
    });
    
    return report;
  }
}

// Export for use in tests
export async function runAdapterPerformanceComparison() {
  const comparator = new AdapterPerformanceComparator();
  const results = await comparator.runPerformanceComparison();
  const report = comparator.generatePerformanceReport(results);
  
  console.log(report);
  return { results, report };
}