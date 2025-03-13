
export interface ArtworkTradeItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  price: number;
  productionCost: number;
  isTradeEnabled: boolean;
  dateCreated: string;
}

export interface TradeTransaction {
  id: string;
  artistIdFrom: string;
  artistIdTo: string;
  artistNameFrom: string;
  artistNameTo: string;
  artworkFrom: {
    id: string;
    title: string;
    image: string;
  };
  artworkTo: {
    id: string;
    title: string;
    image: string;
  };
  status: 'pending' | 'completed' | 'declined';
  dateCreated: string;
  dateUpdated: string;
}

export interface TradeRequestItem {
  id: string;
  type: 'sent' | 'received';
  status: 'pending' | 'accepted' | 'declined';
  fromArtist: {
    id: string;
    name: string;
  };
  toArtist: {
    id: string;
    name: string;
  };
  fromArtwork: {
    id: string;
    title: string;
    image: string;
    productionCost: number;
  };
  toArtwork: {
    id: string;
    title: string;
    image: string;
    productionCost: number;
  };
  message: string;
  dateCreated: string;
  isRead: boolean;
}
