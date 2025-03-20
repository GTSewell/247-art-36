
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PasswordStats } from "../types";

export const usePasswordStats = () => {
  const [stats, setStats] = useState<PasswordStats[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string>("");

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
          console.log('Realtime update received for site_settings:', payload);
          loadStats(); // Reload stats when changes occur
        }
      )
      .subscribe();

    // Cleanup subscriptions
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

  const handleRecipientUpdate = async (password: string) => {
    setIsUpdating(password);
  };

  const saveRecipientName = async (password: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ recipient_name: recipientName })
        .eq('site_password', password);

      if (error) {
        console.error('Error updating recipient name:', error);
        return;
      }

      console.log('Recipient name updated successfully');
      setIsUpdating(null);
      setRecipientName("");
      loadStats(); // Reload stats to reflect the update
    } catch (error) {
      console.error('Error in saveRecipientName:', error);
    }
  };

  return {
    stats,
    isUpdating,
    recipientName,
    setRecipientName,
    handleRecipientUpdate,
    saveRecipientName
  };
};
