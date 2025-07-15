import React, { useMemo } from 'react';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface OptimizedStoreCategoryTitleProps {
  children: React.ReactNode;
  imageUrl: string;
  className?: string;
  style?: React.CSSProperties;
  isExpanded?: boolean;
  isFlashing?: boolean;
}

const OptimizedStoreCategoryTitle: React.FC<OptimizedStoreCategoryTitleProps> = ({
  children,
  imageUrl,
  className = '',
  style = {},
  isExpanded = false,
  isFlashing = false
}) => {
  const { isImageLoaded } = useImagePreloader([imageUrl], { 
    priority: false, // Store images are secondary priority 
    preloadOnMount: true 
  });

  const optimizedClassName = useMemo(() => {
    const baseClass = 'store-category-title';
    const expandedClass = isExpanded ? 'store-category-title-expanded' : '';
    const loadedClass = isImageLoaded ? 'with-background' : '';
    const flashClass = isFlashing ? 'flash' : '';
    return `${baseClass} ${expandedClass} ${loadedClass} ${flashClass} ${className}`.trim();
  }, [isExpanded, isImageLoaded, isFlashing, className]);

  const optimizedStyle = useMemo(() => ({
    ...style,
    ...(isImageLoaded && {
      '--category-bg-image': `url(${imageUrl})`,
      willChange: 'background-image, font-size',
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

export default OptimizedStoreCategoryTitle;