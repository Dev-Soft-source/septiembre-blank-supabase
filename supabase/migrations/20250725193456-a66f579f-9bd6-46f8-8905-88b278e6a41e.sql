-- Make hotel columns nullable to allow creation with only hotel name
ALTER TABLE hotels ALTER COLUMN country DROP NOT NULL;
ALTER TABLE hotels ALTER COLUMN city DROP NOT NULL;
ALTER TABLE hotels ALTER COLUMN price_per_month DROP NOT NULL;