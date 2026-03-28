-- Update Big Sky Urban Lodge to offer all three meal plan options
UPDATE hotels 
SET meals_offered = ARRAY['none', 'breakfast', 'half_board']
WHERE id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100';