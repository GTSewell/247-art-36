
import { supabase } from "@/integrations/supabase/client";
import { MessageFilter } from '../types';

// Count total sent messages for pagination
export const fetchSentMessageCount = async (userId: string | undefined, messageFilter: MessageFilter) => {
  if (!userId) return 0;
  
  let query = supabase
    .from('messages_247')
    .select('id', { count: 'exact', head: true })
    .eq('sender_id', userId)
    .is('parent_message_id', null); // Only count main messages, not replies
    
  // Apply filters if not showing all
  if (messageFilter !== 'all') {
    query = query.eq('status', messageFilter);
  }
  
  const { count, error } = await query;
  
  if (error) {
    console.error('Error counting sent messages:', error);
    return 0;
  }
  
  return count || 0;
};

// Count total received messages for pagination
export const fetchReceivedMessageCount = async (userId: string | undefined, messageFilter: MessageFilter) => {
  if (!userId) return 0;
  
  // First get the artist ID for the current user
  const { data: artistData, error: artistError } = await supabase
    .from('artists')
    .select('id')
    .eq('user_id', userId)
    .single();
    
  if (artistError) {
    if (artistError.code === 'PGRST116') {
      return 0;
    }
    console.error('Error fetching artist profile:', artistError);
    return 0;
  }
  
  if (!artistData) return 0;
  
  let query = supabase
    .from('messages_247')
    .select('id', { count: 'exact', head: true })
    .eq('artist_id', artistData.id.toString())
    .is('parent_message_id', null); // Only count main messages, not replies
    
  // Apply filters if not showing all
  if (messageFilter !== 'all') {
    query = query.eq('status', messageFilter);
  }
  
  const { count, error } = await query;
  
  if (error) {
    console.error('Error counting received messages:', error);
    return 0;
  }
  
  return count || 0;
};
