
export interface PurchaseItem {
  id: string;
  title: string;
  artist: string;
  price: string;
  date: string;
  image: string;
  status: "delivered" | "processing" | "shipped";
  description?: string;
}

export const getStatusColor = (status: PurchaseItem["status"]) => {
  switch (status) {
    case "delivered":
      return "bg-green-500";
    case "shipped":
      return "bg-blue-500";
    case "processing":
      return "bg-amber-500";
    default:
      return "bg-gray-500";
  }
};
