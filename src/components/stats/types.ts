
export interface PasswordStats {
  site_password: string;
  usage_count: number;
  unique_ip_count: number;
  recipient_name?: string | null;
}

export interface AccessLog {
  id: number;
  site_password: string;
  ip_address: string;
  created_at: string;
  original_recipient_name: string | null;
  user_provided_name: string | null;
}
