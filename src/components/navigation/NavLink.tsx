
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
          ? "bg-primary text-primary-foreground"
          : "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
