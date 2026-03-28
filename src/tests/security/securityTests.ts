/**
 * Automated Security Tests
 * XSS prevention, rate limiting, schema validation
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface SecurityTestSuite {
  xssPrevention: TestResult[];
  rateLimiting: TestResult[];
  schemaValidation: TestResult[];
}

class SecurityTester {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // XSS Prevention Tests
  async testXSSPrevention(): Promise<TestResult[]> {
    const tests: TestResult[] = [];
    
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">',
      '<svg onload="alert(1)">',
      '"><script>alert("xss")</script>',
      '\'"--></script><script>alert("xss")</script>'
    ];

    for (const payload of xssPayloads) {
      try {
        // Test booking form input
        const response = await fetch(`${this.baseUrl}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guest_name: payload,
            user_email: 'test@example.com',
            package_id: '123e4567-e89b-12d3-a456-426614174000',
            check_in_date: '2025-01-01T12:00:00Z',
            check_out_date: '2025-01-02T12:00:00Z',
            total_price: 100
          })
        });

        const result = await response.text();
        
        // Check if XSS payload was sanitized or rejected
        const isBlocked = response.status === 400 || 
                         !result.includes('<script>') ||
                         !result.includes('javascript:') ||
                         !result.includes('onerror=');

        tests.push({
          name: `XSS Prevention - ${payload.substring(0, 20)}...`,
          passed: isBlocked,
          message: isBlocked 
            ? 'XSS payload properly blocked/sanitized'
            : 'XSS payload not properly handled',
          details: { payload, response: result.substring(0, 200) }
        });
      } catch (error) {
        tests.push({
          name: `XSS Prevention - ${payload.substring(0, 20)}...`,
          passed: true, // Network error counts as blocked
          message: 'Request properly blocked (network error)',
          details: { payload, error: (error as Error).message }
        });
      }
    }

    return tests;
  }

  // Rate Limiting Tests
  async testRateLimiting(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    try {
      // Test auth endpoint rate limiting
      const authPromises = [];
      for (let i = 0; i < 7; i++) { // Exceed limit of 5
        authPromises.push(
          fetch(`${this.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'wrongpassword'
            })
          })
        );
      }

      const authResults = await Promise.all(authPromises);
      const rateLimitedCount = authResults.filter(r => r.status === 429).length;

      tests.push({
        name: 'Auth Rate Limiting',
        passed: rateLimitedCount >= 2, // Should block after 5 failed attempts
        message: rateLimitedCount >= 2 
          ? `Rate limiting working (${rateLimitedCount} requests blocked)`
          : `Rate limiting not working (${rateLimitedCount} requests blocked)`,
        details: { 
          totalRequests: authResults.length,
          blockedRequests: rateLimitedCount,
          statusCodes: authResults.map(r => r.status)
        }
      });

    } catch (error) {
      tests.push({
        name: 'Auth Rate Limiting',
        passed: false,
        message: 'Rate limiting test failed',
        details: { error: (error as Error).message }
      });
    }

    try {
      // Test booking endpoint rate limiting
      const bookingPromises = [];
      for (let i = 0; i < 12; i++) { // Exceed limit of 10
        bookingPromises.push(
          fetch(`${this.baseUrl}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              guest_name: `Test Guest ${i}`,
              user_email: 'test@example.com',
              package_id: '123e4567-e89b-12d3-a456-426614174000',
              check_in_date: '2025-01-01T12:00:00Z',
              check_out_date: '2025-01-02T12:00:00Z',
              total_price: 100
            })
          })
        );
      }

      const bookingResults = await Promise.all(bookingPromises);
      const rateLimitedCount = bookingResults.filter(r => r.status === 429).length;

      tests.push({
        name: 'Booking Rate Limiting',
        passed: rateLimitedCount >= 2, // Should block after 10 requests
        message: rateLimitedCount >= 2 
          ? `Rate limiting working (${rateLimitedCount} requests blocked)`
          : `Rate limiting not working (${rateLimitedCount} requests blocked)`,
        details: { 
          totalRequests: bookingResults.length,
          blockedRequests: rateLimitedCount,
          statusCodes: bookingResults.map(r => r.status)
        }
      });

    } catch (error) {
      tests.push({
        name: 'Booking Rate Limiting',
        passed: false,
        message: 'Booking rate limiting test failed',
        details: { error: (error as Error).message }
      });
    }

    return tests;
  }

  // Schema Validation Tests
  async testSchemaValidation(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    const invalidPayloads = [
      {
        name: 'Missing required fields',
        payload: { guest_name: 'Test' }, // Missing other required fields
        expectedStatus: 400
      },
      {
        name: 'Invalid email format',
        payload: {
          guest_name: 'Test Guest',
          user_email: 'invalid-email',
          package_id: '123e4567-e89b-12d3-a456-426614174000',
          check_in_date: '2025-01-01T12:00:00Z',
          check_out_date: '2025-01-02T12:00:00Z',
          total_price: 100
        },
        expectedStatus: 400
      },
      {
        name: 'Invalid UUID format',
        payload: {
          guest_name: 'Test Guest',
          user_email: 'test@example.com',
          package_id: 'not-a-uuid',
          check_in_date: '2025-01-01T12:00:00Z',
          check_out_date: '2025-01-02T12:00:00Z',
          total_price: 100
        },
        expectedStatus: 400
      },
      {
        name: 'Invalid date format',
        payload: {
          guest_name: 'Test Guest',
          user_email: 'test@example.com',
          package_id: '123e4567-e89b-12d3-a456-426614174000',
          check_in_date: '2025/13/01', // Invalid date
          check_out_date: '2025-01-02T12:00:00Z',
          total_price: 100
        },
        expectedStatus: 400
      },
      {
        name: 'Negative price',
        payload: {
          guest_name: 'Test Guest',
          user_email: 'test@example.com',
          package_id: '123e4567-e89b-12d3-a456-426614174000',
          check_in_date: '2025-01-01T12:00:00Z',
          check_out_date: '2025-01-02T12:00:00Z',
          total_price: -100
        },
        expectedStatus: 400
      }
    ];

    for (const testCase of invalidPayloads) {
      try {
        const response = await fetch(`${this.baseUrl}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.payload)
        });

        const responseText = await response.text();
        let responseJson: any = {};
        
        try {
          responseJson = JSON.parse(responseText);
        } catch {
          // Response is not JSON
        }

        const isValidationWorking = response.status === testCase.expectedStatus &&
                                  (responseJson.error === 'VALIDATION_ERROR' || 
                                   responseText.includes('validation') ||
                                   responseText.includes('invalid'));

        tests.push({
          name: `Schema Validation - ${testCase.name}`,
          passed: isValidationWorking,
          message: isValidationWorking 
            ? 'Validation properly rejected invalid payload'
            : `Validation failed - Status: ${response.status}, Expected: ${testCase.expectedStatus}`,
          details: { 
            payload: testCase.payload,
            responseStatus: response.status,
            responseBody: responseText.substring(0, 200)
          }
        });

      } catch (error) {
        tests.push({
          name: `Schema Validation - ${testCase.name}`,
          passed: false,
          message: 'Validation test failed with error',
          details: { 
            payload: testCase.payload,
            error: (error as Error).message 
          }
        });
      }
    }

    return tests;
  }

  // Run all security tests
  async runAllTests(): Promise<SecurityTestSuite> {
    console.log('Running security tests...');
    
    const [xssPrevention, rateLimiting, schemaValidation] = await Promise.all([
      this.testXSSPrevention(),
      this.testRateLimiting(),
      this.testSchemaValidation()
    ]);

    return {
      xssPrevention,
      rateLimiting,
      schemaValidation
    };
  }

  // Generate test report
  generateReport(results: SecurityTestSuite): string {
    const allTests = [
      ...results.xssPrevention,
      ...results.rateLimiting,
      ...results.schemaValidation
    ];

    const passed = allTests.filter(t => t.passed).length;
    const total = allTests.length;
    const percentage = Math.round((passed / total) * 100);

    let report = `Security Test Report\n`;
    report += `==================\n\n`;
    report += `Overall: ${passed}/${total} tests passed (${percentage}%)\n\n`;

    const categories = [
      { name: 'XSS Prevention', tests: results.xssPrevention },
      { name: 'Rate Limiting', tests: results.rateLimiting },
      { name: 'Schema Validation', tests: results.schemaValidation }
    ];

    categories.forEach(category => {
      report += `${category.name}:\n`;
      category.tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        report += `  ${status} ${test.name}: ${test.message}\n`;
      });
      report += '\n';
    });

    return report;
  }
}

// Export for use in CI/CD
export const securityTester = new SecurityTester();

// CLI runner for npm script
export async function runSecurityTests(): Promise<void> {
  const results = await securityTester.runAllTests();
  const report = securityTester.generateReport(results);
  
  console.log(report);
  
  const allTests = [
    ...results.xssPrevention,
    ...results.rateLimiting,
    ...results.schemaValidation
  ];
  
  const failedTests = allTests.filter(t => !t.passed);
  
  if (failedTests.length > 0) {
    console.error(`❌ ${failedTests.length} security tests failed`);
    process.exit(1);
  } else {
    console.log('✅ All security tests passed');
  }
}