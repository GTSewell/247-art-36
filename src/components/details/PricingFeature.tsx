
import { Check, X, LucideIcon } from "lucide-react";

interface PricingFeatureProps {
  icon?: LucideIcon;
  text: string;
  percentage?: string;
  color: string;
  isIncluded?: boolean;
}

const PricingFeature = ({ icon: Icon, text, percentage, color, isIncluded = true }: PricingFeatureProps) => {
  if (percentage) {
    return (
      <li className="flex items-start gap-2">
        <div className={`w-5 h-5 mt-0.5 text-${color} flex-shrink-0 pr-1 font-semibold text-right`}>{percentage}</div>
        <span className="pl-2">{text}</span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2">
      {isIncluded ? (
        <Check className={`w-5 h-5 mt-0.5 text-${color} flex-shrink-0`} />
      ) : (
        <X className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
      )}
      <span>{text}</span>
    </li>
  );
};

export default PricingFeature;
