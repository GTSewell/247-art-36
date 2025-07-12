
import storeOriginalArtwork from '@/assets/store-original-artwork.jpg';
import storeSignedNumbered from '@/assets/store-signed-numbered.jpg';
import storeStickersFun from '@/assets/store-stickers-fun.jpg';
import storeTshirtsApparel from '@/assets/store-tshirts-apparel.jpg';
import storePrintsPosters from '@/assets/store-prints-posters.jpg';
import store247Collection from '@/assets/store-247-collection.jpg';

type CategoryType = {
  id: string;
  label: string;
  color: string;
  image: string;
  description: string;
};

export const storeCategories: CategoryType[] = [{
  id: 'original',
  label: 'original artwork',
  color: 'bg-zap-yellow',
  image: storeOriginalArtwork,
  description: 'Unique, one-of-a-kind original pieces from talented artists'
}, {
  id: 'signed',
  label: 'Limited Editions',
  color: 'bg-zap-blue',
  image: storeSignedNumbered,
  description: 'Limited edition pieces personally signed and numbered by the artist'
}, {
  id: 'sticker',
  label: 'Stickers & Stuff',
  color: 'bg-zap-red',
  image: storeStickersFun,
  description: 'Playful stickers and fun collectibles to brighten your day'
}, {
  id: 'merch',
  label: 'artist apparel',
  color: 'bg-zap-yellow',
  image: storeTshirtsApparel,
  description: 'Wearable art featuring designs from our featured artists'
}, {
  id: 'print',
  label: 'art posters',
  color: 'bg-zap-blue',
  image: storePrintsPosters,
  description: 'High-quality prints and posters perfect for any space'
}, {
  id: 'collection',
  label: '247 merch',
  color: 'bg-zap-red',
  image: store247Collection,
  description: 'Exclusive curated collection showcasing the best of 247.ART'
}];

export const getCategoryColor = (categoryId: string): string => {
  switch(categoryId) {
    case 'original':
    case 'merch':
      return 'bg-zap-yellow';
    case 'signed':
    case 'print':
      return 'bg-zap-blue';
    case 'sticker':
    case 'collection':
      return 'bg-zap-red';
    default:
      return 'bg-gray-200';
  }
};
