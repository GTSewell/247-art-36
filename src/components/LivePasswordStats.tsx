
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PasswordStats {
  site_password: string;
  usage_count: number;
  unique_ip_count: number;
  recipient_name?: string | null;
}

interface AccessLog {
  id: number;
  site_password: string;
  ip_address: string;
  created_at: string;
  original_recipient_name: string | null;
  user_provided_name: string | null;
}

export const LivePasswordStats = () => {
  const [stats, setStats] = useState<PasswordStats[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    // Initial load of stats and logs
    loadStats();
    loadLogs();

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
          console.log('Realtime update received for site_settings:', payload);
          loadStats(); // Reload stats when changes occur
        }
      )
      .subscribe();

    // Subscribe to logs changes
    const logsChannel = supabase
      .channel('password_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'password_access_logs'
        },
        (payload) => {
          console.log('Realtime update received for password_access_logs:', payload);
          loadLogs(); // Reload logs when changes occur
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(logsChannel);
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

  const loadLogs = async () => {
    const { data, error } = await supabase
      .from('password_access_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading password logs:', error);
      return;
    }

    setLogs(data || []);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-4 space-y-8">
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

      <h2 className="text-xl font-bold mt-8 mb-4">Recent Access Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.site_password}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip_address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.original_recipient_name || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user_provided_name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LivePasswordStats;
