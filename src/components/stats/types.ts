
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
  ip_address: string; // This must be required since the DB column is not nullable
  original_recipient_name: string | null;
}
