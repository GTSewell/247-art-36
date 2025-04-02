
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
      
      // Try to fetch from the new password_logs table first
      const { data: simpleLogs, error: simpleLogsError } = await supabase
        .from('password_logs')
        .select('id, created_at, site_password, user_name')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (simpleLogsError) {
        logger.error('Error loading simple password logs:', simpleLogsError);
        
        // Fall back to the original table if there's an error
        const { data: originalLogs, error: originalLogsError } = await supabase
          .from('password_access_logs')
          .select('id, created_at, site_password, user_provided_name, ip_address, original_recipient_name')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (originalLogsError) {
          logger.error('Error loading original logs too:', originalLogsError);
          setError(`Failed to load any logs: ${originalLogsError.message}`);
          return;
        }
        
        logger.info(`Loaded ${originalLogs?.length || 0} logs from original table`);
        setLogs(originalLogs as AccessLog[]);
      } else {
        // Map the simple logs to the AccessLog format
        const formattedLogs = simpleLogs.map(log => ({
          id: log.id,
          created_at: log.created_at,
          site_password: log.site_password,
          user_provided_name: log.user_name,
          ip_address: 'not-tracked', // Provide a placeholder since the type expects this field
          original_recipient_name: null
        })) as AccessLog[];
        
        logger.info(`Successfully loaded ${formattedLogs.length} logs from simple logs table`);
        setLogs(formattedLogs);
      }
      
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
    
    // Listen for changes to both password log tables
    const logsChannel = supabase
      .channel('password_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'password_logs'
        },
        (payload) => {
          logger.info('Realtime update received for password_logs:', payload);
          loadLogs();
        }
      )
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
