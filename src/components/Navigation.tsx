
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Artists", path: "/artists" },
    { name: "Galleries", path: "/galleries" },
    { name: "Services", path: "/services" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png"
                alt="ZAP!"
                className="h-8"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-zap-blue transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <img
              src="/lovable-uploads/ba2acde7-f602-4a0e-b52f-f5b1b5a3689e.png"
              alt="Connect"
              className="h-8 cursor-pointer hover:opacity-90 transition-all duration-200 transform hover:scale-105"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-zap-blue"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/80 backdrop-blur-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 text-gray-700 hover:text-zap-blue"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <img
                src="/lovable-uploads/ba2acde7-f602-4a0e-b52f-f5b1b5a3689e.png"
                alt="Connect"
                className="h-8 cursor-pointer hover:opacity-90 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
