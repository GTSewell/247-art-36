import React, { useMemo } from 'react';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface OptimizedAccordionTitleProps {
  children: React.ReactNode;
  imageUrl: string;
  className?: string;
  style?: React.CSSProperties;
  isHomepage?: boolean;
  isFlashing?: boolean;
}

const OptimizedAccordionTitle: React.FC<OptimizedAccordionTitleProps> = ({
  children,
  imageUrl,
  className = '',
  style = {},
  isHomepage = false,
  isFlashing = false
}) => {
  const { isImageLoaded } = useImagePreloader([imageUrl], { 
    priority: true, 
    preloadOnMount: true 
  });

  const optimizedClassName = useMemo(() => {
    const baseClass = isHomepage ? 'homepage-accordion-title' : 'store-category-title';
    const loadedClass = isImageLoaded ? 'with-background' : '';
    const flashClass = isFlashing ? 'flash-loading' : '';
    return `${baseClass} ${loadedClass} ${flashClass} ${className}`.trim();
  }, [isHomepage, isImageLoaded, isFlashing, className]);

  const optimizedStyle = useMemo(() => ({
    ...style,
    '--homepage-bg-image': `url(${imageUrl})`,
    '--category-bg-image': `url(${imageUrl})`,
    willChange: 'background-image',
    backfaceVisibility: 'hidden' as const,
    transform: 'translateZ(0)', // Force hardware acceleration
  }), [style, imageUrl]);

  return (
    <div className={isFlashing ? 'flash-loading' : ''}>
      <h2 
        className={optimizedClassName}
        style={optimizedStyle}
      >
        {children}
      </h2>
    </div>
  );
};

export default OptimizedAccordionTitle;