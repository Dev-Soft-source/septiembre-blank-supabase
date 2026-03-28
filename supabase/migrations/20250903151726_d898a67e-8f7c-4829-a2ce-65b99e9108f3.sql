-- Phase 2: Remove obsolete tables
-- This removes unused tables to simplify the database structure

-- Remove user engagement tables
DROP TABLE IF EXISTS stay_extensions CASCADE;
DROP TABLE IF EXISTS user_rewards CASCADE;
DROP TABLE IF EXISTS join_requests CASCADE;
DROP TABLE IF EXISTS user_affinities CASCADE;

-- Remove group booking subsystem tables
DROP TABLE IF EXISTS group_bookings CASCADE;
DROP TABLE IF EXISTS group_memberships CASCADE;
DROP TABLE IF EXISTS group_proposals CASCADE;
DROP TABLE IF EXISTS group_leader_requests CASCADE;
DROP TABLE IF EXISTS hotel_group_deals CASCADE;

-- Log the cleanup
COMMENT ON SCHEMA public IS 'Phase 2 complete: Removed obsolete tables - stay_extensions, user_rewards, join_requests, user_affinities, group_bookings, group_memberships, group_proposals, group_leader_requests, hotel_group_deals';