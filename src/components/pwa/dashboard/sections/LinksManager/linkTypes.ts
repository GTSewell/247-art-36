import { 
  Globe,
  Store,
  Video,
  Music,
  Building,
  Award,
  ExternalLink,
  FileText,
  Radio
} from "lucide-react";

export const LINK_TYPES = [
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'shop', label: 'Shop', icon: Store },
  { value: 'exhibition', label: 'Exhibition', icon: Building },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'podcast', label: 'Podcast', icon: Radio },
  { value: 'articles', label: 'Articles', icon: FileText },
  { value: 'nft', label: 'NFT Collection', icon: Award },
  { value: 'other', label: 'Other', icon: ExternalLink }
];