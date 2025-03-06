
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  localOnly?: boolean;
  onToggle?: (isDark: boolean) => void;
}

const ThemeToggle = ({ localOnly = false, onToggle }: ThemeToggleProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // If no saved preference, check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Apply the theme to the document or container based on localOnly prop
    if (darkMode) {
      if (!localOnly) {
        document.documentElement.classList.add("dark");
      }
      localStorage.setItem("theme", "dark");
    } else {
      if (!localOnly) {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", "light");
    }

    // Call the onToggle callback if provided
    if (onToggle) {
      onToggle(darkMode);
    }
  }, [darkMode, localOnly, onToggle]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Button 
      onClick={toggleTheme} 
      variant="outline" 
      size="icon" 
      className="w-8 h-8 rounded-full"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
