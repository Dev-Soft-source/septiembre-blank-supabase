// Global type overrides for dashboard components to fix Supabase schema conflicts

declare global {
  namespace Dashboard {
    // Override Supabase types to be more flexible for dashboard usage
    interface SupabaseQuery {
      [key: string]: any;
    }
    
    interface FlexibleDatabaseTypes {
      [table: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    }
  }
}

// Augment the Supabase client types to be more flexible
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from<T = any>(table: string): any;
  }
}

export {};