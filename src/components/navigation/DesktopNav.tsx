
import React from "react";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

interface DesktopNavProps {
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}

const DesktopNav = ({ isActive, user, isLoading }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4 w-full justify-end">
      <NavLink to="/artists" isActive={isActive("/artists")}>
        Artists
      </NavLink>
      <NavLink to="/who-are-you" isActive={isActive("/who-are-you")}>
        About Us
      </NavLink>
      <NavLink to="/services" isActive={isActive("/services")}>
        Services
      </NavLink>
      <NavLink to="/store" isActive={isActive("/store")}>
        Store
      </NavLink>
      <NavLink to="/virtual-tour" isActive={isActive("/virtual-tour")}>
        Virtual Tour
      </NavLink>
      <UserMenu user={user} isLoading={isLoading} />
    </div>
  );
};

export default DesktopNav;
