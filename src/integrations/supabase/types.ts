export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          replied_at?: string | null
          sender_id?: string
          status?: string
        }
        Relationships: []
      }
      password_access_logs: {
        Row: {
          created_at: string
          id: number
          ip_address: string
          site_password: string
        }
        Insert: {
          created_at?: string
          id?: number
          ip_address: string
          site_password: string
        }
        Update: {
          created_at?: string
          id?: number
          ip_address?: string
          site_password?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          artist_id: number | null
          available_quantity: number | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string | null
          end_time: string | null
          id: number
          image_url: string | null
          is_featured: boolean | null
          is_limited_edition: boolean | null
          name: string
          price: number
        }
        Insert: {
          artist_id?: number | null
          available_quantity?: number | null
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          is_limited_edition?: boolean | null
          name: string
          price: number
        }
        Update: {
          artist_id?: number | null
          available_quantity?: number | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          is_limited_edition?: boolean | null
          name?: string
          price?: number
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
      site_settings: {
        Row: {
          created_at: string | null
          id: string | null
          ID: string | null
          site_password: string | null
          unique_ip_count: number | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          ID?: string | null
          site_password?: string | null
          unique_ip_count?: number | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          ID?: string | null
          site_password?: string | null
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
      [_ in never]: never
    }
    Enums: {
      gallery_style: "contemporary" | "modern" | "classical" | "experimental"
      gallery_type: "commercial" | "non_profit" | "museum" | "artist_run"
      product_category: "print" | "merch" | "sticker"
      social_platform: "instagram" | "facebook" | "twitter" | "linkedin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
