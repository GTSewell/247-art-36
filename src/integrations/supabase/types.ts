export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      artist_profiles: {
        Row: {
          artist_id: number
          background_color: string | null
          background_image: string | null
          created_at: string
          id: string
          links: Json | null
          panel_color: string | null
          updated_at: string
        }
        Insert: {
          artist_id: number
          background_color?: string | null
          background_image?: string | null
          created_at?: string
          id?: string
          links?: Json | null
          panel_color?: string | null
          updated_at?: string
        }
        Update: {
          artist_id?: number
          background_color?: string | null
          background_image?: string | null
          created_at?: string
          id?: string
          links?: Json | null
          panel_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_profiles_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: true
            referencedRelation: "artist_stp_packs"
            referencedColumns: ["artist_id"]
          },
          {
            foreignKeyName: "artist_profiles_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: true
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_submissions: {
        Row: {
          artist_name: string
          comments: string | null
          created_at: string
          email: string
          id: number
          instagram_handle: string | null
          status: string | null
        }
        Insert: {
          artist_name: string
          comments?: string | null
          created_at?: string
          email: string
          id?: number
          instagram_handle?: string | null
          status?: string | null
        }
        Update: {
          artist_name?: string
          comments?: string | null
          created_at?: string
          email?: string
          id?: number
          instagram_handle?: string | null
          status?: string | null
        }
        Relationships: []
      }
      artists: {
        Row: {
          artwork_files: Json | null
          artworks: Json | null
          bio: string | null
          city: string | null
          country: string | null
          highlight_bio: string | null
          id: number
          image: string | null
          location: string | null
          locked_artworks: boolean | null
          name: string | null
          profile_image_url: string | null
          published: boolean | null
          social_platforms: Json | null
          specialty: string | null
          styles: Json | null
          techniques: Json | null
          user_id: string | null
        }
        Insert: {
          artwork_files?: Json | null
          artworks?: Json | null
          bio?: string | null
          city?: string | null
          country?: string | null
          highlight_bio?: string | null
          id: number
          image?: string | null
          location?: string | null
          locked_artworks?: boolean | null
          name?: string | null
          profile_image_url?: string | null
          published?: boolean | null
          social_platforms?: Json | null
          specialty?: string | null
          styles?: Json | null
          techniques?: Json | null
          user_id?: string | null
        }
        Update: {
          artwork_files?: Json | null
          artworks?: Json | null
          bio?: string | null
          city?: string | null
          country?: string | null
          highlight_bio?: string | null
          id?: number
          image?: string | null
          location?: string | null
          locked_artworks?: boolean | null
          name?: string | null
          profile_image_url?: string | null
          published?: boolean | null
          social_platforms?: Json | null
          specialty?: string | null
          styles?: Json | null
          techniques?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorite_artists: {
        Row: {
          artist_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          artist_id: number
          created_at?: string
          id?: never
          user_id: string
        }
        Update: {
          artist_id?: number
          created_at?: string
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_stp_packs"
            referencedColumns: ["artist_id"]
          },
          {
            foreignKeyName: "favorite_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_artists_rotation: {
        Row: {
          artist_ids: number[]
          created_at: string
          id: string
          rotation_date: string
          updated_at: string
          used_artist_ids: number[] | null
        }
        Insert: {
          artist_ids: number[]
          created_at?: string
          id?: string
          rotation_date?: string
          updated_at?: string
          used_artist_ids?: number[] | null
        }
        Update: {
          artist_ids?: number[]
          created_at?: string
          id?: string
          rotation_date?: string
          updated_at?: string
          used_artist_ids?: number[] | null
        }
        Relationships: []
      }
      galleries: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          established_year: number | null
          gallery_types: Database["public"]["Enums"]["gallery_type"][] | null
          id: number
          image: string | null
          location: string | null
          name: string
          size_sqm: number | null
          social_platforms:
            | Database["public"]["Enums"]["social_platform"][]
            | null
          specialty: string | null
          styles: Database["public"]["Enums"]["gallery_style"][] | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          established_year?: number | null
          gallery_types?: Database["public"]["Enums"]["gallery_type"][] | null
          id?: never
          image?: string | null
          location?: string | null
          name: string
          size_sqm?: number | null
          social_platforms?:
            | Database["public"]["Enums"]["social_platform"][]
            | null
          specialty?: string | null
          styles?: Database["public"]["Enums"]["gallery_style"][] | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          established_year?: number | null
          gallery_types?: Database["public"]["Enums"]["gallery_type"][] | null
          id?: never
          image?: string | null
          location?: string | null
          name?: string
          size_sqm?: number | null
          social_platforms?:
            | Database["public"]["Enums"]["social_platform"][]
            | null
          specialty?: string | null
          styles?: Database["public"]["Enums"]["gallery_style"][] | null
          website?: string | null
        }
        Relationships: []
      }
      instagram_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          full_name: string | null
          id: string
          instagram_user_id: string
          profile_picture_url: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          full_name?: string | null
          id?: string
          instagram_user_id: string
          profile_picture_url?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          instagram_user_id?: string
          profile_picture_url?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      message_credits: {
        Row: {
          amount: number
          artist_id: string
          created_at: string
          expires_at: string
          id: string
          message_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount?: number
          artist_id: string
          created_at?: string
          expires_at: string
          id?: string
          message_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          artist_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          message_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_credits_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages_247"
            referencedColumns: ["id"]
          },
        ]
      }
      messages_247: {
        Row: {
          artist_id: string
          created_at: string
          credit_amount: number
          id: string
          message: string
          parent_message_id: string | null
          replied_at: string | null
          sender_id: string
          status: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          credit_amount?: number
          id?: string
          message: string
          parent_message_id?: string | null
          replied_at?: string | null
          sender_id: string
          status?: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          credit_amount?: number
          id?: string
          message?: string
          parent_message_id?: string | null
          replied_at?: string | null
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_247_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages_247"
            referencedColumns: ["id"]
          },
        ]
      }
      password_access_logs: {
        Row: {
          created_at: string
          id: number
          ip_address: string
          original_recipient_name: string | null
          site_password: string
          user_provided_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          ip_address: string
          original_recipient_name?: string | null
          site_password: string
          user_provided_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          ip_address?: string
          original_recipient_name?: string | null
          site_password?: string
          user_provided_name?: string | null
        }
        Relationships: []
      }
      password_logs: {
        Row: {
          created_at: string | null
          id: number
          site_password: string
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          site_password: string
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          site_password?: string
          user_name?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          additional_images: Json | null
          artist_id: number | null
          available_quantity: number | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          custom_description: string | null
          description: string | null
          end_time: string | null
          hero_image_url: string | null
          id: number
          image_url: string | null
          is_featured: boolean | null
          is_limited_edition: boolean | null
          last_synced_at: string | null
          name: string
          price: number
          production_info: string | null
          shipping_info: string | null
          shopify_handle: string | null
          shopify_inventory_quantity: number | null
          shopify_product_id: string | null
          shopify_tags: Json | null
          shopify_variant_id: string | null
          specifications: Json | null
        }
        Insert: {
          additional_images?: Json | null
          artist_id?: number | null
          available_quantity?: number | null
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          custom_description?: string | null
          description?: string | null
          end_time?: string | null
          hero_image_url?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          is_limited_edition?: boolean | null
          last_synced_at?: string | null
          name: string
          price: number
          production_info?: string | null
          shipping_info?: string | null
          shopify_handle?: string | null
          shopify_inventory_quantity?: number | null
          shopify_product_id?: string | null
          shopify_tags?: Json | null
          shopify_variant_id?: string | null
          specifications?: Json | null
        }
        Update: {
          additional_images?: Json | null
          artist_id?: number | null
          available_quantity?: number | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          custom_description?: string | null
          description?: string | null
          end_time?: string | null
          hero_image_url?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          is_limited_edition?: boolean | null
          last_synced_at?: string | null
          name?: string
          price?: number
          production_info?: string | null
          shipping_info?: string | null
          shopify_handle?: string | null
          shopify_inventory_quantity?: number | null
          shopify_product_id?: string | null
          shopify_tags?: Json | null
          shopify_variant_id?: string | null
          specifications?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_stp_packs"
            referencedColumns: ["artist_id"]
          },
          {
            foreignKeyName: "products_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_sync_log: {
        Row: {
          created_at: string
          id: string
          products_failed: number
          products_synced: number
          sync_details: Json | null
          sync_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          products_failed?: number
          products_synced?: number
          sync_details?: Json | null
          sync_type: string
        }
        Update: {
          created_at?: string
          id?: string
          products_failed?: number
          products_synced?: number
          sync_details?: Json | null
          sync_type?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string | null
          ID: string | null
          recipient_name: string | null
          Sent: string | null
          "Signed Up": string | null
          site_password: string
          unique_ip_count: number | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          ID?: string | null
          recipient_name?: string | null
          Sent?: string | null
          "Signed Up"?: string | null
          site_password: string
          unique_ip_count?: number | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          ID?: string | null
          recipient_name?: string | null
          Sent?: string | null
          "Signed Up"?: string | null
          site_password?: string
          unique_ip_count?: number | null
          usage_count?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      artist_stp_packs: {
        Row: {
          artist_id: number | null
          artist_image: string | null
          artist_name: string | null
          products: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      gallery_style: "contemporary" | "modern" | "classical" | "experimental"
      gallery_type: "commercial" | "non_profit" | "museum" | "artist_run"
      product_category:
        | "print"
        | "merch"
        | "sticker"
        | "original"
        | "signed"
        | "collection"
      social_platform: "instagram" | "facebook" | "twitter" | "linkedin"
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
      gallery_style: ["contemporary", "modern", "classical", "experimental"],
      gallery_type: ["commercial", "non_profit", "museum", "artist_run"],
      product_category: [
        "print",
        "merch",
        "sticker",
        "original",
        "signed",
        "collection",
      ],
      social_platform: ["instagram", "facebook", "twitter", "linkedin"],
    },
  },
} as const
