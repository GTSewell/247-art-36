import React, { useMemo } from 'react';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface OptimizedAccordionTitleProps {
  children: React.ReactNode;
  imageUrl: string;
  className?: string;
  style?: React.CSSProperties;
  isHomepage?: boolean;
}

const OptimizedAccordionTitle: React.FC<OptimizedAccordionTitleProps> = ({
  children,
  imageUrl,
  className = '',
  style = {},
  isHomepage = false
}) => {
  const { isImageLoaded } = useImagePreloader([imageUrl], { 
    priority: true, 
    preloadOnMount: true 
  });

  const optimizedClassName = useMemo(() => {
    const baseClass = isHomepage ? 'homepage-accordion-title' : 'store-category-title';
    const loadedClass = isImageLoaded ? 'with-background' : '';
    return `${baseClass} ${loadedClass} ${className}`.trim();
  }, [isHomepage, isImageLoaded, className]);

  const optimizedStyle = useMemo(() => ({
    ...style,
    ...(isImageLoaded && {
      '--homepage-bg-image': `url(${imageUrl})`,
      '--category-bg-image': `url(${imageUrl})`,
      willChange: 'background-image',
      backfaceVisibility: 'hidden' as const,
      transform: 'translateZ(0)', // Force hardware acceleration
    })
  }), [style, isImageLoaded, imageUrl]);

  return (
    <h2 
      className={optimizedClassName}
      style={optimizedStyle}
    >
      {children}
    </h2>
  );
};

export default OptimizedAccordionTitle;