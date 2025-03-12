
import { PurchaseItem } from "./types";

// Sample purchase items with artwork images
export const samplePurchases: PurchaseItem[] = [
  {
    id: "P1001",
    title: "Neon Dreams",
    artist: "Emily",
    price: "$120.00",
    date: "May 12, 2024",
    image: "/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png",
    status: "delivered",
    description: "A vibrant abstract piece exploring the interplay of neon lights and urban landscapes. This limited edition print is signed by the artist."
  },
  {
    id: "P1002",
    title: "Urban Serenity",
    artist: "Lucas",
    price: "$85.50",
    date: "April 29, 2024",
    image: "/lovable-uploads/35c806e4-6bf2-4984-9996-9c61c1d74879.png",
    status: "shipped",
    description: "A contemplative study of urban architecture and negative space. Printed on premium archival paper with lightfast inks."
  },
  {
    id: "P1003",
    title: "Abstract Thoughts",
    artist: "Yuki",
    price: "$175.00",
    date: "April 15, 2024",
    image: "/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png",
    status: "processing",
    description: "A mixed media piece exploring the fragmentation of consciousness in the digital age. Includes certificate of authenticity."
  }
];
