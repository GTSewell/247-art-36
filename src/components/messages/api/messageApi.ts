
import { supabase } from "@/integrations/supabase/client";
import { Message, RawMessage } from "../types";

// Define explicit types for our responses, not for the table structure
export async function fetchMessageById(messageId: string): Promise<RawMessage> {
  const { data, error } = await supabase
    .from('messages_247')
    .select('*')
    .eq('id', messageId)
    .single();
    
  if (error) throw error;
  return data as RawMessage;
}

export async function fetchMessageReplies(messageId: string): Promise<RawMessage[]> {
  const { data, error } = await supabase
    .from('messages_247')
    .select('*')
    .eq('parent_message_id', messageId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return data as RawMessage[];
}

export async function fetchArtistById(artistId: string): Promise<{ name: string; image: string } | null> {
  try {
    // The artists table uses numeric IDs, so we need to convert if it's a UUID format
    // First check if it looks like a UUID (contains hyphens)
    if (artistId.includes('-')) {
      // It's likely a UUID format, we need to look up the numeric ID first
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id, name, image')
        .eq('user_id', artistId)
        .maybeSingle();
        
      if (artistError || !artistData) {
        console.error('Error fetching artist by UUID:', artistError || 'No artist found');
        return null;
      }
      
      return {
        name: artistData.name || 'Unknown Artist',
        image: artistData.image || ''
      };
    } else {
      // It's likely a numeric ID, convert it to a number
      const artistIdNum = parseInt(artistId, 10);
      
      if (isNaN(artistIdNum)) {
        console.error("Invalid artist ID format:", artistId);
        return null;
      }
      
      const { data, error } = await supabase
        .from('artists')
        .select('name, image')
        .eq('id', artistIdNum)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching artist:", error);
        return null;
      }
      
      return data as { name: string; image: string } || null;
    }
  } catch (error) {
    console.error("Error in fetchArtistById:", error);
    return null;
  }
}

export async function fetchArtistByUserId(userId: string): Promise<{ id: string } | null> {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error || !data) {
      console.error("Error fetching artist by user ID:", error || "No artist found");
      return null;
    }
    
    return { id: data.id.toString() };
  } catch (error) {
    console.error("Error in fetchArtistByUserId:", error);
    return null;
  }
}

export async function createMessageReply(
  messageId: string,
  replyText: string,
  userId: string,
  artistId: string
): Promise<void> {
  // First, get the original message to obtain the correct artist_id
  const { data: originalMessage, error: fetchError } = await supabase
    .from('messages_247')
    .select('artist_id, sender_id')
    .eq('id', messageId)
    .single();
  
  if (fetchError) {
    console.error("Error fetching original message:", fetchError);
    throw fetchError;
  }
  
  console.log("Creating reply for message with artist_id:", originalMessage.artist_id);
  
  // Use the artist_id from the original message to ensure we're using the correct format
  const { error } = await supabase
    .from('messages_247')
    .insert({
      message: replyText,
      parent_message_id: messageId,
      sender_id: userId,
      artist_id: originalMessage.artist_id, // Use the artist_id from the original message
      status: "replied"
    });
    
  if (error) {
    console.error("Error creating message reply:", error);
    throw error;
  }
}

export async function updateMessageStatus(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages_247')
    .update({
      status: "replied",
      replied_at: new Date().toISOString()
    })
    .eq('id', messageId);
    
  if (error) throw error;
}

export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages_247')
    .delete()
    .eq('id', messageId);
    
  if (error) throw error;
}
