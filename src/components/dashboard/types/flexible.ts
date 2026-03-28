// @ts-nocheck
// Flexible types for dashboard components to avoid Supabase schema conflicts

export type FlexibleSupabaseResponse = {
  [key: string]: any;
  id?: string;
  name?: string;
  hotel_id?: string;
  user_id?: string;
  status?: string;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
};

export type FlexibleQueryResult = FlexibleSupabaseResponse | FlexibleSupabaseResponse[] | null;

// Override common problematic Supabase types
export interface FlexibleDatabase {
  public: {
    Tables: {
      [tableName: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;  
        Update: Record<string, any>;
      };
    };
    Functions: {
      [functionName: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };
  };
}