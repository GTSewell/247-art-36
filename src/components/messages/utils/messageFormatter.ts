
import { Message, RawMessage } from "../types";
import { fetchArtistById } from "../api/messageApi";
import { useAuth } from "@/hooks/use-auth";

export async function formatMessage(rawMessage: RawMessage, currentUserId?: string): Promise<Message> {
  try {
    // Fetch artist data using artist_id
    const artistData = await fetchArtistById(rawMessage.artist_id);
    
    // Determine if this message is from the artist or from the user
    const isFromArtist = rawMessage.sender_id === rawMessage.artist_id;
    const isCurrentUser = currentUserId && rawMessage.sender_id === currentUserId;
    
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: artistData ? { 
        name: artistData.name || 'Unknown Artist', 
        image: artistData.image || '' 
      } : { 
        name: 'Unknown Artist', 
        image: '' 
      },
      // Clear identification of sender and recipient
      sender: { 
        email: isFromArtist ? (artistData?.name || 'Artist') : (isCurrentUser ? 'You' : 'User'),
        isCurrentUser: isCurrentUser
      },
      recipient: {
        name: isFromArtist ? (isCurrentUser ? 'You' : 'User') : (artistData?.name || 'Unknown Artist') 
      }
    };
  } catch (error) {
    console.error("Error formatting message:", error);
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: { name: 'Unknown Artist', image: '' },
      sender: { email: currentUserId && rawMessage.sender_id === currentUserId ? 'You' : 'Unknown User' },
      recipient: { name: 'Unknown Recipient' }
    };
  }
}

export async function formatMessages(rawMessages: RawMessage[], currentUserId?: string): Promise<Message[]> {
  return Promise.all(rawMessages.map(message => formatMessage(message, currentUserId)));
}
