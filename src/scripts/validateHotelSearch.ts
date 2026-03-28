/**
 * Hotel Search Validation Script
 * Run this script to validate the restored hotel search functionality
 * Usage: Import and call validateHotelSearch() in your component or run via console
 */

import { hotelSearchService } from '@/hotel/services/HotelSearchService';

interface ValidationResult {
  test: string;
  passed: boolean;
  error?: string;
  duration?: number;
  resultCount?: number;
}

export class HotelSearchValidator {
  
  private results: ValidationResult[] = [];

  private addResult(test: string, passed: boolean, error?: string, duration?: number, resultCount?: number) {
    this.results.push({ test, passed, error, duration, resultCount });
  }

  private async runWithTimer<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await fn();
    const duration = Date.now() - startTime;
    return { result, duration };
  }

  /**
   * Test input validation
   */
  async validateInputHandling(): Promise<void> {
    console.log('🔍 Testing input validation...');

    // Test empty search terms
    try {
      const { result, duration } = await this.runWithTimer(() => 
        hotelSearchService.searchByText('', 10)
      );
      
      if (Array.isArray(result) && result.length === 0) {
        this.addResult('Empty search term handling', true, undefined, duration, result.length);
      } else {
        this.addResult('Empty search term handling', false, 'Should return empty array for empty search');
      }
    } catch (error) {
      this.addResult('Empty search term handling', false, `Error: ${error}`);
    }

    // Test special characters
    try {
      const specialChars = ['<script>', '%', '"', "'"];
      let allPassed = true;
      let totalDuration = 0;

      for (const char of specialChars) {
        const { result, duration } = await this.runWithTimer(() =>
          hotelSearchService.searchByText(char, 5)
        );
        totalDuration += duration;
        
        if (!Array.isArray(result)) {
          allPassed = false;
          break;
        }
      }

      this.addResult('Special character handling', allPassed, undefined, totalDuration);
    } catch (error) {
      this.addResult('Special character handling', false, `Error: ${error}`);
    }
  }

  /**
   * Test functional correctness
   */
  async validateFunctionalCorrectness(): Promise<void> {
    console.log('🎯 Testing functional correctness...');

    // Test basic search functionality
    try {
      const { result, duration } = await this.runWithTimer(() =>
        hotelSearchService.searchByText('hotel', 10)
      );

      if (Array.isArray(result)) {
        let structureValid = true;
        if (result.length > 0) {
          const requiredFields = ['id', 'name', 'city', 'country', 'price_per_month'];
          structureValid = requiredFields.every(field => 
            result[0].hasOwnProperty(field)
          );
        }
        
        this.addResult(
          'Basic search functionality', 
          structureValid, 
          structureValid ? undefined : 'Invalid result structure',
          duration,
          result.length
        );
      } else {
        this.addResult('Basic search functionality', false, 'Result is not an array');
      }
    } catch (error) {
      this.addResult('Basic search functionality', false, `Error: ${error}`);
    }

    // Test duplicate removal
    try {
      const { result, duration } = await this.runWithTimer(() =>
        hotelSearchService.searchByText('test', 20)
      );

      if (Array.isArray(result)) {
        const ids = result.map(hotel => hotel.id);
        const uniqueIds = [...new Set(ids)];
        const noDuplicates = ids.length === uniqueIds.length;
        
        this.addResult(
          'Duplicate removal',
          noDuplicates,
          noDuplicates ? undefined : 'Found duplicate results',
          duration,
          result.length
        );
      }
    } catch (error) {
      this.addResult('Duplicate removal', false, `Error: ${error}`);
    }

    // Test limit parameter
    try {
      const limits = [1, 5, 10];
      let allPassed = true;
      let totalDuration = 0;

      for (const limit of limits) {
        const { result, duration } = await this.runWithTimer(() =>
          hotelSearchService.searchByText('hotel', limit)
        );
        totalDuration += duration;
        
        if (!Array.isArray(result) || result.length > limit) {
          allPassed = false;
          break;
        }
      }

      this.addResult('Limit parameter respect', allPassed, undefined, totalDuration);
    } catch (error) {
      this.addResult('Limit parameter respect', false, `Error: ${error}`);
    }
  }

  /**
   * Test advanced search
   */
  async validateAdvancedSearch(): Promise<void> {
    console.log('🔧 Testing advanced search...');

    try {
      const criteria = {
        name: 'hotel',
        minPrice: 100,
        maxPrice: 5000,
        limit: 10
      };

      const { result, duration } = await this.runWithTimer(() =>
        hotelSearchService.advancedSearch(criteria)
      );

      if (Array.isArray(result)) {
        let priceFilterValid = true;
        
        if (result.length > 0) {
          priceFilterValid = result.every(hotel => {
            return !hotel.price_per_month || 
              (hotel.price_per_month >= criteria.minPrice && 
               hotel.price_per_month <= criteria.maxPrice);
          });
        }

        this.addResult(
          'Advanced search functionality',
          priceFilterValid,
          priceFilterValid ? undefined : 'Price filtering not working correctly',
          duration,
          result.length
        );
      } else {
        this.addResult('Advanced search functionality', false, 'Result is not an array');
      }
    } catch (error) {
      this.addResult('Advanced search functionality', false, `Error: ${error}`);
    }
  }

  /**
   * Test performance
   */
  async validatePerformance(): Promise<void> {
    console.log('⚡ Testing performance...');

    // Test single search performance
    try {
      const { result, duration } = await this.runWithTimer(() =>
        hotelSearchService.searchByText('hotel', 10)
      );

      const performanceGood = duration < 5000; // 5 second limit
      this.addResult(
        'Single search performance',
        performanceGood,
        performanceGood ? undefined : `Too slow: ${duration}ms`,
        duration,
        Array.isArray(result) ? result.length : 0
      );
    } catch (error) {
      this.addResult('Single search performance', false, `Error: ${error}`);
    }

    // Test concurrent search performance
    try {
      const startTime = Date.now();
      
      const searchPromises = [
        hotelSearchService.searchByText('hotel', 5),
        hotelSearchService.searchByText('resort', 5),
        hotelSearchService.advancedSearch({ name: 'test', limit: 5 })
      ];

      const results = await Promise.all(searchPromises);
      const duration = Date.now() - startTime;

      const allArrays = results.every(result => Array.isArray(result));
      const performanceGood = duration < 10000; // 10 second limit for concurrent
      
      this.addResult(
        'Concurrent search performance',
        allArrays && performanceGood,
        !allArrays ? 'Not all results are arrays' : 
          !performanceGood ? `Too slow: ${duration}ms` : undefined,
        duration,
        results.reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
      );
    } catch (error) {
      this.addResult('Concurrent search performance', false, `Error: ${error}`);
    }
  }

  /**
   * Test integration with existing system
   */
  async validateIntegration(): Promise<void> {
    console.log('🔗 Testing integration...');

    // Test with filter system
    try {
      const filters = {
        searchTerm: 'hotel',
        country: 'Spain',
        minPrice: 500,
        maxPrice: 3000
      };

      const { result, duration } = await this.runWithTimer(() =>
        hotelSearchService.searchHotels(filters as any)
      );

      this.addResult(
        'Filter system integration',
        Array.isArray(result),
        Array.isArray(result) ? undefined : 'Filter integration failed',
        duration,
        Array.isArray(result) ? result.length : 0
      );
    } catch (error) {
      this.addResult('Filter system integration', false, `Error: ${error}`);
    }

    // Test UI format conversion
    try {
      const { result: searchResults } = await this.runWithTimer(() =>
        hotelSearchService.searchByText('test', 3)
      );

      if (Array.isArray(searchResults) && searchResults.length > 0) {
        const converted = hotelSearchService.convertToUIFormat(searchResults[0]);
        const hasRequiredFields = converted && 
          converted.hasOwnProperty('id') &&
          converted.hasOwnProperty('name') &&
          converted.hasOwnProperty('location') &&
          converted.hasOwnProperty('thumbnail');

        this.addResult(
          'UI format conversion',
          hasRequiredFields,
          hasRequiredFields ? undefined : 'UI conversion missing required fields'
        );
      } else {
        this.addResult('UI format conversion', true, 'No results to test conversion');
      }
    } catch (error) {
      this.addResult('UI format conversion', false, `Error: ${error}`);
    }
  }

  /**
   * Run all validation tests
   */
  async runAllTests(): Promise<ValidationResult[]> {
    console.log('🚀 Starting Hotel Search Validation...\n');

    this.results = [];

    await this.validateInputHandling();
    await this.validateFunctionalCorrectness();
    await this.validateAdvancedSearch();
    await this.validatePerformance();
    await this.validateIntegration();

    return this.results;
  }

  /**
   * Print validation results
   */
  printResults(): void {
    console.log('\n📊 Validation Results:');
    console.log('═══════════════════════════════════════════════════════════════');

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      const duration = result.duration ? ` (${result.duration}ms)` : '';
      const count = result.resultCount !== undefined ? ` [${result.resultCount} results]` : '';
      
      console.log(`${status} ${result.test}${duration}${count}`);
      
      if (!result.passed && result.error) {
        console.log(`   ⚠️  ${result.error}`);
      }
    });

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📈 Summary: ${passed}/${total} tests passed (${((passed/total)*100).toFixed(1)}%)`);

    if (passed === total) {
      console.log('🎉 All tests passed! Hotel search functionality is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.');
    }
  }
}

/**
 * Main validation function - call this to run all tests
 */
export const validateHotelSearch = async (): Promise<ValidationResult[]> => {
  const validator = new HotelSearchValidator();
  const results = await validator.runAllTests();
  validator.printResults();
  return results;
};

/**
 * Quick performance benchmark
 */
export const runQuickBenchmark = async (): Promise<void> => {
  console.log('🏃‍♂️ Running Quick Performance Benchmark...');
  
  const searchTerms = ['hotel', 'resort', 'paris'];
  
  for (const term of searchTerms) {
    const startTime = Date.now();
    const results = await hotelSearchService.searchByText(term, 10);
    const duration = Date.now() - startTime;
    
    console.log(`  ${term}: ${duration}ms (${results.length} results)`);
  }
};

// Export for console usage
if (typeof window !== 'undefined') {
  (window as any).validateHotelSearch = validateHotelSearch;
  (window as any).runQuickBenchmark = runQuickBenchmark;
}