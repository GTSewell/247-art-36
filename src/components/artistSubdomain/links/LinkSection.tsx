
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
  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      <div className="space-y-2">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-md w-full"
          style={{ 
            backgroundColor: buttonColor, 
            color: buttonTextColor 
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
