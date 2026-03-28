export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name_en: string
          name_es: string | null
          name_pt: string | null
          name_ro: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name_en: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name_en?: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string | null
          details: Json | null
          entity_id: string | null
          event_type: string
          id: string
          processed_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          event_type: string
          id?: string
          processed_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          event_type?: string
          id?: string
          processed_at?: string | null
        }
        Relationships: []
      }
      affinities: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name_en: string
          name_es: string | null
          name_pt: string | null
          name_ro: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name_en: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name_en?: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Relationships: []
      }
      association_commissions: {
        Row: {
          amount: number | null
          association_id: string
          created_at: string | null
          end_date: string
          hotel_id: string
          id: string
          month: string
          percentage: number
          start_date: string
          status: string | null
        }
        Insert: {
          amount?: number | null
          association_id: string
          created_at?: string | null
          end_date: string
          hotel_id: string
          id?: string
          month: string
          percentage: number
          start_date: string
          status?: string | null
        }
        Update: {
          amount?: number | null
          association_id?: string
          created_at?: string | null
          end_date?: string
          hotel_id?: string
          id?: string
          month?: string
          percentage?: number
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "association_commissions_association_id_fkey"
            columns: ["association_id"]
            isOneToOne: false
            referencedRelation: "associations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "association_commissions_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "association_commissions_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      associations: {
        Row: {
          bank_info: Json | null
          created_at: string | null
          id: string
          is_founder: boolean | null
          name: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          bank_info?: Json | null
          created_at?: string | null
          id?: string
          is_founder?: boolean | null
          name: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          bank_info?: Json | null
          created_at?: string | null
          id?: string
          is_founder?: boolean | null
          name?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "associations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_packages: {
        Row: {
          base_price: number
          base_price_usd: number | null
          created_at: string | null
          duration: number
          duration_days: number | null
          dynamic_increment: number | null
          end_date: string | null
          hotel_id: string
          id: string
          price_increase_pct: number | null
          rooms: number
          round_step: number | null
          start_date: string
          total_rooms: number | null
          updated_at: string | null
        }
        Insert: {
          base_price: number
          base_price_usd?: number | null
          created_at?: string | null
          duration: number
          duration_days?: number | null
          dynamic_increment?: number | null
          end_date?: string | null
          hotel_id: string
          id?: string
          price_increase_pct?: number | null
          rooms: number
          round_step?: number | null
          start_date: string
          total_rooms?: number | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          base_price_usd?: number | null
          created_at?: string | null
          duration?: number
          duration_days?: number | null
          dynamic_increment?: number | null
          end_date?: string | null
          hotel_id?: string
          id?: string
          price_increase_pct?: number | null
          rooms?: number
          round_step?: number | null
          start_date?: string
          total_rooms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_commissions: {
        Row: {
          amount: number
          booking_id: string
          commission_source_id: string
          commission_source_type: string | null
          created_at: string | null
          id: string
          percentage: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          commission_source_id: string
          commission_source_type?: string | null
          created_at?: string | null
          id?: string
          percentage: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          commission_source_id?: string
          commission_source_type?: string | null
          created_at?: string | null
          id?: string
          percentage?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_commissions_commission_source_id_fkey"
            columns: ["commission_source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_source: string | null
          check_in: string | null
          check_out: string | null
          created_at: string | null
          guest_count: number | null
          hotel_id: string
          id: string
          is_first_booking: boolean | null
          package_id: string
          payment_status: string | null
          rooms: number
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          traveler_id: string
          updated_at: string | null
        }
        Insert: {
          booking_source?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          guest_count?: number | null
          hotel_id: string
          id?: string
          is_first_booking?: boolean | null
          package_id: string
          payment_status?: string | null
          rooms: number
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          traveler_id: string
          updated_at?: string | null
        }
        Update: {
          booking_source?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          guest_count?: number | null
          hotel_id?: string
          id?: string
          is_first_booking?: boolean | null
          package_id?: string
          payment_status?: string | null
          rooms?: number
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          traveler_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "availability_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "availability_packages_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string | null
          id: string
          iso_code: string
          name_en: string
          name_es: string | null
          name_pt: string | null
          name_ro: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          iso_code: string
          name_en: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          iso_code?: string
          name_en?: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Relationships: []
      }
      features: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name_en: string
          name_es: string | null
          name_pt: string | null
          name_ro: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name_en: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name_en?: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Relationships: []
      }
      free_nights_rewards: {
        Row: {
          created_at: string | null
          expires_at: string | null
          hotel_owner_id: string | null
          id: string
          issued_at: string | null
          notes: string | null
          redeemed_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          hotel_owner_id?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          redeemed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          hotel_owner_id?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          redeemed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "free_nights_rewards_hotel_owner_id_fkey"
            columns: ["hotel_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "free_nights_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_activities: {
        Row: {
          activity_id: string | null
          created_at: string | null
          hotel_id: string | null
          id: string
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          hotel_id?: string | null
          id?: string
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          hotel_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_activities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_activities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_affinities: {
        Row: {
          affinity_id: string | null
          hotel_id: string | null
          id: string
        }
        Insert: {
          affinity_id?: string | null
          hotel_id?: string | null
          id?: string
        }
        Update: {
          affinity_id?: string | null
          hotel_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_affinities_affinity_id_fkey"
            columns: ["affinity_id"]
            isOneToOne: false
            referencedRelation: "affinities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_affinities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_affinities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_features: {
        Row: {
          feature_id: string | null
          hotel_id: string | null
          id: string
        }
        Insert: {
          feature_id?: string | null
          hotel_id?: string | null
          id?: string
        }
        Update: {
          feature_id?: string | null
          hotel_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_features_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_features_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_images: {
        Row: {
          alt_text_en: string | null
          alt_text_es: string | null
          alt_text_pt: string | null
          alt_text_ro: string | null
          created_at: string | null
          display_order: number | null
          hotel_id: string
          id: string
          image_type: string | null
          image_url: string
          is_main: boolean | null
        }
        Insert: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          alt_text_pt?: string | null
          alt_text_ro?: string | null
          created_at?: string | null
          display_order?: number | null
          hotel_id: string
          id?: string
          image_type?: string | null
          image_url: string
          is_main?: boolean | null
        }
        Update: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          alt_text_pt?: string | null
          alt_text_ro?: string | null
          created_at?: string | null
          display_order?: number | null
          hotel_id?: string
          id?: string
          image_type?: string | null
          image_url?: string
          is_main?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_images_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_images_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_meal_plans: {
        Row: {
          hotel_id: string | null
          id: string
          meal_plan_id: string | null
        }
        Insert: {
          hotel_id?: string | null
          id?: string
          meal_plan_id?: string | null
        }
        Update: {
          hotel_id?: string | null
          id?: string
          meal_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_meal_plans_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_meal_plans_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_meal_plans_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_reviews: {
        Row: {
          booking_id: string | null
          created_at: string | null
          hotel_id: string
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          rating: number
          response_text: string | null
          review_text_en: string | null
          review_text_es: string | null
          review_text_pt: string | null
          review_text_ro: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          hotel_id: string
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating: number
          response_text?: string | null
          review_text_en?: string | null
          review_text_es?: string | null
          review_text_pt?: string | null
          review_text_ro?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          hotel_id?: string
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number
          response_text?: string | null
          review_text_en?: string | null
          review_text_es?: string | null
          review_text_pt?: string | null
          review_text_ro?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_themes: {
        Row: {
          created_at: string | null
          hotel_id: string | null
          id: string
          theme_id: string | null
        }
        Insert: {
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          theme_id?: string | null
        }
        Update: {
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          theme_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_themes_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_themes_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_translations: {
        Row: {
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          language_code: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          language_code: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          language_code?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_translations_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_translations_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          accessibility_features: Json | null
          address: string | null
          amenities: Json | null
          cancellation_policy: string | null
          check_in_weekday: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country_id: string | null
          created_at: string | null
          description: string | null
          house_rules: Json | null
          id: string
          is_commissionable: boolean | null
          latitude: number | null
          longitude: number | null
          main_image_url: string | null
          name: string
          owner_id: string | null
          parking_available: boolean | null
          pet_friendly: boolean | null
          price_per_month: number | null
          profile_id: string | null
          property_type_id: string | null
          referred_by: string | null
          stars: number | null
          status: string | null
          updated_at: string | null
          website_url: string | null
          zip_code: string | null
        }
        Insert: {
          accessibility_features?: Json | null
          address?: string | null
          amenities?: Json | null
          cancellation_policy?: string | null
          check_in_weekday?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string | null
          description?: string | null
          house_rules?: Json | null
          id?: string
          is_commissionable?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_image_url?: string | null
          name: string
          owner_id?: string | null
          parking_available?: boolean | null
          pet_friendly?: boolean | null
          price_per_month?: number | null
          profile_id?: string | null
          property_type_id?: string | null
          referred_by?: string | null
          stars?: number | null
          status?: string | null
          updated_at?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Update: {
          accessibility_features?: Json | null
          address?: string | null
          amenities?: Json | null
          cancellation_policy?: string | null
          check_in_weekday?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string | null
          created_at?: string | null
          description?: string | null
          house_rules?: Json | null
          id?: string
          is_commissionable?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_image_url?: string | null
          name?: string
          owner_id?: string | null
          parking_available?: boolean | null
          pet_friendly?: boolean | null
          price_per_month?: number | null
          profile_id?: string | null
          property_type_id?: string | null
          referred_by?: string | null
          stars?: number | null
          status?: string | null
          updated_at?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hotels_property_type"
            columns: ["property_type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_referrals: {
        Row: {
          created_at: string | null
          hotel_id: string | null
          id: string
          leader_id: string
          status: string | null
          traveler_id: string
        }
        Insert: {
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          leader_id: string
          status?: string | null
          traveler_id: string
        }
        Update: {
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          leader_id?: string
          status?: string | null
          traveler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leader_referrals_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_referrals_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_referrals_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "leaders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_referrals_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaders: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_es: string | null
          name_pt: string | null
          name_ro: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          code: string
          country_id: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          is_hotel_owner: boolean | null
          last_name: string | null
          name: string
          phone: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          code: string
          country_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          is_hotel_owner?: boolean | null
          last_name?: string | null
          name: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          code?: string
          country_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          is_hotel_owner?: boolean | null
          last_name?: string | null
          name?: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_commissions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          end_date: string
          id: string
          percentage: number
          promoter_id: string
          start_date: string
          status: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          end_date: string
          id?: string
          percentage: number
          promoter_id: string
          start_date: string
          status?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          percentage?: number
          promoter_id?: string
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoter_commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoter_commissions_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters: {
        Row: {
          bank_info: Json | null
          created_at: string | null
          id: string
          profile_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bank_info?: Json | null
          created_at?: string | null
          id?: string
          profile_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bank_info?: Json | null
          created_at?: string | null
          id?: string
          profile_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promoters_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          status: string | null
          traveler_id: string
          type: Database["public"]["Enums"]["promotion_type"]
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status?: string | null
          traveler_id: string
          type: Database["public"]["Enums"]["promotion_type"]
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status?: string | null
          traveler_id?: string
          type?: Database["public"]["Enums"]["promotion_type"]
        }
        Relationships: [
          {
            foreignKeyName: "promotions_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_types: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_es: string | null
          name_pt: string | null
          name_ro: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_es?: string | null
          name_pt?: string | null
          name_ro?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_type: Database["public"]["Enums"]["referral_type"]
          referred_entity: string
          referrer_entity: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_type: Database["public"]["Enums"]["referral_type"]
          referred_entity: string
          referrer_entity: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_type?: Database["public"]["Enums"]["referral_type"]
          referred_entity?: string
          referrer_entity?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_entity_fkey"
            columns: ["referred_entity"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_entity_fkey"
            columns: ["referrer_entity"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          admin_note: string | null
          comment: string | null
          created_at: string
          hotel_id: string
          id: string
          is_flagged: boolean | null
          is_hidden: boolean | null
          is_notified: boolean | null
          rating: number
          response_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          comment?: string | null
          created_at?: string
          hotel_id: string
          id?: string
          is_flagged?: boolean | null
          is_hidden?: boolean | null
          is_notified?: boolean | null
          rating: number
          response_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          comment?: string | null
          created_at?: string
          hotel_id?: string
          id?: string
          is_flagged?: boolean | null
          is_hidden?: boolean | null
          is_notified?: boolean | null
          rating?: number
          response_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      room_images: {
        Row: {
          alt_text_en: string | null
          alt_text_es: string | null
          alt_text_pt: string | null
          alt_text_ro: string | null
          created_at: string | null
          display_order: number | null
          hotel_id: string
          id: string
          image_type: string | null
          image_url: string
          is_main: boolean | null
        }
        Insert: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          alt_text_pt?: string | null
          alt_text_ro?: string | null
          created_at?: string | null
          display_order?: number | null
          hotel_id: string
          id?: string
          image_type?: string | null
          image_url: string
          is_main?: boolean | null
        }
        Update: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          alt_text_pt?: string | null
          alt_text_ro?: string | null
          created_at?: string | null
          display_order?: number | null
          hotel_id?: string
          id?: string
          image_type?: string | null
          image_url?: string
          is_main?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "room_images_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_images_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          level: number | null
          name: string
          parent_id: string | null
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          name: string
          parent_id?: string | null
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accessibility_options: Json | null
          created_at: string | null
          id: string
          language: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessibility_options?: Json | null
          created_at?: string | null
          id?: string
          language?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessibility_options?: Json | null
          created_at?: string | null
          id?: string
          language?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      availability_packages_public_view: {
        Row: {
          base_price: number | null
          base_price_usd: number | null
          created_at: string | null
          duration: number | null
          duration_days: number | null
          dynamic_increment: number | null
          end_date: string | null
          hotel_id: string | null
          id: string | null
          meal_plan: string | null
          price_increase_pct: number | null
          rooms: number | null
          round_step: number | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          base_price_usd?: number | null
          created_at?: string | null
          duration?: number | null
          duration_days?: number | null
          dynamic_increment?: number | null
          end_date?: string | null
          hotel_id?: string | null
          id?: string | null
          meal_plan?: never
          price_increase_pct?: number | null
          rooms?: number | null
          round_step?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          base_price_usd?: number | null
          created_at?: string | null
          duration?: number | null
          duration_days?: number | null
          dynamic_increment?: number | null
          end_date?: string | null
          hotel_id?: string | null
          id?: string | null
          meal_plan?: never
          price_increase_pct?: number | null
          rooms?: number | null
          round_step?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels_with_filters_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels_with_filters_view: {
        Row: {
          accessibility_features: Json | null
          activity_names: string[] | null
          address: string | null
          amenities: Json | null
          available_months: string[] | null
          cancellation_policy: string | null
          check_in_weekday: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          country_id: string | null
          created_at: string | null
          description: string | null
          house_rules: Json | null
          id: string | null
          is_commissionable: boolean | null
          latitude: number | null
          longitude: number | null
          main_image_url: string | null
          name: string | null
          parking_available: boolean | null
          pet_friendly: boolean | null
          price_per_month: number | null
          profile_id: string | null
          property_style: string | null
          property_type: string | null
          property_type_id: string | null
          referred_by: string | null
          stars: number | null
          status: string | null
          theme_names: string[] | null
          updated_at: string | null
          website_url: string | null
          zip_code: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hotels_property_type"
            columns: ["property_type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      exec_sql: {
        Args: { sql_query: string }
        Returns: string
      }
      read_and_execute_sql_from_storage: {
        Args: Record<PropertyKey, never>
        Returns: {
          file_name: string
          result: string
        }[]
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      promotion_type: "free_nights" | "discount" | "upgrade"
      referral_type: "commission" | "promotion"
      user_role:
        | "traveler"
        | "hotel_owner"
        | "association"
        | "promoter"
        | "leader"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      promotion_type: ["free_nights", "discount", "upgrade"],
      referral_type: ["commission", "promotion"],
      user_role: [
        "traveler",
        "hotel_owner",
        "association",
        "promoter",
        "leader",
        "admin",
      ],
    },
  },
} as const
