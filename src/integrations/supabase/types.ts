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
          artworks: Json | null
          bio: string | null
          city: string | null
          country: string | null
          id: number
          image: string | null
          location: string | null
          locked_artworks: boolean | null
          name: string | null
          social_platforms: Json | null
          specialty: string | null
          styles: Json | null
          techniques: Json | null
        }
        Insert: {
          artworks?: Json | null
          bio?: string | null
          city?: string | null
          country?: string | null
          id: number
          image?: string | null
          location?: string | null
          locked_artworks?: boolean | null
          name?: string | null
          social_platforms?: Json | null
          specialty?: string | null
          styles?: Json | null
          techniques?: Json | null
        }
        Update: {
          artworks?: Json | null
          bio?: string | null
          city?: string | null
          country?: string | null
          id?: number
          image?: string | null
          location?: string | null
          locked_artworks?: boolean | null
          name?: string | null
          social_platforms?: Json | null
          specialty?: string | null
          styles?: Json | null
          techniques?: Json | null
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
      site_settings: {
        Row: {
          created_at: string | null
          id: string | null
          site_password: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          site_password?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          site_password?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gallery_style: "contemporary" | "modern" | "classical" | "experimental"
      gallery_type: "commercial" | "non_profit" | "museum" | "artist_run"
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
