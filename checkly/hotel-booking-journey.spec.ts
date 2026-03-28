/**
 * Checkly Synthetic Tests - Hotel Booking Journey
 * External monitoring with Playwright across multiple regions
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.ENVIRONMENT_URL || 'https://pgdzrvdwgoomjnnegkcn.supabase.co';
const TEST_TIMEOUT = 30000;

// Test user credentials (use test accounts)
const TEST_USERS = {
  regular: {
    email: 'test.user@example.com',
    password: 'TestPassword123!'
  },
  hotel_owner: {
    email: 'test.hotel@example.com', 
    password: 'TestPassword123!'
  },
  admin: {
    email: 'test.admin@example.com',
    password: 'TestPassword123!'
  }
};

test.describe('Hotel Booking Journey - Critical User Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Checkly-Synthetic-Monitor/1.0'
    });
  });

  test('Complete booking flow - Regular user', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);
    
    // Start timing
    const startTime = Date.now();
    
    try {
      // 1. Navigate to homepage
      await page.goto(BASE_URL);
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
      
      // 2. Search for hotels
      await page.fill('[data-testid="search-location"]', 'Madrid');
      await page.click('[data-testid="search-button"]');
      await expect(page.locator('[data-testid="hotel-card"]').first()).toBeVisible({ timeout: 10000 });
      
      // 3. Select a hotel
      await page.click('[data-testid="hotel-card"]');
      await expect(page.locator('[data-testid="hotel-details"]')).toBeVisible();
      
      // 4. Select availability package
      await page.click('[data-testid="package-select"]');
      await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
      
      // 5. Login (required for booking)
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', TEST_USERS.regular.email);
      await page.fill('[data-testid="password-input"]', TEST_USERS.regular.password);
      await page.click('[data-testid="login-submit"]');
      
      // Wait for login success
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });
      
      // 6. Fill booking form
      await page.fill('[data-testid="guest-name"]', 'John Doe');
      await page.fill('[data-testid="guest-phone"]', '+1234567890');
      await page.selectOption('[data-testid="guests-select"]', '2');
      
      // 7. Proceed to payment (sandbox)
      await page.click('[data-testid="proceed-payment"]');
      await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();
      
      // 8. Verify payment screen loads (don't complete payment in test)
      await expect(page.locator('[data-testid="stripe-form"]')).toBeVisible();
      
      // 9. Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.log(`✅ Booking journey completed in ${totalTime}ms`);
      
      // Performance assertion
      expect(totalTime).toBeLessThan(25000); // 25 seconds max
      
    } catch (error) {
      const endTime = Date.now();
      console.error(`❌ Booking journey failed after ${endTime - startTime}ms:`, error);
      
      // Take screenshot on failure
      await page.screenshot({ 
        path: `booking-failure-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });

  test('Hotel owner dashboard access', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);
    
    const startTime = Date.now();
    
    try {
      // 1. Navigate to login
      await page.goto(`${BASE_URL}/panel-hotel`);
      
      // 2. Login as hotel owner
      await page.fill('[data-testid="email-input"]', TEST_USERS.hotel_owner.email);
      await page.fill('[data-testid="password-input"]', TEST_USERS.hotel_owner.password);
      await page.click('[data-testid="login-submit"]');
      
      // 3. Verify dashboard loads
      await expect(page.locator('[data-testid="hotel-dashboard"]')).toBeVisible({ timeout: 15000 });
      
      // 4. Check key dashboard elements
      await expect(page.locator('[data-testid="property-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="booking-list"]')).toBeVisible();
      
      // 5. Test navigation
      await page.click('[data-testid="nav-properties"]');
      await expect(page.locator('[data-testid="properties-page"]')).toBeVisible();
      
      await page.click('[data-testid="nav-bookings"]');
      await expect(page.locator('[data-testid="bookings-page"]')).toBeVisible();
      
      // 6. Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      
      const endTime = Date.now();
      console.log(`✅ Hotel owner dashboard test completed in ${endTime - startTime}ms`);
      
    } catch (error) {
      await page.screenshot({ path: `hotel-dashboard-failure-${Date.now()}.png`, fullPage: true });
      throw error;
    }
  });

  test('Admin panel access and functionality', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);
    
    const startTime = Date.now();
    
    try {
      // 1. Navigate to admin login
      await page.goto(`${BASE_URL}/entrada-admin`);
      
      // 2. Login as admin
      await page.fill('[data-testid="admin-email"]', TEST_USERS.admin.email);
      await page.fill('[data-testid="admin-password"]', TEST_USERS.admin.password);
      await page.click('[data-testid="admin-login-submit"]');
      
      // 3. Verify admin panel loads
      await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible({ timeout: 15000 });
      
      // 4. Check admin functionality
      await expect(page.locator('[data-testid="pending-hotels"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-management"]')).toBeVisible();
      
      // 5. Test navigation
      await page.click('[data-testid="nav-hotels"]');
      await expect(page.locator('[data-testid="hotels-management"]')).toBeVisible();
      
      await page.click('[data-testid="nav-users"]');
      await expect(page.locator('[data-testid="users-management"]')).toBeVisible();
      
      // 6. Logout
      await page.click('[data-testid="admin-logout"]');
      
      const endTime = Date.now();
      console.log(`✅ Admin panel test completed in ${endTime - startTime}ms`);
      
    } catch (error) {
      await page.screenshot({ path: `admin-panel-failure-${Date.now()}.png`, fullPage: true });
      throw error;
    }
  });

  test('API health and performance check', async ({ page }) => {
    const startTime = Date.now();
    
    try {
      // Test critical API endpoints
      const apiTests = [
        { url: `${BASE_URL}/api/health`, expectedStatus: 200 },
        { url: `${BASE_URL}/functions/v1/get-hotel-overview`, expectedStatus: 200 },
        { url: `${BASE_URL}/functions/v1/security-metrics?action=metrics`, expectedStatus: 200 }
      ];
      
      for (const test of apiTests) {
        const response = await page.request.get(test.url);
        expect(response.status()).toBe(test.expectedStatus);
        
        const responseTime = Date.now() - startTime;
        expect(responseTime).toBeLessThan(5000); // 5 seconds max per API call
        
        console.log(`✅ API ${test.url} responded in ${responseTime}ms`);
      }
      
    } catch (error) {
      console.error('❌ API health check failed:', error);
      throw error;
    }
  });

  test('Security headers verification', async ({ page }) => {
    try {
      const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      // Check for security headers
      const headers = response?.headers() || {};
      
      // Content Security Policy
      expect(headers['content-security-policy'] || headers['x-content-security-policy']).toBeTruthy();
      
      // Frame protection
      expect(headers['x-frame-options']).toBeTruthy();
      
      // Content type protection
      expect(headers['x-content-type-options']).toBe('nosniff');
      
      console.log('✅ Security headers verification passed');
      
    } catch (error) {
      console.error('❌ Security headers check failed:', error);
      throw error;
    }
  });

});

// Performance thresholds
test.describe('Performance Monitoring', () => {
  
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // 3 seconds max initial load
    
    // Check Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries.map(entry => ({
            name: entry.name,
            value: entry.value || entry.duration,
            entryType: entry.entryType
          })));
        }).observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve([]), 5000);
      });
    });
    
    console.log('Performance metrics:', performanceMetrics);
    console.log(`✅ Page loaded in ${loadTime}ms`);
  });
  
});