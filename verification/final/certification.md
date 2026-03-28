# Verification Certification Summary (Initial Pass)

Status: NOT CERTIFIED — gaps detected

Critical/major findings:
- Weekday validation not enforced by trigger (Critical)
- Booking schema still includes hotel_id; single-source commission trigger depends on it (Major)
- Commission currency stored as NUMERIC; must be INTEGER USD (Major)
- i18n coverage gaps (FirstTimeUserBanner raw English text) (Critical)

Compliant areas:
- Package durations and non-overlap enforced
- Free Nights rewards issuance idempotent and canonical
- Single commission per booking enforced via UNIQUE(booking_id)

Artifacts: see /verification/** for full details.
