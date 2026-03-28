-- Fix the demo hotel's "At A Glance" content with proper English sentences
UPDATE hotels 
SET 
  ideal_guests = 'remote professionals and digital nomads seeking a modern, well-connected environment to work and relax',
  atmosphere = 'cosmopolitan and energetic, perfect for those seeking the vibrant urban life of Barcelona',
  perfect_location = 'in the heart of Barcelona, with easy access to the city''s best attractions, restaurants and public transport'
WHERE id = 'e73fa56a-24b7-44da-a7da-fe093f5eb86a';