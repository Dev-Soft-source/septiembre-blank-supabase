-- Delete the remaining two hotels found with different names
DELETE FROM hotels WHERE id IN (
  'de561704-9732-4ad9-b585-9fe119652f2a', -- Hampton Inn Savannah Historic District
  'fbfd3952-311c-4e08-ab4f-e05cb6f252fb'  -- Courtyard by Marriott Denver Downtown
);