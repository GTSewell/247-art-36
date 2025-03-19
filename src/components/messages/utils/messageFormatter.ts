
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
    
    // Get sender and recipient names
    const artistName = artistData?.name || 'Unknown Artist';
    const senderName = isFromArtist ? artistName : (isCurrentUser ? 'You' : 'User');
    const recipientName = isFromArtist ? (isCurrentUser ? 'You' : 'User') : artistName;
    
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: { 
        name: artistName, 
        image: artistData?.image || '' 
      },
      // Clear identification of sender and recipient
      sender: { 
        email: senderName,
        isCurrentUser: isCurrentUser
      },
      recipient: {
        name: recipientName
      }
    };
  } catch (error) {
    console.error("Error formatting message:", error);
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: { name: 'Unknown Artist', image: '' },
      sender: { 
        email: currentUserId && rawMessage.sender_id === currentUserId ? 'You' : 'Unknown User',
        isCurrentUser: currentUserId && rawMessage.sender_id === currentUserId 
      },
      recipient: { name: 'Unknown Recipient' }
    };
  }
}

export async function formatMessages(rawMessages: RawMessage[], currentUserId?: string): Promise<Message[]> {
  return Promise.all(rawMessages.map(message => formatMessage(message, currentUserId)));
}
