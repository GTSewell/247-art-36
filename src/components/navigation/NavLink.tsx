
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ to, isActive, children, className }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-zap-yellow text-black"
          : "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
