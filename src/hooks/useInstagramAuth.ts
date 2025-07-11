import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InstagramConnection {
  id: string;
  user_id: string;
  instagram_user_id: string;
  access_token: string;
  username: string;
  full_name: string | null;
  profile_picture_url: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export const useInstagramAuth = () => {
  const [connection, setConnection] = useState<InstagramConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing connection
  useEffect(() => {
    const loadConnection = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('instagram_connections')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading Instagram connection:', error);
          return;
        }

        setConnection(data);
      } catch (error) {
        console.error('Error in loadConnection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConnection();
  }, []);

  const connectInstagram = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          scopes: 'instagram_basic,pages_show_list,instagram_manage_insights',
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        toast.error(`Failed to connect Instagram: ${error.message}`);
        return;
      }

      toast.success('Redirecting to Instagram authentication...');
    } catch (error: any) {
      console.error('Instagram connection error:', error);
      toast.error(`Connection failed: ${error.message}`);
    }
  };

  const disconnectInstagram = async () => {
    try {
      if (!connection) return;

      const { error } = await supabase
        .from('instagram_connections')
        .delete()
        .eq('id', connection.id);

      if (error) {
        toast.error(`Failed to disconnect Instagram: ${error.message}`);
        return;
      }

      setConnection(null);
      toast.success('Instagram disconnected successfully');
    } catch (error: any) {
      console.error('Instagram disconnection error:', error);
      toast.error(`Disconnection failed: ${error.message}`);
    }
  };

  const refreshConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('instagram_connections')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error refreshing Instagram connection:', error);
        return;
      }

      setConnection(data);
    } catch (error) {
      console.error('Error in refreshConnection:', error);
    }
  };

  return {
    connection,
    isLoading,
    connectInstagram,
    disconnectInstagram,
    refreshConnection,
    isConnected: !!connection
  };
};