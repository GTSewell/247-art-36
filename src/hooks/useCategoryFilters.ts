import { useState, useMemo, useEffect } from 'react';

export interface FilterState {
  searchTerm: string;
  selectedArtist: string;
  priceRange: [number, number];
  selectedType: string;
}

interface UseCategoryFiltersProps {
  products: any[];
  onFilteredProductsChange: (products: any[]) => void;
}

export const useCategoryFilters = ({ products, onFilteredProductsChange }: UseCategoryFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedArtist: '',
    priceRange: [0, 1000],
    selectedType: ''
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const artists = [...new Set(products.map(p => p.artists?.name).filter(Boolean))];
    const types = [...new Set(products.map(p => p.shopify_tags).flat().filter(Boolean))];
    const prices = products.map(p => parseFloat(p.price)).filter(p => !isNaN(p));
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 1000;

    return {
      artists: artists.sort(),
      types: types.sort(),
      priceRange: [minPrice, maxPrice] as [number, number]
    };
  }, [products]);

  // Initialize price range with actual min/max
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: filterOptions.priceRange
    }));
  }, [filterOptions.priceRange]);

  // Apply filters and update parent component
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.artists?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Artist filter
    if (filters.selectedArtist) {
      filtered = filtered.filter(product => 
        product.artists?.name === filters.selectedArtist
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Type filter
    if (filters.selectedType) {
      filtered = filtered.filter(product =>
        product.shopify_tags?.includes(filters.selectedType)
      );
    }

    return filtered;
  }, [products, filters]);

  // Notify parent of filtered products
  useEffect(() => {
    onFilteredProductsChange(filteredProducts);
  }, [filteredProducts, onFilteredProductsChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedArtist: '',
      priceRange: filterOptions.priceRange,
      selectedType: ''
    });
  };

  const hasActiveFilters = Boolean(filters.searchTerm || filters.selectedArtist || filters.selectedType ||
    (filters.priceRange[0] !== filterOptions.priceRange[0] || filters.priceRange[1] !== filterOptions.priceRange[1]));

  const activeFilterCount = [
    filters.searchTerm,
    filters.selectedArtist,
    filters.selectedType,
    (filters.priceRange[0] !== filterOptions.priceRange[0] || filters.priceRange[1] !== filterOptions.priceRange[1])
  ].filter(Boolean).length;

  return {
    filters,
    filterOptions,
    filteredProducts,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount
  };
};