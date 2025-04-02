
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
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('Error loading password logs:', error);
        setError(`Failed to load logs: ${error.message}`);
        return;
      }

      logger.info(`Successfully loaded ${data?.length || 0} password access logs`);
      
      // Add more detailed logging about the data
      if (data && data.length > 0) {
        logger.info('Sample log entry:', { 
          first_entry: { 
            id: data[0].id,
            created_at: data[0].created_at,
            site_password: data[0].site_password?.substring(0, 2) + '***' || 'none' 
          }
        });
      } else {
        logger.info('No log entries found in the database');
      }
      
      setLogs(data || []);
      setLastRefresh(new Date());
    } catch (err: any) {
      logger.error('Unexpected error loading logs:', err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load of logs
  useEffect(() => {
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
          logger.info('Realtime update received for password_access_logs:', payload);
          loadLogs(); // Reload logs when changes occur
        }
      )
      .subscribe((status) => {
        logger.info(`Realtime subscription status for password logs: ${status}`);
      });

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      loadLogs();
    }, 30000); // 30 seconds

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(logsChannel);
      clearInterval(refreshInterval);
    };
  }, [loadLogs]);

  const refreshLogs = () => {
    loadLogs();
  };

  return {
    logs,
    isLoading,
    error,
    refreshLogs,
    lastRefresh
  };
};
