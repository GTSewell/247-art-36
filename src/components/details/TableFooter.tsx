
import React, { useEffect, useRef, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const TableFooterComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  return (
    <TableRow className="bg-black hover:bg-black text-white" style={{
      transition: 'none'
    }}>
      <TableCell>
        <span className="text-white text-xs font-extrabold sm:text-lg">Secure your spot ... 👉</span>
      </TableCell>
      <TableCell className="text-center p-1">
        <div ref={buttonRef} className={`transition-all duration-500 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
          <Link to="/artist-submission">
            <Button 
              size="sm" 
              className="text-xs max-w-[180px] bg-[#ea384c] text-white hover:bg-[#f7cf1e] hover:text-black transition-all duration-300 hover:scale-105 font-medium mx-auto px-3 py-0 text-center rounded sm:text-lg animate-float"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Signature Artist
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableFooterComponent;
