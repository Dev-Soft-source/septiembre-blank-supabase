# Pricing Quote E2E Tests

Scenarios (ES/EN/PT/RO display verified):

1) Double occupancy quote — ceil half per person
- Given package: duration_days=29, current_price_usd=2001, occupancy_mode='double', available_rooms>0, hotel.status='approved'
- When GET /functions/v1/pricing-quote?package_id={id}
- Then 200 and data.per_room_total_usd=2001, occupancy=2, per_person_total_usd=1001, per_person_per_night_usd=ceil(1001/29)=35

2) Single occupancy quote — per person equals per room
- Given package: duration_days=8, current_price_usd=600, occupancy_mode='single', available_rooms>0, hotel.status='approved'
- Then 200 and per_person_total_usd=600, per_person_per_night_usd=ceil(600/8)=75

3) Not sellable — hotel pending
- Given package with hotel.status='pending'
- Then 404 with error.code=RESOURCE_NOT_FOUND and LocalizedMessage keys en/es/pt/ro present

4) Not sellable — no availability
- Given package with available_rooms=0 and hotel.status='approved'
- Then 404 with error.code=RESOURCE_NOT_FOUND

5) Validation — missing package_id
- GET /functions/v1/pricing-quote with no package_id → 400 with error.code=VALIDATION_ERROR and localized message

6) Booking validation — guest_count limit
- Attempt to create booking with guest_count=2 for occupancy_mode='single' → rejected with trigger error

7) Rate limit & cache
- Burst >60 req/min/IP → 429 with error.code=RATE_LIMIT; subsequent valid call after 60s succeeds; Cache-Control and ETag present on 200
