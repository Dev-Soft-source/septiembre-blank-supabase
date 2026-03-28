# Trigger Validation Log

Validated triggers:
- hotels: hotel_approval_free_nights → OK (fires only on status transition to approved; idempotent via UNIQUE).
- hotels: user_referral_free_nights → OK (canonical referral linkage, idempotent).
- availability_packages: prevent_package_overlap → OK (no overlapping ranges).
- availability_packages: update_updated_at_column → OK.
- hotel_availability: trigger_update_hotel_available_months → OK.
- bookings: trg_calculate_booking_commission_after_insert → PRESENT; relies on bookings.hotel_id and writes NUMERIC commissions; does not populate bookings.commission_source_* (GAP).
- bookings: trigger_calculate_leader_commission → PRESENT; aligns with leader bonus separation (no HL commission).

Open gaps:
- Weekday validation trigger not found; needs implementation.
- Booking availability locking path not verified here (requires E2E/transactional test).
