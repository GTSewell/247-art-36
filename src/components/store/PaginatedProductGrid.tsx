import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginatedProductGridProps {
  products: any[];
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
  onProductClick?: (product: any) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({ 
  products, 
  itemsPerPage = 10,
  onItemsPerPageChange,
  onProductClick 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the accordion title at the top of viewport when page changes
    const activeAccordionTrigger = document.querySelector('[data-state="open"] h2');
    if (activeAccordionTrigger) {
      const elementTop = activeAccordionTrigger.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setCurrentPage(1); // Reset to first page
    onItemsPerPageChange?.(newItemsPerPage);
  };

  // Reset to page 1 when products change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, products.length);

  return (
    <div className="flex flex-col h-full" data-pagination-grid>
      {/* Products Grid - takes remaining space */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
          ))}
        </div>
      </div>

      {/* Pagination Controls - fixed at bottom */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border bg-background/95 backdrop-blur-sm">
        {/* Results Info & Items Per Page */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
          <span>
            Showing {startItem}-{endItem} of {products.length} products
          </span>
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pagination Navigation - only show if more than one page */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 7) {
                  pageNumber = i + 1;
                } else if (currentPage <= 4) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                } else {
                  pageNumber = currentPage - 3 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default PaginatedProductGrid;