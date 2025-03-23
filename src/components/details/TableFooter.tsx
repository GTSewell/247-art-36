import React, { useEffect, useRef, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
const TableFooterComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.1
    });
    if (rowRef.current) {
      observer.observe(rowRef.current);
    }
    return () => {
      if (rowRef.current) {
        observer.unobserve(rowRef.current);
      }
    };
  }, []);
  return <TableRow ref={rowRef} className={`bg-black hover:bg-black text-white ${isVisible ? 'animate-flip' : ''}`} style={{
    transition: 'none'
  }}>
      <TableCell>
        <span className="text-white text-xs font-extrabold sm:text-lg">Secure your spot ... 👉</span>
      </TableCell>
      <TableCell className="text-center p-1">
        <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="text-xs max-w-[180px] mx-auto w-full text-white hover:text-black font-medium px-0 py-0 text-center rounded sm:text-lg bg-zap-blue">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Signature Artist
          </Button>
        </a>
      </TableCell>
    </TableRow>;
};
export default TableFooterComponent;