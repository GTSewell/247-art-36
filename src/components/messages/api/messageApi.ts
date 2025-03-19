
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/data/types/artist";
import { Message, RawMessage } from "../types";
import { processArtistData } from "@/components/artistSubdomain/utils/artistDataProcessor";

// Fetch artist by ID (can be numeric ID or UUID)
export const fetchArtistById = async (artistId: string | number): Promise<Artist | null> => {
  try {
    // Try to fetch by ID (convert to string for query)
    const { data: artistData, error } = await supabase
      .from('artists')
      .select('*')
      .or(`id.eq.${artistId},user_id.eq.${artistId}`)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching artist by ID:', error);
      return null;
    }
    
    return artistData ? processArtistData(artistData) : null;
  } catch (error) {
    console.error('Error in fetchArtistById:', error);
    return null;
  }
};

// Fetch artist by user ID
export const fetchArtistByUserId = async (userId: string): Promise<Artist | null> => {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching artist by user ID:', error);
      return null;
    }
    
    return data ? processArtistData(data) : null;
  } catch (error) {
    console.error('Error in fetchArtistByUserId:', error);
    return null;
  }
};

// Fetch a specific message by ID
export const fetchMessageById = async (messageId: string): Promise<RawMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('messages_247')
      .select('*')
      .eq('id', messageId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching message:', error);
      return null;
    }
    
    return data as RawMessage || null;
  } catch (error) {
    console.error('Error in fetchMessageById:', error);
    return null;
  }
};

// Fetch replies to a specific message
export const fetchMessageReplies = async (parentMessageId: string): Promise<RawMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages_247')
      .select('*')
      .eq('parent_message_id', parentMessageId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching message replies:', error);
      return [];
    }
    
    return data as RawMessage[] || [];
  } catch (error) {
    console.error('Error in fetchMessageReplies:', error);
    return [];
  }
};

// Create a reply to a message
export const createMessageReply = async (
  parentMessageId: string, 
  replyText: string, 
  senderId: string,
  artistId: string
): Promise<boolean> => {
  try {
    // Get the parent message to determine the proper artist_id and sender_id
    const parentMessage = await fetchMessageById(parentMessageId);
    
    if (!parentMessage) {
      console.error('Parent message not found');
      return false;
    }
    
    // The artist_id should be the same as the parent message
    const messageArtistId = parentMessage.artist_id;

    const { error } = await supabase.from('messages_247').insert({
      message: replyText,
      parent_message_id: parentMessageId,
      sender_id: senderId,
      artist_id: messageArtistId,
      status: 'replied'
    });
    
    if (error) {
      console.error('Error creating message reply:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createMessageReply:', error);
    return false;
  }
};

// Update message status (e.g., when replying to a message)
export const updateMessageStatus = async (messageId: string, status = 'replied'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages_247')
      .update({ 
        status: status,
        replied_at: new Date().toISOString() 
      })
      .eq('id', messageId);
      
    if (error) {
      console.error('Error updating message status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateMessageStatus:', error);
    return false;
  }
};

// Delete a message and its replies
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  try {
    // First delete all replies to this message
    const { error: repliesError } = await supabase
      .from('messages_247')
      .delete()
      .eq('parent_message_id', messageId);
      
    if (repliesError) {
      console.error('Error deleting message replies:', repliesError);
      return false;
    }
    
    // Then delete the message itself
    const { error } = await supabase
      .from('messages_247')
      .delete()
      .eq('id', messageId);
      
    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    return false;
  }
};
