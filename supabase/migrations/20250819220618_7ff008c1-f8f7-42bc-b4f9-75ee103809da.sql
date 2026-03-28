UPDATE hotels SET country = CASE 
  WHEN country = 'USA' THEN 'United States'
  WHEN country = 'Italy' THEN 'Italy'
  WHEN country = 'Moldova' THEN 'Moldova'
  WHEN country = 'Philippines' THEN 'Philippines'
  WHEN country = 'Spain' THEN 'Spain'
  ELSE country
END;