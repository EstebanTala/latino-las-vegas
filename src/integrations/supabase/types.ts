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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          category: string
          clicked_at: string
          id: string
          listing_id: string
        }
        Insert: {
          category: string
          clicked_at?: string
          id?: string
          listing_id: string
        }
        Update: {
          category?: string
          clicked_at?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      business_submissions: {
        Row: {
          address: string | null
          business_name: string
          category: string
          contact_email: string
          contact_name: string
          created_at: string
          id: string
          instagram: string | null
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          category: string
          contact_email: string
          contact_name: string
          created_at?: string
          id?: string
          instagram?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          category?: string
          contact_email?: string
          contact_name?: string
          created_at?: string
          id?: string
          instagram?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          about: string | null
          address: string | null
          admission_type: string | null
          affiliate_cta_label: string | null
          affiliate_cta_url: string | null
          affiliate_last_updated: string | null
          affiliate_provider: string | null
          amenities: string[] | null
          badge: string | null
          best_time: string | null
          best_visit_time: string | null
          cat: string
          cat_label: string
          created_at: string
          cuisine: string[] | null
          description: string
          dress_code: string | null
          duration: string | null
          experience_location: string | null
          experience_type: string[] | null
          facebook: string | null
          food_available: string | null
          gallery_images: string[] | null
          google_last_synced_at: string | null
          google_maps_link: string | null
          google_maps_url: string | null
          google_place_id: string | null
          google_rating: number | null
          google_user_ratings_total: number | null
          happy_hour_days: string | null
          happy_hour_details: string | null
          highlight: string | null
          highlights: string[] | null
          hours: string | null
          icon: string | null
          id: string
          ideal_for: string[] | null
          image: string | null
          image2: string | null
          image3: string | null
          image4: string | null
          image5: string | null
          image6: string | null
          instagram: string | null
          is_featured: boolean
          is_sponsored: boolean
          located_in_listing_id: string | null
          logo_url: string | null
          minimum_age: string | null
          music_genres: string[] | null
          name: string
          order_online_url: string | null
          phone: string | null
          popular_dishes: Json | null
          price: string | null
          price_from: string | null
          price_max: number | null
          price_min: number | null
          property_type: string | null
          recomendacion_resumen: string | null
          recomendado_bullets: string[] | null
          region: string | null
          reservation_url: string | null
          show_experience_type: string[] | null
          show_type: string | null
          slug: string
          stars: number | null
          start_datetime: string | null
          tagline: string | null
          tiktok: string | null
          trending_tag: string | null
          twitter_x: string | null
          updated_at: string
          useful_info: Json | null
          venue_type: string[] | null
          video_url: string | null
          website: string | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          admission_type?: string | null
          affiliate_cta_label?: string | null
          affiliate_cta_url?: string | null
          affiliate_last_updated?: string | null
          affiliate_provider?: string | null
          amenities?: string[] | null
          badge?: string | null
          best_time?: string | null
          best_visit_time?: string | null
          cat: string
          cat_label: string
          created_at?: string
          cuisine?: string[] | null
          description: string
          dress_code?: string | null
          duration?: string | null
          experience_location?: string | null
          experience_type?: string[] | null
          facebook?: string | null
          food_available?: string | null
          gallery_images?: string[] | null
          google_last_synced_at?: string | null
          google_maps_link?: string | null
          google_maps_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_user_ratings_total?: number | null
          happy_hour_days?: string | null
          happy_hour_details?: string | null
          highlight?: string | null
          highlights?: string[] | null
          hours?: string | null
          icon?: string | null
          id?: string
          ideal_for?: string[] | null
          image?: string | null
          image2?: string | null
          image3?: string | null
          image4?: string | null
          image5?: string | null
          image6?: string | null
          instagram?: string | null
          is_featured?: boolean
          is_sponsored?: boolean
          located_in_listing_id?: string | null
          logo_url?: string | null
          minimum_age?: string | null
          music_genres?: string[] | null
          name: string
          order_online_url?: string | null
          phone?: string | null
          popular_dishes?: Json | null
          price?: string | null
          price_from?: string | null
          price_max?: number | null
          price_min?: number | null
          property_type?: string | null
          recomendacion_resumen?: string | null
          recomendado_bullets?: string[] | null
          region?: string | null
          reservation_url?: string | null
          show_experience_type?: string[] | null
          show_type?: string | null
          slug: string
          stars?: number | null
          start_datetime?: string | null
          tagline?: string | null
          tiktok?: string | null
          trending_tag?: string | null
          twitter_x?: string | null
          updated_at?: string
          useful_info?: Json | null
          venue_type?: string[] | null
          video_url?: string | null
          website?: string | null
        }
        Update: {
          about?: string | null
          address?: string | null
          admission_type?: string | null
          affiliate_cta_label?: string | null
          affiliate_cta_url?: string | null
          affiliate_last_updated?: string | null
          affiliate_provider?: string | null
          amenities?: string[] | null
          badge?: string | null
          best_time?: string | null
          best_visit_time?: string | null
          cat?: string
          cat_label?: string
          created_at?: string
          cuisine?: string[] | null
          description?: string
          dress_code?: string | null
          duration?: string | null
          experience_location?: string | null
          experience_type?: string[] | null
          facebook?: string | null
          food_available?: string | null
          gallery_images?: string[] | null
          google_last_synced_at?: string | null
          google_maps_link?: string | null
          google_maps_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_user_ratings_total?: number | null
          happy_hour_days?: string | null
          happy_hour_details?: string | null
          highlight?: string | null
          highlights?: string[] | null
          hours?: string | null
          icon?: string | null
          id?: string
          ideal_for?: string[] | null
          image?: string | null
          image2?: string | null
          image3?: string | null
          image4?: string | null
          image5?: string | null
          image6?: string | null
          instagram?: string | null
          is_featured?: boolean
          is_sponsored?: boolean
          located_in_listing_id?: string | null
          logo_url?: string | null
          minimum_age?: string | null
          music_genres?: string[] | null
          name?: string
          order_online_url?: string | null
          phone?: string | null
          popular_dishes?: Json | null
          price?: string | null
          price_from?: string | null
          price_max?: number | null
          price_min?: number | null
          property_type?: string | null
          recomendacion_resumen?: string | null
          recomendado_bullets?: string[] | null
          region?: string | null
          reservation_url?: string | null
          show_experience_type?: string[] | null
          show_type?: string | null
          slug?: string
          stars?: number | null
          start_datetime?: string | null
          tagline?: string | null
          tiktok?: string | null
          trending_tag?: string | null
          twitter_x?: string | null
          updated_at?: string
          useful_info?: Json | null
          venue_type?: string[] | null
          video_url?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_located_in_listing_id_fkey"
            columns: ["located_in_listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      taxonomy_amenities: {
        Row: {
          active: boolean
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_group: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          parent_group: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_group?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      taxonomy_attraction_types: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      taxonomy_cuisines: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      taxonomy_music_genres: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      taxonomy_show_types: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      taxonomy_venue_types: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      taxonomy_zones: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
