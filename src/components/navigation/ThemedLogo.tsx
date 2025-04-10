import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
interface ThemedLogoProps {
  darkMode: boolean;
}
const ThemedLogo: React.FC<ThemedLogoProps> = ({
  darkMode
}) => {
  const location = useLocation();
  const isArtistsPage = location.pathname === '/artists';
  const isStorePage = location.pathname === '/store';

  // For Artists page specifically, use the new image in light mode
  if (isArtistsPage) {
    return <Link to="/" className="flex items-center">
        <img src={darkMode ? "/lovable-uploads/497cd833-3789-4550-973a-128aae5dd9f1.png" // white logo for dark mode
      : "/lovable-uploads/5e6262ca-40b4-465a-96a0-05cf01a9050d.png" // new custom logo for light mode
      } alt="247art" className="h-8 object-fill" />
      </Link>;
  }

  // For Store page
  if (isStorePage) {
    return <Link to="/" className="flex items-center">
        <img src={darkMode ? "/lovable-uploads/497cd833-3789-4550-973a-128aae5dd9f1.png" // white logo for dark mode
      : "/lovable-uploads/73430fc3-154a-4d2e-8417-18a402fe7806.png" // black logo for light mode
      } alt="247art" className="h-8" />
      </Link>;
  }

  // Default logo for other pages
  return <Link to="/" className="flex items-center">
      <img src="/lovable-uploads/fd6ed9ef-16de-4047-baa1-b7d7ef1c8200.png" alt="247art" className="h-8" />
    </Link>;
};
export default ThemedLogo;