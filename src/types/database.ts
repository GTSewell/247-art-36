
import { Database } from "@/integrations/supabase/types";

// Type-safe table definitions extracted from the Database type
export type Tables = Database["public"]["Tables"];

// Site Settings table row type
export type SiteSettingsRow = Tables["site_settings"]["Row"];

// Password access logs table row type
export type PasswordAccessLogRow = Tables["password_access_logs"]["Row"];
