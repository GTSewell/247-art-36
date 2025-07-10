export interface ArtworkDetails {
  image: string;
  title: string;
  description: string;
  specifications: {
    medium: string;
    size: string;
    year: string;
  };
  price?: string;
}