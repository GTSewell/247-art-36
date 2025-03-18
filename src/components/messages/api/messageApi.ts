
import { supabase } from "@/integrations/supabase/client";
import { Message, RawMessage } from '../types';

// Define explicit return types to avoid deep type instantiation
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

export async function fetchArtistById(artistId: string): Promise<{ name: string, image: string } | null> {
  const { data, error } = await supabase
    .from('artists')
    .select('name, image')
    .eq('id', artistId)
    .single();
    
  if (error) {
    console.error('Error fetching artist:', error);
    return null;
  }
  
  return data;
}

export async function fetchArtistByUserId(userId: string): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('artists')
    .select('id')
    .eq('user_id', userId)
    .single();
    
  if (error) throw error;
  return data as { id: string };
}

export async function createMessageReply(
  messageId: string, 
  replyText: string, 
  userId: string, 
  artistId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages_247')
    .insert({
      message: replyText,
      parent_message_id: messageId,
      sender_id: userId,
      artist_id: artistId,
      status: 'replied'
    });
    
  if (error) throw error;
}

export async function updateMessageStatus(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages_247')
    .update({ 
      status: 'replied',
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
