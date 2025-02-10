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
      artist_images: {
        Row: {
          artist_id: number
          created_at: string
          image_url: string
        }
        Insert: {
          artist_id: number
          created_at?: string
          image_url: string
        }
        Update: {
          artist_id?: number
          created_at?: string
          image_url?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          artworks: string[] | null
          bio: string
          city: string | null
          country: string | null
          id: number
          image: string
          location: string | null
          locked_artworks: boolean | null
          name: string
          social_platforms:
            | Database["public"]["Enums"]["social_platform"][]
            | null
          specialty: string
          styles: Database["public"]["Enums"]["art_style"][] | null
          techniques: Database["public"]["Enums"]["art_technique"][] | null
        }
        Insert: {
          artworks?: string[] | null
          bio: string
          city?: string | null
          country?: string | null
          id?: number
          image: string
          location?: string | null
          locked_artworks?: boolean | null
          name: string
          social_platforms?:
            | Database["public"]["Enums"]["social_platform"][]
            | null
          specialty: string
          styles?: Database["public"]["Enums"]["art_style"][] | null
          techniques?: Database["public"]["Enums"]["art_technique"][] | null
        }
        Update: {
          artworks?: string[] | null
          bio?: string
          city?: string | null
          country?: string | null
          id?: number
          image?: string
          location?: string | null
          locked_artworks?: boolean | null
          name?: string
          social_platforms?:
            | Database["public"]["Enums"]["social_platform"][]
            | null
          specialty?: string
          styles?: Database["public"]["Enums"]["art_style"][] | null
          techniques?: Database["public"]["Enums"]["art_technique"][] | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          site_password: string
        }
        Insert: {
          created_at?: string
          id?: string
          site_password: string
        }
        Update: {
          created_at?: string
          id?: string
          site_password?: string
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
      art_style:
        | "Abstract"
        | "Realism"
        | "Impressionism"
        | "Surrealism"
        | "Pop Art"
        | "Minimalism"
        | "Contemporary"
        | "Modern"
        | "Traditional"
        | "Folk Art"
        | "Gothic"
        | "Renaissance"
        | "Baroque"
        | "Art Nouveau"
        | "Art Deco"
        | "Expressionism"
        | "Cubism"
        | "Digital"
        | "Urban"
        | "Conceptual"
      art_technique:
        | "Oil Painting"
        | "Watercolor"
        | "Acrylic"
        | "Digital Art"
        | "Photography"
        | "Sculpture"
        | "Printmaking"
        | "Drawing"
        | "Mixed Media"
        | "Collage"
        | "Ceramics"
        | "Textile Art"
        | "Street Art"
        | "Installation"
        | "Performance"
        | "Video Art"
        | "Glasswork"
        | "Metalwork"
        | "Wood Carving"
        | "Lithography"
      social_platform:
        | "Instagram"
        | "Twitter"
        | "Facebook"
        | "YouTube"
        | "TikTok"
        | "DeviantArt"
        | "ArtStation"
        | "Behance"
        | "LinkedIn"
        | "Pinterest"
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
