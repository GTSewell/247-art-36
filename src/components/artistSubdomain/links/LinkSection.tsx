
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkSectionProps {
  title: string;
  icon: string;
  linkText: string;
  url: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonBorderColor: string;
}

const LinkSection: React.FC<LinkSectionProps> = ({
  title,
  icon,
  linkText,
  url,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor
}) => {
  // Default to a vibrant teal color with good contrast if no color is provided
  const defaultButtonColor = '#0FA0CE';
  const defaultTextColor = '#FFFFFF';
  const defaultHoverColor = '#0C82A6';
  
  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-base font-bold mb-3">{title === 'WEBSITE' ? 'Below are temporary placeholder links. These are to show how your artist profile will function when it is live 🌐' : title}</h3>
      <div className="space-y-2">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-md w-full transition-colors duration-200"
          style={{ 
            backgroundColor: buttonColor || defaultButtonColor, 
            color: buttonTextColor || defaultTextColor,
            border: `1px solid ${buttonBorderColor || 'transparent'}`
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverColor || defaultHoverColor;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = buttonColor || defaultButtonColor;
          }}
        >
          <span className="flex items-center">
            <span className="mr-2">{icon}</span>
            {linkText}
          </span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
};

export default LinkSection;
