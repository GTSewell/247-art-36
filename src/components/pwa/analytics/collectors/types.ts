
export interface Collector {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  lastPurchase: string;
  purchaseCount: number;
  totalValue: number;
}

export interface CollectorExport {
  id: number;
  name: string;
  email: string;
  purchaseCount: number;
  totalValue: number;
  lastPurchase: string;
}
