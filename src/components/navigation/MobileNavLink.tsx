
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, isActive, children }: MobileNavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "block px-3 py-2 text-base font-medium transition-colors",
        isActive
          ? "text-primary font-semibold"
          : "text-foreground hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
};

export default MobileNavLink;
