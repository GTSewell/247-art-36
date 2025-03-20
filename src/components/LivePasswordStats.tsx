
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PasswordStats {
  site_password: string;
  usage_count: number;
  unique_ip_count: number;
  recipient_name?: string | null;
}

export const LivePasswordStats = () => {
  const [stats, setStats] = useState<PasswordStats[]>([]);

  useEffect(() => {
    // Initial load of stats
    loadStats();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',  // Listen to all changes (insert, update, delete)
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          loadStats(); // Reload stats when changes occur
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('site_password, usage_count, unique_ip_count, recipient_name');

    if (error) {
      console.error('Error loading password stats:', error);
      return;
    }

    setStats(data || []);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live Password Usage Statistics</h2>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.site_password} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{stat.site_password}</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-600">Total Uses</p>
                <p className="text-lg font-bold">{stat.usage_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique IPs</p>
                <p className="text-lg font-bold">{stat.unique_ip_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="text-lg font-bold">{stat.recipient_name || "—"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePasswordStats;
