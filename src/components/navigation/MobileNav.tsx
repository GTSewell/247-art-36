
import React from "react";
import MobileNavLink from "./MobileNavLink";
import MobileUserMenu from "./MobileUserMenu";

interface MobileNavProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}

const MobileNav = ({ isOpen, isActive, user, isLoading }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-border/20">
      <div className="container mx-auto px-4 py-2 space-y-1">
        <MobileNavLink to="/artists" isActive={isActive("/artists")}>
          Artists
        </MobileNavLink>
        <MobileNavLink to="/who-are-you" isActive={isActive("/who-are-you")}>
          About Us
        </MobileNavLink>
        <MobileNavLink to="/services" isActive={isActive("/services")}>
          Services
        </MobileNavLink>
        <MobileNavLink to="/store" isActive={isActive("/store")}>
          Store
        </MobileNavLink>
        <MobileNavLink to="/virtual-tour" isActive={isActive("/virtual-tour")}>
          Virtual Tour
        </MobileNavLink>
        <MobileUserMenu user={user} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MobileNav;
