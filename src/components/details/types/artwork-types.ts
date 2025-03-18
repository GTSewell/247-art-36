
export interface Artwork {
  id: number;
  width: number; // in cm
  height: number; // in cm
  fits: boolean;
  area: number; // in sq cm
  inBuffer?: boolean; // indicates if artwork is within 5% buffer
}

export const STUDIO_ARTIST_SQCM = 5625; // 5,625 sq cm
export const FEATURE_ARTIST_SQCM = 10000; // 10,000 sq cm
export const SPACING_CM = 5; // 5 cm spacing on all sides when multiple artworks
export const BUFFER_PERCENTAGE = 5; // 5% buffer allowed
