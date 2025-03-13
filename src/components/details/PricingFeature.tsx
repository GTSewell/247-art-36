
import { Check, LucideIcon } from "lucide-react";

interface PricingFeatureProps {
  icon?: LucideIcon;
  text: string;
  percentage?: string;
  color: string;
  isIncluded?: boolean;
  isBoldUrl?: boolean;
  isHeader?: boolean;
}

const PricingFeature = ({ 
  icon: Icon, 
  text, 
  percentage, 
  color, 
  isIncluded = true, 
  isBoldUrl = false,
  isHeader = false 
}: PricingFeatureProps) => {
  if (!isIncluded) {
    return null;
  }

  if (isHeader) {
    return (
      <li className="font-bold text-gray-800 mb-2 italic">
        {text}
      </li>
    );
  }

  if (percentage) {
    return (
      <li className="flex items-start gap-2">
        <div className={`w-5 h-5 mt-0.5 text-${color} flex-shrink-0 pr-1 font-semibold text-right`}>{percentage}</div>
        <span className="pl-2">{text}</span>
      </li>
    );
  }

  if (isBoldUrl) {
    return (
      <li className="flex items-start gap-2">
        <Check className={`w-5 h-5 mt-0.5 text-${color} flex-shrink-0`} />
        <span>
          Custom 247 Artist Profile{" "}
          <span className="font-extrabold">[yournamehere].247.art</span>
        </span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2">
      <Check className={`w-5 h-5 mt-0.5 text-${color} flex-shrink-0`} />
      <span>{text}</span>
    </li>
  );
};

export default PricingFeature;
