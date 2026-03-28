-- Fix language code constraint to include English
ALTER TABLE hotel_translations DROP CONSTRAINT hotel_translations_language_code_check;
ALTER TABLE hotel_translations ADD CONSTRAINT hotel_translations_language_code_check 
  CHECK (language_code IN ('en', 'es', 'pt', 'ro'));