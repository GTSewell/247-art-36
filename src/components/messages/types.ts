export type MessageStatus = 'pending' | 'replied' | 'expired';

export interface Message {
  id: string;
  message: string;
  sender_id: string;
  artist_id: string;
  status: 'pending' | 'replied' | 'expired';
  created_at: string;
  replied_at?: string;
  parent_message_id?: string;
  credit_amount?: number;
  artist?: {
    name: string;
    image: string;
  };
  sender: {
    email: string;
    isCurrentUser?: boolean;
  };
  recipient?: {
    name: string;
  };
}

export interface RawMessage {
  id: string;
  message: string;
  created_at: string;
  status: string;
  sender_id: string;
  artist_id: string;
  replied_at: string | null;
  credit_amount: number;
  parent_message_id?: string | null;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export type MessageFilter = 'all' | 'pending' | 'replied' | 'expired';
