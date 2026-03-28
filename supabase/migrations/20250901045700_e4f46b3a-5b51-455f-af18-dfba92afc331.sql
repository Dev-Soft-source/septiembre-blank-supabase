-- First, let's check what validation functions exist
SELECT proname, prosrc FROM pg_proc WHERE proname LIKE '%validate%' OR proname LIKE '%commission%';