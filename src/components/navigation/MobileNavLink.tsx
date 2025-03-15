
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
        "block px-3 py-2 rounded-md text-base font-medium",
        isActive
          ? "bg-zap-yellow text-black"
          : "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      )}
    >
      {children}
    </Link>
  );
};

export default MobileNavLink;
