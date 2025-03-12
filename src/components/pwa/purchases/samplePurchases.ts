
import { PurchaseItem } from "./types";

// Sample purchase items with artwork images
export const samplePurchases: PurchaseItem[] = [
  {
    id: "P1001",
    title: "Neon Dreams",
    artist: "Emily",
    price: "$120.00",
    date: "May 12, 2024",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
    status: "delivered",
    description: "A vibrant abstract piece exploring the interplay of neon lights and urban landscapes. This limited edition print is signed by the artist."
  },
  {
    id: "P1002",
    title: "Urban Serenity",
    artist: "Lucas",
    price: "$85.50",
    date: "April 29, 2024",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    status: "shipped",
    description: "A contemplative study of urban architecture and negative space. Printed on premium archival paper with lightfast inks."
  },
  {
    id: "P1003",
    title: "Abstract Thoughts",
    artist: "Yuki",
    price: "$175.00",
    date: "April 15, 2024",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    status: "processing",
    description: "A mixed media piece exploring the fragmentation of consciousness in the digital age. Includes certificate of authenticity."
  }
];
