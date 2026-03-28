
-- Add notification preferences columns to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS notification_bookings BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_messages BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_promotions BOOLEAN DEFAULT false;
