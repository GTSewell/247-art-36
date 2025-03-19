
import { Message, RawMessage } from "../types";
import { fetchArtistById } from "../api/messageApi";

export async function formatMessage(rawMessage: RawMessage): Promise<Message> {
  const artistData = await fetchArtistById(rawMessage.artist_id);
  
  return {
    ...rawMessage,
    status: rawMessage.status as Message['status'],
    artist: artistData || { name: 'Unknown Artist', image: '' },
    sender: { email: `User ${rawMessage.sender_id.substring(0, 8)}` }
  };
}

export async function formatMessages(rawMessages: RawMessage[]): Promise<Message[]> {
  return Promise.all(rawMessages.map(message => formatMessage(message)));
}
