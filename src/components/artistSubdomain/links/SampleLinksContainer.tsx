
import React from 'react';
import LinkSection from './LinkSection';

interface SampleLinksContainerProps {
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonBorderColor: string;
}

const SampleLinksContainer: React.FC<SampleLinksContainerProps> = ({
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor
}) => {
  const sampleLinks = [
    { title: "WEBSITE", icon: "🌐", text: "Portfolio Website", url: "#" },
    { title: "EXHIBITION", icon: "🎭", text: "Next Exhibition", url: "#" },
    { title: "INSTALLATION", icon: "📍", text: "Public Art Installation", url: "#" },
    { title: "SHOP", icon: "🛒", text: "Online Art Shop", url: "#" },
    { title: "GALLERY", icon: "🖼️", text: "Gallery Representation", url: "#" },
    { title: "CONTACT", icon: "✉️", text: "Contact for Commissions", url: "#" },
    { title: "VIDEO", icon: "🎥", text: "Studio Tour Video", url: "#" },
    { title: "AWARD", icon: "🏆", text: "Recent Awards", url: "#" },
  ];

  return (
    <div>
      {/* Connect section will appear before this component in parent */}
      
      {sampleLinks.map((link, index) => (
        <LinkSection
          key={index}
          title={link.title}
          icon={link.icon}
          linkText={link.text}
          url={link.url}
          buttonColor={buttonColor}
          buttonTextColor={buttonTextColor}
          buttonHoverColor={buttonHoverColor}
          buttonBorderColor={buttonBorderColor}
        />
      ))}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        These are sample links to show how artist links would appear
      </div>
    </div>
  );
};

export default SampleLinksContainer;
