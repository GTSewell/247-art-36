
import { Message, RawMessage } from '../types';
import { fetchArtistById } from '../api/messageApi';

// Format a raw message from the database into our app's Message format
export async function formatMessage(rawMessage: RawMessage): Promise<Message> {
  let artistData = null;
  
  if (rawMessage.artist_id) {
    // Ensure artist_id is treated as a string
    artistData = await fetchArtistById(String(rawMessage.artist_id));
  }
  
  return {
    ...rawMessage,
    status: rawMessage.status as Message['status'],
    artist: artistData || undefined,
    sender: { email: `User ${rawMessage.sender_id.substring(0, 8)}` }
  };
}

// Format multiple raw messages
export async function formatMessages(rawMessages: RawMessage[]): Promise<Message[]> {
  return Promise.all(rawMessages.map(msg => formatMessage(msg)));
}
