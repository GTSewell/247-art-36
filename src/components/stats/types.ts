
export interface PasswordStats {
  site_password: string;
  usage_count: number;
  unique_ip_count: number;
  recipient_name?: string | null;
}

export interface AccessLog {
  id: number;
  created_at: string;
  site_password: string;
  user_provided_name: string | null;
  ip_address: string; // We'll keep this for compatibility with the old table
  original_recipient_name: string | null;
}

// New interface for the simplified password logs
export interface SimplePasswordLog {
  id: number;
  created_at: string;
  site_password: string;
  user_name: string | null;
}
