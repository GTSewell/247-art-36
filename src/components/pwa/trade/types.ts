
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
