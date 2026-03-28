-- Fix security warning by moving http extension to extensions schema
DROP EXTENSION IF EXISTS http;
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;