# Schema vs Spec Diff

- Availability packages durations (8/15/22/29): COMPLIANT (CHECK constraint).
- No overlapping packages: COMPLIANT (trigger check_package_overlap).
- Unique start_date per hotel: EFFECTIVELY ENFORCED by overlap prevention (same start date would overlap). No explicit UNIQUE index.
- Weekday validation vs hotel.check_in_weekday: GAP (no dedicated validation trigger found).
- Booking–package–hotel linkage: PARTIAL. DB still has bookings.hotel_id (Spec says derive from package_id only). GAP (major).
- Commission single-source (monetary): COMPLIANT. UNIQUE(booking_id) exists; pair CHECK on bookings commission_source_* exists. Legacy trigger present.
- Commission currency type: GAP. booking_commissions.commission_usd is NUMERIC(…); Spec requires INTEGER USD.
- Rewards separation: COMPLIANT. free_nights_rewards separate with idempotency index and RLS.
- Idempotency & concurrency: PARTIAL. Free nights idempotency enforced. Concurrency helpers exist (reserve_package_*), but booking path trigger usage not verified.
- Three Free Nights issuance: COMPLIANT. Triggers fire only on transition to approved with idempotency.
- Commission auto-apply from hotel referral: PRESENT (calculate_booking_commission_after_insert), but does not set bookings.commission_source_type/id and uses hotel_id dependency. GAP (major).
