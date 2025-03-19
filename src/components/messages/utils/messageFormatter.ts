
import { Message, RawMessage } from "../types";
import { fetchArtistById } from "../api/messageApi";

export async function formatMessage(rawMessage: RawMessage): Promise<Message> {
  try {
    // Convert artist_id to string for consistent handling
    const artistId = rawMessage.artist_id.toString();
    
    // Fetch artist data
    const artistData = await fetchArtistById(artistId);
    
    // Determine if this message is from the artist or from the user
    const isFromArtist = rawMessage.sender_id === artistId;
    
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: artistData || { name: 'Unknown Artist', image: '' },
      // Don't expose email addresses in UI
      sender: { email: isFromArtist ? artistData?.name || 'Artist' : 'You' }
    };
  } catch (error) {
    console.error("Error formatting message:", error);
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: { name: 'Unknown Artist', image: '' },
      sender: { email: 'You' }
    };
  }
}

export async function formatMessages(rawMessages: RawMessage[]): Promise<Message[]> {
  return Promise.all(rawMessages.map(message => formatMessage(message)));
}
