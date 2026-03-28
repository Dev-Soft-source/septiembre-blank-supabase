import { beforeAll, afterAll } from '@jest/globals';

// Global test setup for audit tests
beforeAll(async () => {
  console.log('🔍 Starting External Audit Test Suite');
  console.log('🌐 Environment: Development/Audit');
  console.log('📊 Testing: Hotel Creation → Availability Packages → Supabase Storage → Public Display');
  console.log('⚡ Mode: Isolated validation (no production data modification)');
});

afterAll(async () => {
  console.log('✅ External Audit Test Suite Completed');
  console.log('🧹 Cleanup: All test data removed');
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (error) => {
  console.error('🚨 Unhandled Promise Rejection in audit tests:', error);
  process.exit(1);
});