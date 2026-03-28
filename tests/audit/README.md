# External Audit Test Suite

This directory contains automated validation tests for the hotel-living-audit repository. These tests verify the core booking and availability cycle without modifying existing functionality.

## Overview

The audit test suite validates the complete data flow:

1. **Hotel Creation** → Hotel registration with themes and activities
2. **Availability Packages** → Package creation with different durations (8/15/22/29 days)  
3. **Supabase Storage** → Data persistence and relationship integrity
4. **Public Display** → Public visibility of approved hotels and packages

## Test Files

- `hotel-creation.test.ts` - Validates hotel registration process
- `availability-packages.test.ts` - Tests package creation with various durations
- `supabase-storage.test.ts` - Verifies data persistence and RLS policies
- `public-display.test.ts` - Confirms public visibility and complete data flow

## Prerequisites

```bash
npm install --save-dev jest ts-jest @types/jest
```

## Running Tests

### Individual Test Files
```bash
npx jest tests/audit/hotel-creation.test.ts --config=tests/audit/jest.config.js
npx jest tests/audit/availability-packages.test.ts --config=tests/audit/jest.config.js
npx jest tests/audit/supabase-storage.test.ts --config=tests/audit/jest.config.js
npx jest tests/audit/public-display.test.ts --config=tests/audit/jest.config.js
```

### Complete Audit Suite
```bash
node tests/audit/run-audit.js
```

## Test Isolation

All tests:
- Create temporary test data with unique identifiers
- Clean up all test data after completion
- Do not modify existing hotels, packages, or user data
- Use dedicated test email addresses with timestamps

## Validation Points

### Hotel Registration
- ✅ Hotel record creation via `submit_hotel_registration` function
- ✅ Theme and activity associations 
- ✅ Data persistence in Supabase tables
- ✅ RLS policy enforcement

### Availability Packages  
- ✅ Package creation with 8, 15, 22, 29-day durations
- ✅ Room allocation and availability tracking
- ✅ Occupancy mode validation (single/double)
- ✅ Price structure verification

### Supabase Storage
- ✅ Direct table access validation
- ✅ Public view accessibility 
- ✅ Relationship integrity (themes, activities)
- ✅ RLS policy compliance

### Public Display
- ✅ Approved hotel visibility in public views
- ✅ Package availability for approved hotels
- ✅ Complete data flow from creation to display
- ✅ All required fields present for booking

## Output

The test runner generates:
- Console output with detailed test results
- `audit-report.json` with complete validation summary
- Coverage reports in `coverage/audit/` directory

## Security Compliance

- Tests run with temporary authentication
- No production data modification
- All test data is automatically cleaned up
- Validates security policies without bypassing them

## External Audit Usage

External auditors can:

1. Clone the hotel-living-audit repository
2. Install dependencies: `npm install`
3. Run the complete audit: `node tests/audit/run-audit.js`
4. Review the generated `audit-report.json`
5. Verify console logs for detailed validation steps

The test suite provides comprehensive validation that the core booking system functions correctly and securely.