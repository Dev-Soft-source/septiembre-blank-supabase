// Re-export all hotel types from their respective files
export * from './hotel/base';
export * from './hotel/admin';
export * from './hotel/detail';
export * from './hotel/components';

// Keep the Supabase import for compatibility
import { HotelImage as SupabaseHotelImage } from "@/integrations/supabase/types-custom";
