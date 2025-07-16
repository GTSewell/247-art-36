import { useMemo } from 'react';
import { FilterState } from './ProductSearchAndFilter';

export const useProductFilters = (products: any[], filters: FilterState, artists: any[]) => {
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Text search
    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase();
      filtered = filtered.filter(product => {
        const artist = artists.find(a => a.id === product.artist_id);
        const artistName = artist?.name || '';
        
        return (
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          artistName.toLowerCase().includes(searchTerm) ||
          product.shopify_tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Artist filter
    if (filters.artistId && filters.artistId !== 'all') {
      if (filters.artistId === 'unassigned') {
        filtered = filtered.filter(product => !product.artist_id);
      } else {
        filtered = filtered.filter(product => product.artist_id?.toString() === filters.artistId);
      }
    }

    // Stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      filtered = filtered.filter(product => {
        const quantity = product.shopify_inventory_quantity || 0;
        switch (filters.stockStatus) {
          case 'in-stock':
            return quantity > 5;
          case 'low-stock':
            return quantity > 0 && quantity <= 5;
          case 'out-of-stock':
            return quantity === 0;
          default:
            return true;
        }
      });
    }

    // Visibility filter
    if (filters.visibilityStatus && filters.visibilityStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.visibilityStatus === 'visible') {
          return product.is_visible !== false;
        } else if (filters.visibilityStatus === 'hidden') {
          return product.is_visible === false;
        }
        return true;
      });
    }

    // Featured filter
    if (filters.featuredStatus && filters.featuredStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.featuredStatus === 'featured') {
          return product.is_featured === true;
        } else if (filters.featuredStatus === 'standard') {
          return product.is_featured !== true;
        }
        return true;
      });
    }

    // Category source filter
    if (filters.categorySource && filters.categorySource !== 'all') {
      filtered = filtered.filter(product => product.category_source === filters.categorySource);
    }

    // Sorting
    filtered.sort((a, b) => {
      const { sortBy, sortOrder } = filters;
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'price':
          aValue = parseFloat(a.price) || 0;
          bValue = parseFloat(b.price) || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'last_synced_at':
          aValue = a.last_synced_at ? new Date(a.last_synced_at).getTime() : 0;
          bValue = b.last_synced_at ? new Date(b.last_synced_at).getTime() : 0;
          break;
        case 'shopify_inventory_quantity':
          aValue = a.shopify_inventory_quantity || 0;
          bValue = b.shopify_inventory_quantity || 0;
          break;
        default:
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
      }

      if (typeof aValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? result : -result;
      } else {
        const result = aValue - bValue;
        return sortOrder === 'asc' ? result : -result;
      }
    });

    return filtered;
  }, [products, filters, artists]);

  return filteredAndSortedProducts;
};