
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AccessLog } from "../types";

export const useAccessLogs = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    // Initial load of logs
    loadLogs();

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
      supabase.removeChannel(logsChannel);
    };
  }, []);

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

  return {
    logs,
    formatDate
  };
};
