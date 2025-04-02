
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AccessLog } from "../types";
import { logger } from "@/utils/logger";

export const useAccessLogs = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info("Fetching password access logs");
      
      const { data, error } = await supabase
        .from('password_access_logs')
        .select('id, created_at, site_password, user_provided_name, ip_address')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('Error loading password logs:', error);
        setError(`Failed to load logs: ${error.message}`);
        return;
      }

      logger.info(`Successfully loaded ${data?.length || 0} password access logs`);
      setLogs(data as AccessLog[]);
      setLastRefresh(new Date());
    } catch (err: any) {
      logger.error('Unexpected error loading logs:', err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    
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
          logger.info('Realtime update received for password_access_logs:', payload);
          loadLogs();
        }
      )
      .subscribe((status) => {
        logger.info(`Realtime subscription status for password logs: ${status}`);
      });

    const refreshInterval = setInterval(() => {
      loadLogs();
    }, 30000);

    return () => {
      supabase.removeChannel(logsChannel);
      clearInterval(refreshInterval);
    };
  }, [loadLogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const refreshLogs = () => {
    loadLogs();
  };

  return {
    logs,
    isLoading,
    error,
    formatDate,
    refreshLogs,
    lastRefresh
  };
};
