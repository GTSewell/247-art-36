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
        <img src={darkMode ? "/lovable-uploads/d3dedc40-56a1-411a-9e13-268b900336df.png" // new dark mode logo for artists page
      : "/lovable-uploads/5c5291d2-a3c1-4822-a6e9-60b578b99d08.png" // custom logo for light mode
      } alt="247art" className="h-8 object-fill" />
      </Link>;
  }

  // For Store page
  if (isStorePage) {
    return <Link to="/" className="flex items-center">
        <img src={darkMode ? "/lovable-uploads/850e15f9-de79-455f-95b6-d4f313229fdb.png" // new dark mode logo for store page
      : "/lovable-uploads/8ab30670-5940-4832-9fcd-b89cfed952e6.png" // new logo for light mode
      } alt="247art" className="h-8" />
      </Link>;
  }

  // Default logo for other pages
  return <Link to="/" className="flex items-center">
      <img alt="247art" className="h-8" src="/lovable-uploads/b55eb0db-8612-4bc4-9587-0fdd9ad6f519.png" />
    </Link>;
};
export default ThemedLogo;