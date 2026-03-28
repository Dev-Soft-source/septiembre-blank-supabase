# Hotel Living API v2 Master Document

## Document Overview

This document provides the complete specification for Hotel Living's API v2, covering all dashboard functionalities, business rules, data models, and implementation requirements across Spanish, English, Portuguese, and Romanian languages.

**Base URL:** All API endpoints are served under `/api/v2`. All paths in this document are relative to this base URL.

**Currency:** All prices are in INTEGER USD format (no decimals). Dynamic pricing always rounds up to the nearest `round_step`.

**Dates:** All dates and timestamps use UTC format (ISO-8601).

**Languages:** All user-facing text supports ES/EN/PT/RO with mandatory validation.

## Table of Contents

1. [Dashboard Inventory Analysis](#dashboard-inventory-analysis)
2. [API v2 Endpoint Map](#api-v2-endpoint-map)
3. [Data Model Schema](#data-model-schema)
4. [Business Rules & Constraints](#business-rules--constraints)
5. [Internationalization (i18n)](#internationalization-i18n)
6. [Authorization Matrix](#authorization-matrix)
7. [Commission Structure](#commission-structure)
8. [Three Free Nights Program](#three-free-nights-program)
9. [OpenAPI 3.1 Specification](#openapi-31-specification)
10. [Implementation & Test Plan](#implementation--test-plan)

## Dashboard Inventory Analysis

### Administrator Dashboard

**Data Displayed:**
- Hotel approval queue with status filtering
- User management with role assignment
- Booking analytics and revenue metrics
- System health and audit logs
- Commission tracking and payments
- Three Free Nights program monitoring
- Failed notification tracking

**Actions Available:**
- Approve/reject hotel submissions
- Modify user roles (single role per user via `profiles.role`)
- Process commission payments
- View and export system reports
- Manage translations and content
- Monitor Three Free Nights redemptions
- Review audit trail for all state transitions

**Current Sources:**
- Files: `src/components/admin/`, `src/hooks/useUserRoles.ts`
- Tables: `admin_users`, `profiles`, `hotels`, `bookings`, `agent_commissions`, `free_nights_rewards`, `audit_logs`
- Queries: Admin-specific RLS policies

**Business Rules:**
- Only admin users can access administrative functions
- Hotel approval requires valid images
- Commission calculations are immutable once paid
- All prices stored as INTEGER USD
- All admin actions logged to audit trail

### Regular User Dashboard

**Data Displayed:**
- Personal booking history with derived hotel information
- Favorite hotels list
- Available packages for selected dates
- Pricing with dynamic adjustments (rounded up to nearest `round_step`)
- Booking status and confirmations
- Three Free Nights status (if eligible)

**Actions Available:**
- Search and filter hotels with standardized pagination
- Book availability packages with `guest_count`
- Manage favorites
- View booking details
- Cancel bookings (within policy)
- Redeem Three Free Nights (if available)

**Current Sources:**
- Files: `src/components/dashboard/`, `src/hooks/useBookingOperations.ts`
- Tables: `profiles`, `bookings`, `favorites`, `availability_packages`, `free_nights_rewards`
- Queries: User-specific RLS policies

**Business Rules:**
- Users can only view/modify their own data
- Bookings require valid package availability with concurrency protection
- Cancellations restore package availability using row locks
- Hotel information derived from `package_id` (no direct `hotel_id` in bookings)
- All prices in INTEGER USD format

### Hotel Owner Dashboard

**Data Displayed:**
- Hotel registration form with validation
- Availability package management with pricing controls
- Booking calendar and occupancy
- Revenue analytics (INTEGER USD)
- Guest management interface
- Three Free Nights benefit status

**Actions Available:**
- Register and edit hotel details with idempotency
- Create/modify availability packages with weekday validation
- Set pricing (`base_price_usd`, `price_increase_pct`, `round_step`); Hotels enter per-room prices in the “Add New Property/Package” forms (per-person is display-only).
- View booking reports
- Manage hotel images and descriptions
- Redeem Three Free Nights benefit

**Current Sources:**
- Files: `src/components/dashboard/hotel-registration/`, `src/hooks/useAvailabilityPackages.ts`
- Tables: `hotels`, `availability_packages`, `hotel_images`, `bookings`, `free_nights_rewards`
- Queries: Hotel owner RLS policies

**Business Rules:**
- Packages cannot overlap in dates (enforced by trigger)
- Check-in must be on designated weekday (validated by `validate_package_checkin_weekday`)
- Durations limited to {8, 15, 22, 29} days
- Price increases calculated from `base_price_usd` with `price_increase_pct`
- All final prices rounded up to nearest `round_step`
- Hotel information in bookings derived from `package_id` relationship

### Promoter Dashboard

**Data Displayed:**
- Referral tracking and statistics
- Commission earnings breakdown (2% first 18 months, 1% following 12 months)
- Hotel recommendation interface
- Performance metrics

**Actions Available:**
- Submit hotel referrals
- Track referral status
- View commission reports (INTEGER USD)
- Manage referral codes

**Current Sources:**
- Files: `src/components/dashboard/promoter/`
- Tables: `hotel_referrals`, `booking_commissions`, `profiles`
- Queries: Promoter-specific RLS policies

**Business Rules:**
- Single `referral_by` per hotel
- Commissions calculated on confirmed bookings only
- 30-day window for hotel registration credit
- Local promoter commission: 2% for first 18 months, 1% for following 12 months
- All commission amounts in INTEGER USD

### Tourism Association Dashboard

**Data Displayed:**
- Association member hotels
- Collective booking statistics
- Regional tourism metrics
- Partnership opportunities
- Commission tracking (4% first 18 months, 2% following 12 months)

**Actions Available:**
- Register association details
- View member hotel performance
- Access tourism analytics
- Manage association profile

**Current Sources:**
- Files: `src/components/dashboard/association/`
- Tables: `associations`, `profiles`, `hotels`, `booking_commissions`
- Queries: Association-specific RLS policies

**Business Rules:**
- Association codes must be unique
- Members can view aggregated statistics
- Association status affects member benefits
- Association commission: 4% for first 18 months, 2% for following 12 months
- Single referral source per booking

### Group Leader Dashboard

**Data Displayed:**
- Group booking management
- Member invitation system
- Direct bonus tracking (no HL commission deduction)
- Group travel coordination

**Actions Available:**
- Create group bookings
- Invite group members
- Manage group preferences
- Track bonus earnings (shown as "pending payment")

**Current Sources:**
- Files: `src/components/dashboard/leader/`
- Tables: `leaders`, `leader_bonuses`, `bookings`
- Queries: Leader-specific RLS policies

**Business Rules:**
- Leader receives direct bonus paid by hotel (no HL commission)
- Referral codes follow LL-XXXX format
- Group bookings require minimum participants
- Bonuses shown as "pending payment" without HL deductions

### Ambassador Dashboard

**Data Displayed:**
- Agent performance metrics
- Hotel contact management
- Commission tracking
- Lead generation tools

**Actions Available:**
- Log hotel contacts
- Track conversion rates
- Submit new leads
- View commission reports

**Current Sources:**
- Files: `src/components/dashboard/agent/`
- Tables: `agents`, `agent_hotels`, `agent_commissions`
- Queries: Agent-specific RLS policies

**Business Rules:**
- 30-day window for hotel registration credit
- Commission rates vary by agreement
- Agent codes must be unique

## API v2 Endpoint Map

**Note:** All paths are relative to the server base URL that already includes `/api/v2`.

### Authentication Endpoints

#### POST /auth/login
- **Purpose:** User authentication
- **Auth:** None required
- **Request:** `{ email: string, password: string }`
- **Response:** `{ success: boolean, token: string, user: UserProfile, timestamp: string }`
- **Errors:** `INVALID_CREDENTIALS`, `RATE_LIMITED`
- **Caching:** `Cache-Control: no-store`

#### POST /auth/logout
- **Purpose:** User logout
- **Auth:** Bearer token required
- **Request:** `{}`
- **Response:** `{ success: boolean, timestamp: string }`
- **Caching:** `Cache-Control: no-store`

### Hotel Management Endpoints

#### GET /hotels
- **Purpose:** Retrieve filtered hotel list
- **Auth:** None required for approved hotels
- **Query Params:** `page`, `limit`, `sort`, `order`, `country`, `city`, `themes`, `price_min`, `price_max`
- **Response:** `{ hotels: Hotel[], pagination: { page, limit, total, pages }, timestamp: string }`
- **Caching:** `Cache-Control: public, max-age=60`, `ETag` support
- **Errors:** `VALIDATION_ERROR` (422)

#### POST /hotels
- **Purpose:** Create new hotel
- **Auth:** Hotel owner role required
- **Headers:** `Idempotency-Key` (required)
- **Request:** `HotelCreateRequest`
- **Response:** `{ hotel: Hotel, status: 'pending', timestamp: string }`
- **Idempotency:** Replay protection for 24 hours
- **Side Effects:** Triggers admin notification, activates Three Free Nights
- **Errors:** `BUSINESS_RULE_VIOLATION`, `VALIDATION_ERROR` (422), `IDEMPOTENCY_REPLAY`

#### PUT /hotels/{id}
- **Purpose:** Update existing hotel
- **Auth:** Hotel owner (own hotels) or admin
- **Headers:** `Idempotency-Key` (required)
- **Request:** `HotelUpdateRequest`
- **Response:** `{ hotel: Hotel, timestamp: string }`
- **Side Effects:** Version increment, admin notification
- **Errors:** `CONCURRENT_MODIFICATION`, `VALIDATION_ERROR` (422)

#### GET /hotels/{id}
- **Purpose:** Get single hotel details
- **Auth:** None required for approved hotels
- **Response:** `{ hotel: Hotel, timestamp: string }`
- **Caching:** `Cache-Control: public, max-age=60`, `ETag` support
- **Errors:** `RESOURCE_NOT_FOUND`

#### GET /hotels/{id}/packages
- **Purpose:** Get availability packages for hotel
- **Auth:** None required
- **Query Params:** `month`, `year`, `available_only`, `page`, `limit`
- **Response:** `{ packages: AvailabilityPackage[], pagination: PaginationInfo, timestamp: string }`
- **Caching:** `Cache-Control: public, max-age=60`, `ETag` support

#### POST /hotels/{id}/packages
- **Purpose:** Create availability package
- **Auth:** Hotel owner (own hotels) or admin
- **Headers:** `Idempotency-Key` (required)
- **Request:** `PackageCreateRequest`
- **Response:** `{ package: AvailabilityPackage, timestamp: string }`
- **Business Rules:** Anti-overlap validation, weekday enforcement
- **Errors:** `OVERLAP_DETECTED`, `BUSINESS_RULE_VIOLATION`, `VALIDATION_ERROR` (422)

#### PUT /hotels/{hid}/packages/{pid}
- **Purpose:** Update package details
- **Auth:** Hotel owner (own packages) or admin
- **Headers:** `Idempotency-Key` (required)
- **Request:** `PackageUpdateRequest`
- **Response:** `{ package: AvailabilityPackage, timestamp: string }`
- **Errors:** `OVERLAP_DETECTED`, `CONCURRENT_MODIFICATION`, `VALIDATION_ERROR` (422)

### Booking Management Endpoints

#### POST /bookings
- **Purpose:** Create new booking
- **Auth:** Authenticated user required
- **Headers:** `Idempotency-Key` (required)
- **Request:** `BookingCreateRequest` (includes `guest_count`, `package_id` only)
- **Response:** `{ booking: Booking, payment_url?: string, timestamp: string }`
- **Idempotency:** Replay protection with state tracking
- **Side Effects:** Package availability reduction, payment initiation, commission calculation
- **Concurrency:** Row-level locking on packages with `SELECT ... FOR UPDATE`
- **Business Rules:** Hotel derived from `package_id`, validates package exists and belongs to approved hotel
- **Errors:** `INSUFFICIENT_AVAILABILITY`, `RESOURCE_NOT_FOUND`, `VALIDATION_ERROR` (422)
- **Events:** `booking.created`

#### GET /bookings
- **Purpose:** Retrieve user bookings
- **Auth:** Authenticated user required
- **Query Params:** `status`, `page`, `limit`, `sort`, `order`
- **Response:** `{ bookings: Booking[], pagination: PaginationInfo, timestamp: string }`
- **Caching:** `Cache-Control: no-store`

#### GET /bookings/{id}
- **Purpose:** Get single booking details
- **Auth:** Booking owner or admin
- **Response:** `{ booking: Booking, timestamp: string }`
- **Caching:** `Cache-Control: no-store`

#### PUT /bookings/{id}
- **Purpose:** Modify existing booking
- **Auth:** Booking owner or admin
- **Headers:** `Idempotency-Key` (required)
- **Request:** `BookingUpdateRequest`
- **Response:** `{ booking: Booking, timestamp: string }`
- **Side Effects:** Availability adjustments, notifications
- **Concurrency:** Row-level locking on packages
- **Errors:** `CONCURRENT_MODIFICATION`, `VALIDATION_ERROR` (422)

#### PUT /bookings/{id}/cancel
- **Purpose:** Cancel booking
- **Auth:** Booking owner or admin
- **Headers:** `Idempotency-Key` (required)
- **Response:** `{ success: boolean, timestamp: string }`
- **Side Effects:** Availability restoration using `SELECT ... FOR UPDATE`, refund processing
- **Events:** `booking.cancelled`

#### PUT /bookings/{id}/confirm
- **Purpose:** Confirm booking payment
- **Auth:** Booking owner or admin
- **Headers:** `Idempotency-Key` (required)
- **Response:** `{ booking: Booking, timestamp: string }`
- **Side Effects:** Commission generation, notifications
- **Events:** `booking.confirmed`, `commission.generated`

### User Management Endpoints

#### GET /users/profile
- **Purpose:** Get current user profile
- **Auth:** Authenticated user required
- **Response:** `{ profile: UserProfile, timestamp: string }`
- **Caching:** `Cache-Control: no-store`

#### PUT /users/profile
- **Purpose:** Update user profile
- **Auth:** Authenticated user required
- **Request:** `ProfileUpdateRequest`
- **Response:** `{ profile: UserProfile, timestamp: string }`
- **Errors:** `VALIDATION_ERROR` (422)

#### GET /users/free-nights
- **Purpose:** Get Three Free Nights status
- **Auth:** Authenticated user required
- **Response:** `{ reward: FreeNightsReward | null, timestamp: string }`
- **Caching:** `Cache-Control: no-store`

#### POST /users/favorites
- **Purpose:** Add hotel to favorites
- **Auth:** Authenticated user required
- **Request:** `{ hotel_id: string }`
- **Response:** `{ success: boolean, timestamp: string }`
- **Errors:** `RESOURCE_NOT_FOUND`, `VALIDATION_ERROR` (422)

#### DELETE /users/favorites/{hotel_id}
- **Purpose:** Remove from favorites
- **Auth:** Authenticated user required
- **Response:** `{ success: boolean, timestamp: string }`

### Commission & Referral Endpoints

#### GET /commissions
- **Purpose:** Retrieve commission history
- **Auth:** Agent/Leader/Association role required
- **Query Params:** `period_start`, `period_end`, `status`, `page`, `limit`
- **Response:** `{ commissions: Commission[], pagination: PaginationInfo, total_earned: number, timestamp: string }`
- **Caching:** `Cache-Control: no-store`

#### POST /referrals
- **Purpose:** Submit hotel referral
- **Auth:** Promoter role required
- **Request:** `ReferralCreateRequest`
- **Response:** `{ referral: Referral, timestamp: string }`
- **Side Effects:** Admin notification, potential Three Free Nights activation
- **Errors:** `VALIDATION_ERROR` (422)

### Three Free Nights Endpoints

#### POST /free-nights/redeem
- **Purpose:** Redeem Three Free Nights benefit
- **Auth:** Authenticated user with available reward
- **Request:** `{ package_id: string, check_in: string, check_out: string }`
- **Response:** `{ booking: Booking, timestamp: string }`
- **Side Effects:** Mark reward as redeemed, create booking
- **Errors:** `RESOURCE_NOT_FOUND`, `INSUFFICIENT_AVAILABILITY`, `BUSINESS_RULE_VIOLATION`

### Error Codes

#### Standard Error Response Schema
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": {
      "en": "English error message",
      "es": "Mensaje de error en español",
      "pt": "Mensagem de erro em português",
      "ro": "Mesajul de eroare în română"
    },
    "details": {}
  },
  "timestamp": "2025-01-09T12:00:00.000Z"
}
```

#### Error Code Definitions
- **BUSINESS_RULE_VIOLATION:** Operation violates defined business constraints
- **OVERLAP_DETECTED:** Package dates conflict with existing packages
- **INSUFFICIENT_AVAILABILITY:** Not enough rooms available for booking
- **ROLE_NOT_ALLOWED:** User lacks required permissions
- **IDEMPOTENCY_REPLAY:** Duplicate request detected and handled
- **VALIDATION_ERROR:** Input validation failed (HTTP 422)
- **RESOURCE_NOT_FOUND:** Requested resource does not exist (HTTP 404)
- **CONCURRENT_MODIFICATION:** Resource modified by another transaction (HTTP 409)

#### Response Requirements
- Every response MUST include `timestamp` in ISO-8601 UTC format
- All `LocalizedMessage` objects MUST contain `en`, `es`, `pt`, `ro` with non-empty values
- Automated validation blocks responses with missing translations
- HTTP 422 responses required for all endpoints with request bodies

## Data Model Schema

### Core Tables Structure

#### profiles (Modified - Remove user_roles table)
```sql
-- Remove user_roles table entirely
DROP TABLE IF EXISTS user_roles CASCADE;

-- Modified profiles table with single role enforcement
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'hotel_owner', 'agent', 'leader', 'association', 'promoter')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_hotel_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Enforce one role per user via unique constraint
  CONSTRAINT unique_user_role UNIQUE(id, role)
);
```

#### bookings (Modified - Remove hotel_id)
```sql
-- Remove hotel_id column entirely, derive from package_id
ALTER TABLE bookings DROP COLUMN IF EXISTS hotel_id;

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES availability_packages(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL, -- INTEGER USD only
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending',
  payment_timestamp TIMESTAMPTZ,
  stripe_session_id TEXT,
  referral_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_bookings_package FOREIGN KEY (package_id) REFERENCES availability_packages(id) ON DELETE CASCADE
);
```

#### availability_packages (Modified - Add pricing fields)
```sql
CREATE TABLE availability_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  start_date DATE NOT NULL, -- UTC dates
  end_date DATE NOT NULL,   -- UTC dates
  duration_days INTEGER NOT NULL,
  total_rooms INTEGER NOT NULL,
  available_rooms INTEGER NOT NULL,
  base_price_usd INTEGER NOT NULL DEFAULT 0,     -- Base price for dynamic pricing
  price_increase_pct INTEGER DEFAULT 20,         -- Percentage increase per booked room
  round_step INTEGER DEFAULT 5,                  -- Round up to nearest step
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_duration CHECK (duration_days IN (8, 15, 22, 29)),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_rooms CHECK (available_rooms >= 0 AND available_rooms <= total_rooms),
  CONSTRAINT valid_pricing CHECK (base_price_usd >= 0 AND price_increase_pct >= 0 AND round_step > 0)
);
```

#### free_nights_rewards (New)
```sql
CREATE TABLE free_nights_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hotel_owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'redeemed', 'expired')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Optional expiry
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Either user_id or hotel_owner_id must be set, not both
  CONSTRAINT check_single_recipient CHECK (
    (user_id IS NOT NULL AND hotel_owner_id IS NULL) OR 
    (user_id IS NULL AND hotel_owner_id IS NOT NULL)
  )
);
```

#### audit_logs (New)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Triggers and Constraints

#### Package Check-in Weekday Validation (UTC Date Handling)
```sql
CREATE OR REPLACE FUNCTION validate_package_checkin_weekday()
RETURNS TRIGGER AS $$
DECLARE
  hotel_weekday TEXT;
  package_weekday TEXT;
BEGIN
  -- Get hotel's required check-in weekday in canonical English
  SELECT check_in_weekday INTO hotel_weekday
  FROM hotels 
  WHERE id = NEW.hotel_id;
  
  -- Get weekday of package start_date (UTC) using canonical English format
  package_weekday := TRIM(to_char(NEW.start_date, 'Day'));
  
  -- Validate weekday match using canonical English names
  IF LOWER(TRIM(hotel_weekday)) != LOWER(package_weekday) THEN
    RAISE EXCEPTION 'BUSINESS_RULE_VIOLATION: Package start_date (%) must be on hotel check-in weekday (%)', 
      package_weekday, hotel_weekday;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_package_checkin_weekday
  BEFORE INSERT OR UPDATE ON availability_packages
  FOR EACH ROW EXECUTE FUNCTION validate_package_checkin_weekday();
```

#### Package Overlap Prevention
```sql
CREATE OR REPLACE FUNCTION prevent_package_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM availability_packages
    WHERE hotel_id = NEW.hotel_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND (
      (NEW.start_date >= start_date AND NEW.start_date <= end_date) OR
      (NEW.end_date >= start_date AND NEW.end_date <= end_date) OR
      (NEW.start_date <= start_date AND NEW.end_date >= end_date)
    )
  ) THEN
    RAISE EXCEPTION 'OVERLAP_DETECTED: Package dates overlap with existing package';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_package_overlap
  BEFORE INSERT OR UPDATE ON availability_packages
  FOR EACH ROW EXECUTE FUNCTION prevent_package_overlap();
```

### Indexes for Performance

```sql
-- Booking queries (hotel_id removed, use package_id relationship)
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_package_id ON bookings(package_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);

-- Package queries with pricing
CREATE INDEX idx_packages_hotel_dates ON availability_packages(hotel_id, start_date, end_date);
CREATE INDEX idx_packages_availability ON availability_packages(available_rooms) WHERE available_rooms > 0;

-- Profile role queries (replacing user_roles)
CREATE INDEX idx_profiles_role ON profiles(role);

-- Free nights tracking
CREATE INDEX idx_free_nights_user ON free_nights_rewards(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_free_nights_hotel_owner ON free_nights_rewards(hotel_owner_id) WHERE hotel_owner_id IS NOT NULL;
CREATE INDEX idx_free_nights_status ON free_nights_rewards(status);

-- Audit trail
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id, created_at);

-- Commission tracking with date ranges
CREATE INDEX idx_booking_commissions_date ON booking_commissions(created_at);
CREATE INDEX idx_leader_bonuses_date ON leader_bonuses(created_at);

-- Common filter indexes
CREATE INDEX idx_hotels_country_city ON hotels(country, city) WHERE status = 'approved';
CREATE INDEX idx_hotels_price_range ON hotels(price_per_month) WHERE status = 'approved';
```

## Business Rules & Constraints

### Currency and Pricing Rules
- All prices stored as INTEGER USD (no decimals)
- Authoritative prices are per room, all-in, INTEGER USD; customer-facing per-person numbers are derived (never persisted).
- Hotel pricing config (hotels): enable_price_increase (bool), price_increase_pct (0–100), round_step (1|5|10), price_increase_cap (0–50)
- Package pricing (availability_packages): base_price_usd (int), current_price_usd (int), occupancy_mode IN ('single','double')
- Caps are initial-only: enforced at package creation/edit (per-room, all-in). base_price_usd and initial current_price_usd must not exceed price_caps(category, duration_days, occupancy_mode).
- On booking confirmation: new_price = ceil(current_price_usd × (1 + pct/100) ÷ round_step) × round_step; cap = ceil(base_price_usd × (1 + cap%)/round_step) × round_step; current_price_usd = min(new_price, cap). The price_caps table is NOT applied at this stage.
- For double occupancy, per-person totals are ceil(current_price_usd/2) and per_person_per_night_usd = ceil(current_price_usd/2/duration_days); for single occupancy, per-person equals per-room.
- Read-only helper endpoint: GET /pricing/quote?package_id=… returns { per_room_total_usd, duration_days, occupancy, per_person_total_usd, per_person_per_night_usd }.
- Concurrency: update uses SELECT ... FOR UPDATE on the package row
- All API responses use INTEGER format for prices

### Availability Package Rules
- Duration must be exactly 8, 15, 22, or 29 days
- Packages cannot overlap for the same hotel (enforced by trigger)
- One package per start date per hotel: UNIQUE(hotel_id, start_date)
- Check-in weekday must match hotel's designated weekday (validated by trigger; UTC; uses canonical English)
- Available rooms cannot exceed total rooms
- All dates stored and processed in UTC
- Weekday validation uses canonical English format: `trim(to_char(start_date, 'Day'))`


### Booking Rules
- Users can only book available packages with concurrency protection
- Hotel information derived from `package_id` (no direct `hotel_id` in bookings)
- Cancellations restore package availability using `SELECT ... FOR UPDATE`
- Price calculated with dynamic adjustments and rounded up
- Single referral source per booking (`referral_code_used`)
- Requires valid `guest_count` (minimum 1)

### Commission Rules (Detailed Structure)
- **Association:** 4% for first 18 months, 2% for following 12 months
- **Local Promoter:** 2% for first 18 months, 1% for following 12 months  
- **Leader:** Direct hotel bonus (no HL commission), shown as "pending payment"
- **Hotel-to-Hotel Referral:** 4% for first 18 months, 2% for subsequent year (if hotel joins within 1 month)
- Only one `referral_by` per hotel
- Commissions calculated on confirmed bookings only
- All amounts in INTEGER USD

### Monetary Commissions — Single-Source Rule (Authoritative, Backend-Enforced)
- Principle: A booking can have at most one monetary commission source — or none.
- Scope: Applies to association, promoter, and hotel→hotel referrer commissions; excludes in-kind rewards.
- Data model:
  - bookings: commission_source_type TEXT CHECK IN ('association','promoter','hotel_referrer'), commission_source_id UUID, with CHECK that both are NULL or both NOT NULL.
  - booking_commissions: UNIQUE (booking_id) to guarantee at most one commission per booking.
  - hotel_commission_link: canonical per-hotel commission source with validity window (starts_at/ends_at) used to resolve the active source at booking time.
- API contract:
  - Booking creation accepts a single optional referral_code; resolve to exactly one origin and set commission_source_type/commission_source_id.
  - On confirmation, select at most one active hotel_commission_link for the booking's hotel where starts_at ≤ booking.created_at ≤ COALESCE(ends_at, ∞).
  - Commission creation uses INSERT ... ON CONFLICT (booking_id) DO NOTHING and returns BUSINESS_RULE_VIOLATION with LocalizedMessage on duplicates.
  - Require Idempotency-Key on commission-creation endpoints.
- Time windows: Association 4% for first 18 months then 2% for 12 months; Promoter 2% for first 18 months then 1% for 12 months; Hotel→Hotel 4%/18m → 2%/12m if the hotel joins within 1 month of referral.
- Errors & i18n: Standard error envelope with LocalizedMessage (en, es, pt, ro).
- Audit: Log commission creation attempts and results with booking_id, source type/id, actor, timestamp, previous vs new state.
- Tests: Unit, integration, and E2E artifacts ensure one-commission-only behavior.
- Separation from rewards: free_nights_rewards is in-kind only and never affects monetary totals.

### Role-based Access (Single Role per User)
- Role stored only in `profiles.role` (no separate `user_roles` table)
- Hotel owners can only modify their own hotels
- Admins have full system access
- Users limited to personal data and public hotels
- Agents track referrals and commissions
- UNIQUE constraint enforces one role per email

### Three Free Nights Program
- Hotel owners: Activated automatically upon account approval
- Users: Activated when recommended hotel is approved
- Non-transferable, single use per reward
- Valid for standard rooms only
- Subject to availability and hotel blackout dates
- Tracked in `free_nights_rewards` table

## Internationalization (i18n)

### Language Support
- **Supported Languages:** Spanish (es), English (en), Portuguese (pt), Romanian (ro)
- **Validation:** Automated middleware validates all languages present and non-empty
- **Failure Handling:** 
  - Staging: Return HTTP 500 with detailed log if any language missing
  - Production: Log error and block response until corrected (no fallback to EN)

### Message Format
```typescript
interface LocalizedMessage {
  en: string;   // Required, non-empty
  es: string;   // Required, non-empty  
  pt: string;   // Required, non-empty
  ro: string;   // Required, non-empty
}
```

### Implementation Requirements
- All `LocalizedMessage` objects validated before sending any response
- Missing translations block the response entirely
- No raw translation keys or namespaces exposed to frontend
- Automated validation middleware runs on every response
- Error logs capture missing translation details for correction

### Translation Sources
- Static messages stored in database translation tables
- Dynamic content translated via API service
- Error messages pre-translated for consistent experience
- Business rule violations include localized explanations
- Commission calculations and notifications include all languages

### Content Areas Requiring Translation
- Error messages and validation feedback (all error codes)
- Email notifications and templates (signature: "El equipo de Hotel-living.com")
- System notifications and alerts
- Dashboard labels and descriptions
- Business rule violation explanations
- Commission notifications and statements
- Three Free Nights program messages

### Validation Middleware
```typescript
function validateLocalizedResponse(response: any): boolean {
  // Recursively check all LocalizedMessage objects
  // Ensure en, es, pt, ro all exist and are non-empty strings
  // Block response if validation fails
  // Log missing translations for correction
}
```

## Authorization Matrix

### Role-Based Access Control

| Endpoint | Admin | Hotel Owner | User | Agent | Leader | Association | Promoter |
|----------|-------|-------------|------|-------|--------|-------------|----------|
| GET /hotels | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| POST /hotels | ✓ | ✓ (own) | ✗ | ✗ | ✗ | ✗ | ✗ |
| PUT /hotels/{id} | ✓ | ✓ (own) | ✗ | ✗ | ✗ | ✗ | ✗ |
| GET /hotels/{id} | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| POST /hotels/{id}/packages | ✓ | ✓ (own) | ✗ | ✗ | ✗ | ✗ | ✗ |
| PUT /hotels/{hid}/packages/{pid} | ✓ | ✓ (own) | ✗ | ✗ | ✗ | ✗ | ✗ |
| POST /bookings | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /bookings | ✓ | ✓ (own hotel) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) |
| PUT /bookings/{id}/cancel | ✓ | ✗ | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) |
| PUT /bookings/{id}/confirm | ✓ | ✗ | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) |
| GET /commissions | ✓ | ✗ | ✗ | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) |
| POST /referrals | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| GET /users/free-nights | ✓ | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) |
| POST /free-nights/redeem | ✓ | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (own) |

### Authentication & Authorization Middleware
- **authn:** JWT token validation for all protected endpoints
- **authz:** Role-based access control with ownership validation
- **Ownership Rules:** 
  - Hotel owners can only access their own hotels and related resources
  - Users can only access their own bookings and profile data
  - Agents/Leaders/Associations can only access their own commission data

## Commission Structure

### Association Commission
- **Rate:** 4% of generated bookings for first 18 months
- **Rate:** 2% of generated bookings for following 12 months  
- **Calculation:** Based on confirmed booking `total_price`
- **Payment:** Monthly via recorded bank details
- **Tracking:** Via `booking_commissions` table with date-based rate calculation

### Local Promoter Commission  
- **Rate:** 0.5% of generated bookings for first 18 months
- **Rate:** 1% of generated bookings for following 12 months
- **Calculation:** Based on confirmed booking `total_price`
- **Payment:** Monthly via recorded bank details
- **Tracking:** Via `booking_commissions` table

### Leader Bonus
- **Structure:** Direct bonus paid by hotel (no HL commission deduction)
- **Display:** Shown in leader panel as "pending payment"
- **Tracking:** Via `leader_bonuses` table
- **Payment:** Direct between hotel and leader (HL not involved)

### Hotel-to-Hotel Referral
- **Eligibility:** Referred hotel must join within 1 month of recommendation
- **Rate:** 4% of gross total of all bookings for first 18 months
- **Rate:** Additional 2% during subsequent year
- **Calculation:** Based on all confirmed bookings at referred hotel
- **Tracking:** Via `referral_by` field and commission calculations

### General Rules
- Only one `referral_by` per hotel (single referral source)
- Only one referral source per booking
- All commission amounts in INTEGER USD
- Commissions calculated only on confirmed bookings
- Time periods calculated from hotel approval date

## Three Free Nights Program

### Program Overview
The Three Free Nights program provides complimentary accommodation benefits to both hotel owners and users who contribute to platform growth.

### Eligibility

#### Hotel Owners
- **Trigger:** Activated automatically upon hotel account approval
- **Benefit:** Three free nights at any participating hotel
- **Validity:** Redeemable at any time of the year

#### Regular Users  
- **Trigger:** Activated when a recommended hotel is approved and goes live
- **Benefit:** Three free nights at any participating hotel
- **Validity:** Redeemable at any time of the year

### Panel Integration

#### Hotel Dashboard
- Banner or card displaying "Three Free Nights Available"
- Shows redemption status (available, redeemed, expired)
- Displays expiry date if applicable
- Direct redemption interface

#### User Dashboard
- Same banner/card as hotel dashboard
- Only visible when referral condition is met
- Real-time status updates
- Redemption tracking

### Technical Implementation

#### Database Schema
```sql
-- Already defined in data model section
CREATE TABLE free_nights_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hotel_owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### API Endpoints
- `GET /users/free-nights` - Check current reward status
- `POST /free-nights/redeem` - Redeem benefit for specific dates/package

### Constraints and Limitations
- **Non-transferable:** Cannot be transferred between users
- **Single use:** One redemption per reward
- **Standard rooms only:** Upgrades at hotel's discretion
- **Availability dependent:** Subject to standard availability and blackout dates
- **Hotel policies apply:** Blackout dates defined by individual hotels

### Business Logic
- Rewards automatically created upon triggering events
- Real-time status tracking prevents duplicate redemptions
- Integration with existing booking flow for redemption
- Audit trail for all reward state changes

## OpenAPI 3.1 Specification

```yaml
openapi: 3.1.0
info:
  title: Hotel Living API v2
  description: Complete API specification for Hotel Living platform
  version: 2.0.0
  contact:
    name: Hotel Living Team
    email: support@hotel-living.com

servers:
  - url: /api/v2
    description: API v2 base URL

components:
  parameters:
    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: true
      schema:
        type: string
        format: uuid
      description: Unique key for idempotent operations

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    LocalizedMessage:
      type: object
      required: [en, es, pt, ro]
      properties:
        en:
          type: string
          minLength: 1
        es:
          type: string
          minLength: 1
        pt:
          type: string
          minLength: 1
        ro:
          type: string
          minLength: 1

    Error:
      type: object
      required: [success, error, timestamp]
      properties:
        success:
          type: boolean
          const: false
        error:
          type: object
          required: [code, message]
          properties:
            code:
              type: string
              enum: [BUSINESS_RULE_VIOLATION, OVERLAP_DETECTED, INSUFFICIENT_AVAILABILITY, ROLE_NOT_ALLOWED, IDEMPOTENCY_REPLAY, VALIDATION_ERROR, RESOURCE_NOT_FOUND, CONCURRENT_MODIFICATION]
            message:
              $ref: '#/components/schemas/LocalizedMessage'
            details:
              type: object
        timestamp:
          type: string
          format: date-time

    PaginationInfo:
      type: object
      required: [page, limit, total, pages]
      properties:
        page:
          type: integer
          minimum: 1
        limit:
          type: integer
          minimum: 1
          maximum: 100
        total:
          type: integer
          minimum: 0
        pages:
          type: integer
          minimum: 0

    UserProfile:
      type: object
      required: [id, role, created_at, updated_at]
      properties:
        id:
          type: string
          format: uuid
        role:
          type: string
          enum: [admin, user, hotel_owner, agent, leader, association, promoter]
        first_name:
          type: string
          nullable: true
        last_name:
          type: string
          nullable: true
        avatar_url:
          type: string
          nullable: true
        phone:
          type: string
          nullable: true
        is_hotel_owner:
          type: boolean
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    Hotel:
      type: object
      required: [id, name, status, created_at, updated_at]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        description:
          type: string
          nullable: true
        country:
          type: string
          nullable: true
        city:
          type: string
          nullable: true
        address:
          type: string
          nullable: true
        main_image_url:
          type: string
          nullable: true
        property_type:
          type: string
          nullable: true
        style:
          type: string
          nullable: true
        price_per_month:
          type: integer
          description: Price in USD (integer format)
        status:
          type: string
          enum: [pending, approved, rejected]
        check_in_weekday:
          type: string
          enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    AvailabilityPackage:
      type: object
      required: [id, hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms, base_price_usd]
      properties:
        id:
          type: string
          format: uuid
        hotel_id:
          type: string
          format: uuid
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        duration_days:
          type: integer
          enum: [8, 15, 22, 29]
        total_rooms:
          type: integer
          minimum: 1
        available_rooms:
          type: integer
          minimum: 0
        base_price_usd:
          type: integer
          minimum: 0
          description: Base price in USD (integer format)
        price_increase_pct:
          type: integer
          default: 20
          minimum: 0
        round_step:
          type: integer
          default: 5
          minimum: 1
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    Booking:
      type: object
      required: [id, user_id, package_id, check_in, check_out, guest_count, total_price, status]
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        package_id:
          type: string
          format: uuid
        check_in:
          type: string
          format: date
        check_out:
          type: string
          format: date
        guest_count:
          type: integer
          minimum: 1
        total_price:
          type: integer
          description: Total price in USD (integer format)
        status:
          type: string
          enum: [pending, confirmed, cancelled, completed]
        payment_status:
          type: string
          enum: [pending, completed, failed, refunded]
        payment_timestamp:
          type: string
          format: date-time
          nullable: true
        referral_code_used:
          type: string
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    FreeNightsReward:
      type: object
      required: [id, status, issued_at]
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
          nullable: true
        hotel_owner_id:
          type: string
          format: uuid
          nullable: true
        status:
          type: string
          enum: [available, redeemed, expired]
        issued_at:
          type: string
          format: date-time
        redeemed_at:
          type: string
          format: date-time
          nullable: true
        expires_at:
          type: string
          format: date-time
          nullable: true
        notes:
          type: string
          nullable: true

    Commission:
      type: object
      required: [id, booking_id, commission_usd, commission_percent, created_at]
      properties:
        id:
          type: string
          format: uuid
        booking_id:
          type: string
          format: uuid
        referred_by:
          type: string
        commission_usd:
          type: integer
          description: Commission amount in USD (integer format)
        commission_percent:
          type: number
          format: float
        created_at:
          type: string
          format: date-time

    # Request Schemas
    HotelCreateRequest:
      type: object
      required: [name, contact_email]
      properties:
        name:
          type: string
          minLength: 1
        description:
          type: string
        country:
          type: string
        city:
          type: string
        address:
          type: string
        contact_name:
          type: string
        contact_email:
          type: string
          format: email
        contact_phone:
          type: string
        property_type:
          type: string
        style:
          type: string
        price_per_month:
          type: integer
          minimum: 0
        check_in_weekday:
          type: string
          enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
          default: Monday

    PackageCreateRequest:
      type: object
      required: [start_date, end_date, duration_days, total_rooms, base_price_usd]
      properties:
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        duration_days:
          type: integer
          enum: [8, 15, 22, 29]
        total_rooms:
          type: integer
          minimum: 1
        available_rooms:
          type: integer
          minimum: 0
        base_price_usd:
          type: integer
          minimum: 0
        price_increase_pct:
          type: integer
          minimum: 0
          default: 20
        round_step:
          type: integer
          minimum: 1
          default: 5

    BookingCreateRequest:
      type: object
      required: [package_id, check_in, check_out, guest_count]
      properties:
        package_id:
          type: string
          format: uuid
        check_in:
          type: string
          format: date
        check_out:
          type: string
          format: date
        guest_count:
          type: integer
          minimum: 1
        referral_code_used:
          type: string

    ReferralCreateRequest:
      type: object
      required: [hotel_name, contact_name, contact_email]
      properties:
        hotel_name:
          type: string
        contact_name:
          type: string
        contact_email:
          type: string
          format: email
        contact_phone:
          type: string
        city:
          type: string
        additional_info:
          type: string

paths:
  /auth/login:
    post:
      summary: Authenticate user
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        '200':
          description: Successful authentication
          content:
            application/json:
              schema:
                type: object
                required: [success, token, user, timestamp]
                properties:
                  success:
                    type: boolean
                    const: true
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/UserProfile'
                  timestamp:
                    type: string
                    format: date-time
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          description: Rate limited
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/logout:
    post:
      summary: Logout user
      operationId: logoutUser
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful logout
          content:
            application/json:
              schema:
                type: object
                required: [success, timestamp]
                properties:
                  success:
                    type: boolean
                    const: true
                  timestamp:
                    type: string
                    format: date-time

  /hotels:
    get:
      summary: Get filtered hotel list
      operationId: getHotels
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: sort
          in: query
          schema:
            type: string
            enum: [name, price_per_month, created_at]
            default: created_at
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
        - name: country
          in: query
          schema:
            type: string
        - name: city
          in: query
          schema:
            type: string
        - name: price_min
          in: query
          schema:
            type: integer
            minimum: 0
        - name: price_max
          in: query
          schema:
            type: integer
            minimum: 0
      responses:
        '200':
          description: Hotel list retrieved successfully
          headers:
            ETag:
              schema:
                type: string
            Cache-Control:
              schema:
                type: string
                example: "public, max-age=60"
          content:
            application/json:
              schema:
                type: object
                required: [hotels, pagination, timestamp]
                properties:
                  hotels:
                    type: array
                    items:
                      $ref: '#/components/schemas/Hotel'
                  pagination:
                    $ref: '#/components/schemas/PaginationInfo'
                  timestamp:
                    type: string
                    format: date-time
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      summary: Create new hotel
      operationId: createHotel
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HotelCreateRequest'
      responses:
        '201':
          description: Hotel created successfully
          content:
            application/json:
              schema:
                type: object
                required: [hotel, status, timestamp]
                properties:
                  hotel:
                    $ref: '#/components/schemas/Hotel'
                  status:
                    type: string
                    const: pending
                  timestamp:
                    type: string
                    format: date-time
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Idempotency replay
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /hotels/{id}:
    get:
      summary: Get hotel details
      operationId: getHotel
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Hotel details retrieved successfully
          headers:
            ETag:
              schema:
                type: string
            Cache-Control:
              schema:
                type: string
                example: "public, max-age=60"
          content:
            application/json:
              schema:
                type: object
                required: [hotel, timestamp]
                properties:
                  hotel:
                    $ref: '#/components/schemas/Hotel'
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Hotel not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      summary: Update hotel
      operationId: updateHotel
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HotelCreateRequest'
      responses:
        '200':
          description: Hotel updated successfully
          content:
            application/json:
              schema:
                type: object
                required: [hotel, timestamp]
                properties:
                  hotel:
                    $ref: '#/components/schemas/Hotel'
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Hotel not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Concurrent modification
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /hotels/{id}/packages:
    get:
      summary: Get hotel packages
      operationId: getHotelPackages
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: month
          in: query
          schema:
            type: string
            pattern: '^\d{4}-\d{2}$'
        - name: year
          in: query
          schema:
            type: integer
            minimum: 2024
        - name: available_only
          in: query
          schema:
            type: boolean
            default: false
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: Hotel packages retrieved successfully
          headers:
            ETag:
              schema:
                type: string
            Cache-Control:
              schema:
                type: string
                example: "public, max-age=60"
          content:
            application/json:
              schema:
                type: object
                required: [packages, pagination, timestamp]
                properties:
                  packages:
                    type: array
                    items:
                      $ref: '#/components/schemas/AvailabilityPackage'
                  pagination:
                    $ref: '#/components/schemas/PaginationInfo'
                  timestamp:
                    type: string
                    format: date-time

    post:
      summary: Create availability package
      operationId: createPackage
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PackageCreateRequest'
      responses:
        '201':
          description: Package created successfully
          content:
            application/json:
              schema:
                type: object
                required: [package, timestamp]
                properties:
                  package:
                    $ref: '#/components/schemas/AvailabilityPackage'
                  timestamp:
                    type: string
                    format: date-time
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '400':
          description: Package overlap detected
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /hotels/{hid}/packages/{pid}:
    put:
      summary: Update package
      operationId: updatePackage
      security:
        - BearerAuth: []
      parameters:
        - name: hid
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: pid
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PackageCreateRequest'
      responses:
        '200':
          description: Package updated successfully
          content:
            application/json:
              schema:
                type: object
                required: [package, timestamp]
                properties:
                  package:
                    $ref: '#/components/schemas/AvailabilityPackage'
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Package not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Concurrent modification or overlap
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /bookings:
    get:
      summary: Get user bookings
      operationId: getUserBookings
      security:
        - BearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, confirmed, cancelled, completed]
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: sort
          in: query
          schema:
            type: string
            enum: [check_in, check_out, created_at, total_price]
            default: created_at
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Bookings retrieved successfully
          headers:
            Cache-Control:
              schema:
                type: string
                example: "no-store"
          content:
            application/json:
              schema:
                type: object
                required: [bookings, pagination, timestamp]
                properties:
                  bookings:
                    type: array
                    items:
                      $ref: '#/components/schemas/Booking'
                  pagination:
                    $ref: '#/components/schemas/PaginationInfo'
                  timestamp:
                    type: string
                    format: date-time

    post:
      summary: Create new booking
      operationId: createBooking
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookingCreateRequest'
      responses:
        '201':
          description: Booking created successfully
          content:
            application/json:
              schema:
                type: object
                required: [booking, timestamp]
                properties:
                  booking:
                    $ref: '#/components/schemas/Booking'
                  payment_url:
                    type: string
                    format: uri
                  timestamp:
                    type: string
                    format: date-time
        '400':
          description: Insufficient availability
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Package not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /bookings/{id}:
    get:
      summary: Get booking details
      operationId: getBooking
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Booking details retrieved successfully
          headers:
            Cache-Control:
              schema:
                type: string
                example: "no-store"
          content:
            application/json:
              schema:
                type: object
                required: [booking, timestamp]
                properties:
                  booking:
                    $ref: '#/components/schemas/Booking'
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Booking not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /bookings/{id}/cancel:
    put:
      summary: Cancel booking
      operationId: cancelBooking
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - $ref: '#/components/parameters/IdempotencyKey'
      responses:
        '200':
          description: Booking cancelled successfully
          content:
            application/json:
              schema:
                type: object
                required: [success, timestamp]
                properties:
                  success:
                    type: boolean
                    const: true
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Booking not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Concurrent modification
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /bookings/{id}/confirm:
    put:
      summary: Confirm booking payment
      operationId: confirmBooking
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - $ref: '#/components/parameters/IdempotencyKey'
      responses:
        '200':
          description: Booking confirmed successfully
          content:
            application/json:
              schema:
                type: object
                required: [booking, timestamp]
                properties:
                  booking:
                    $ref: '#/components/schemas/Booking'
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Booking not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/profile:
    get:
      summary: Get user profile
      operationId: getUserProfile
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User profile retrieved successfully
          headers:
            Cache-Control:
              schema:
                type: string
                example: "no-store"
          content:
            application/json:
              schema:
                type: object
                required: [profile, timestamp]
                properties:
                  profile:
                    $ref: '#/components/schemas/UserProfile'
                  timestamp:
                    type: string
                    format: date-time

    put:
      summary: Update user profile
      operationId: updateUserProfile
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                first_name:
                  type: string
                last_name:
                  type: string
                avatar_url:
                  type: string
                phone:
                  type: string
      responses:
        '200':
          description: Profile updated successfully
          content:
            application/json:
              schema:
                type: object
                required: [profile, timestamp]
                properties:
                  profile:
                    $ref: '#/components/schemas/UserProfile'
                  timestamp:
                    type: string
                    format: date-time
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/free-nights:
    get:
      summary: Get Three Free Nights status
      operationId: getFreeNightsStatus
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Free nights status retrieved successfully
          headers:
            Cache-Control:
              schema:
                type: string
                example: "no-store"
          content:
            application/json:
              schema:
                type: object
                required: [timestamp]
                properties:
                  reward:
                    $ref: '#/components/schemas/FreeNightsReward'
                    nullable: true
                  timestamp:
                    type: string
                    format: date-time

  /users/favorites:
    post:
      summary: Add hotel to favorites
      operationId: addFavorite
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [hotel_id]
              properties:
                hotel_id:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Hotel added to favorites
          content:
            application/json:
              schema:
                type: object
                required: [success, timestamp]
                properties:
                  success:
                    type: boolean
                    const: true
                  timestamp:
                    type: string
                    format: date-time
        '404':
          description: Hotel not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/favorites/{hotel_id}:
    delete:
      summary: Remove hotel from favorites
      operationId: removeFavorite
      security:
        - BearerAuth: []
      parameters:
        - name: hotel_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Hotel removed from favorites
          content:
            application/json:
              schema:
                type: object
                required: [success, timestamp]
                properties:
                  success:
                    type: boolean
                    const: true
                  timestamp:
                    type: string
                    format: date-time

  /commissions:
    get:
      summary: Get commission history
      operationId: getCommissions
      security:
        - BearerAuth: []
      parameters:
        - name: period_start
          in: query
          schema:
            type: string
            format: date
        - name: period_end
          in: query
          schema:
            type: string
            format: date
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, paid, cancelled]
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: Commission history retrieved successfully
          headers:
            Cache-Control:
              schema:
                type: string
                example: "no-store"
          content:
            application/json:
              schema:
                type: object
                required: [commissions, pagination, total_earned, timestamp]
                properties:
                  commissions:
                    type: array
                    items:
                      $ref: '#/components/schemas/Commission'
                  pagination:
                    $ref: '#/components/schemas/PaginationInfo'
                  total_earned:
                    type: integer
                    description: Total earned amount in USD (integer format)
                  timestamp:
                    type: string
                    format: date-time

  /referrals:
    post:
      summary: Submit hotel referral
      operationId: createReferral
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReferralCreateRequest'
      responses:
        '201':
          description: Referral submitted successfully
          content:
            application/json:
              schema:
                type: object
                required: [success, timestamp]
                properties:
                  success:
                    type: boolean
                    const: true
                  referral_id:
                    type: string
                    format: uuid
                  timestamp:
                    type: string
                    format: date-time
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /free-nights/redeem:
    post:
      summary: Redeem Three Free Nights benefit
      operationId: redeemFreeNights
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [package_id, check_in, check_out]
              properties:
                package_id:
                  type: string
                  format: uuid
                check_in:
                  type: string
                  format: date
                check_out:
                  type: string
                  format: date
      responses:
        '201':
          description: Free nights redeemed successfully
          content:
            application/json:
              schema:
                type: object
                required: [booking, timestamp]
                properties:
                  booking:
                    $ref: '#/components/schemas/Booking'
                  timestamp:
                    type: string
                    format: date-time
        '400':
          description: Business rule violation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Resource not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

## Implementation & Test Plan

### Phase A: Critical Foundation (Priority 1)
- **Authentication & Authorization Middleware**
  - JWT token validation
  - Role-based access control with ownership validation
  - Single role per user enforcement

- **Database Schema Changes**
  - Remove `user_roles` table
  - Remove `hotel_id` from bookings  
  - Add pricing fields to `availability_packages`
  - Add `guest_count` to bookings
  - Create `free_nights_rewards` and `audit_logs` tables

- **Core Read Endpoints** 
  - GET /hotels (with pagination, filtering, caching)
  - GET /hotels/{id} (with ETag support)
  - GET /hotels/{id}/packages
  - GET /bookings (user-specific with role-based filtering)

### Phase B: Transactional Operations (Priority 2)
- **Booking Creation with Concurrency**
  - POST /bookings with `SELECT ... FOR UPDATE` on packages
  - Dynamic pricing calculation with rounding
  - Hotel derivation from `package_id`
  - Idempotency implementation

- **Package Management**
  - POST /hotels/{id}/packages with overlap prevention
  - PUT /hotels/{hid}/packages/{pid} with weekday validation
  - Trigger implementation for business rules

- **Booking Lifecycle**
  - PUT /bookings/{id}/cancel with availability restoration
  - PUT /bookings/{id}/confirm with commission calculation

### Phase C: Advanced Features (Priority 3)
- **Three Free Nights Program**
  - Reward issuance triggers
  - POST /free-nights/redeem endpoint
  - Dashboard integration

- **Commission System**
  - Time-based rate calculations
  - Commission generation on booking confirmation
  - GET /commissions with role-based filtering

- **Hotel Management**
  - POST /hotels with idempotency
  - PUT /hotels/{id} with version control
  - Admin approval workflow

### Phase D: Integration & Optimization (Priority 4)
- **Notification System**
  - Webhook implementations for booking events
  - Email notifications with localized content
  - Failed notification tracking and retry

- **Caching & Performance**
  - ETag implementation for public endpoints
  - Cache invalidation strategies
  - Query optimization and index verification

- **Audit & Monitoring**
  - Comprehensive audit logging
  - Performance monitoring
  - Error tracking and alerting

### Concurrency Strategy
- **Row-Level Locking:** Use `SELECT ... FOR UPDATE` on critical resources
- **Optimistic Locking:** Version control for hotel updates
- **Idempotency Storage:** 24-hour replay protection for POST/PUT operations
- **Transaction Isolation:** Proper isolation levels for booking operations

### Measurable Acceptance Criteria
- One package per start_date per hotel
- Fixed weekly check-in/out day enforced by weekday validation trigger
- Trigger uses occupancy_mode and rejects guest_count values exceeding occupancy
- Public pricing-quote never returns non-sellable packages (hotel not approved or no availability)
- All quote amounts are INTEGER USD with ceil rounding for per-person totals and per-night
- Error responses localized (en/es/pt/ro) with codes VALIDATION_ERROR/RESOURCE_NOT_FOUND
- **Price Accuracy:** 0 USD divergence between calculated and stored prices
- **Concurrency Safety:** 0 booking collision failures under load testing
- **API Centralization:** 100% of reads and critical mutations use API v2
- **Localization Coverage:** 100% of user-facing text includes ES/EN/PT/RO
- **Response Time:** <200ms for read operations, <500ms for write operations
- **Availability:** 99.9% uptime for all endpoints

### Testing Strategy
- **Unit Tests:** All business logic, pricing calculations, concurrency scenarios
- **Integration Tests:** Database triggers, API endpoint workflows
- **Load Testing:** Concurrent booking creation, package management under stress
- **Localization Testing:** Automated validation of all LocalizedMessage responses
- **Security Testing:** Role-based access control, input validation, SQL injection prevention

Applied all corrections and hardenings to the API v2 Master Document with complete specification covering database changes, pricing rules, idempotency requirements, commission structure, and Three Free Nights program.