
import { Message, RawMessage } from "../types";
import { fetchArtistById } from "../api/messageApi";

export async function formatMessage(rawMessage: RawMessage): Promise<Message> {
  try {
    // Convert artist_id to string for consistent handling
    const artistId = rawMessage.artist_id.toString();
    
    // Fetch artist data with the string ID (will be converted to number in fetchArtistById)
    const artistData = await fetchArtistById(artistId);
    
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: artistData || { name: 'Unknown Artist', image: '' },
      sender: { email: `User ${rawMessage.sender_id.substring(0, 8)}` }
    };
  } catch (error) {
    console.error("Error formatting message:", error);
    return {
      ...rawMessage,
      status: rawMessage.status as Message['status'],
      artist: { name: 'Unknown Artist', image: '' },
      sender: { email: `User ${rawMessage.sender_id.substring(0, 8)}` }
    };
  }
}

export async function formatMessages(rawMessages: RawMessage[]): Promise<Message[]> {
  return Promise.all(rawMessages.map(message => formatMessage(message)));
}
