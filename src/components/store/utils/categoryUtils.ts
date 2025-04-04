
type CategoryType = {
  id: string;
  label: string;
  color: string;
};

export const storeCategories: CategoryType[] = [{
  id: 'original',
  label: 'ORIGINAL ARTWORK',
  color: 'bg-zap-yellow'
}, {
  id: 'signed',
  label: 'SIGNED & NUMBERED',
  color: 'bg-zap-blue'
}, {
  id: 'sticker',
  label: 'STICKERS & FUN STUFF',
  color: 'bg-zap-red'
}, {
  id: 'merch',
  label: 'T-SHIRTS & APPAREL',
  color: 'bg-zap-yellow'
}, {
  id: 'print',
  label: 'ART PRINTS & POSTERS',
  color: 'bg-zap-blue'
}, {
  id: 'collection',
  label: 'THE 247 COLLECTION',
  color: 'bg-zap-red'
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
