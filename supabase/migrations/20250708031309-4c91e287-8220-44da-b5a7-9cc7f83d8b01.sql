-- Remove 1 and 2 star categories from filters
UPDATE filters 
SET is_active = false 
WHERE category = 'stars' AND value IN ('1 Star', '2 Stars', '1 Estrella', '2 Estrellas', '1 Estrela', '2 Estrelas', '1 Stea', '2 Stele');