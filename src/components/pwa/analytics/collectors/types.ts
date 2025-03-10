
export interface Collector {
  id: string;
  name: string;
  avatarUrl: string;
  itemsPurchased: string[];
  collectorName: string;
  email: string;
  social: {
    instagram?: string;
    facebook?: string;
  }
}

export interface CollectorTableProps {
  collectors: Collector[];
}
