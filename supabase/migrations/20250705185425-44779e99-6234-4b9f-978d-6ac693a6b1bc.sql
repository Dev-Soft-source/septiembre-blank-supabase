-- Delete all manual entries added today (July 5th, 2025)
DELETE FROM filters 
WHERE source_type = 'manual' 
AND created_at >= '2025-07-05'::date;