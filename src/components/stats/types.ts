
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
  // Make these properties optional since we're not tracking them anymore
  ip_address?: string;
  original_recipient_name?: string | null;
}
