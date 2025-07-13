import { useCallback, useRef } from 'react';

export const useEnhancedAccordionScroll = () => {
  const triggerRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isChangingRef = useRef(false);

  const registerTrigger = useCallback((value: string, element: HTMLElement | null) => {
    if (element) {
      triggerRefs.current.set(value, element);
    } else {
      triggerRefs.current.delete(value);
    }
  }, []);

  const registerContent = useCallback((value: string, element: HTMLElement | null) => {
    if (element) {
      contentRefs.current.set(value, element);
    } else {
      contentRefs.current.delete(value);
    }
  }, []);

  const scrollToTop = useCallback((element: HTMLElement) => {
    const headerHeight = 80; // Approximate header height
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const scrollTop = elementTop - headerHeight;
    
    window.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth'
    });
  }, []);

  const handleAccordionChange = useCallback(
    (
      newValue: string,
      currentValue: string,
      onValueChange: (value: string) => void
    ) => {
      if (isChangingRef.current) return;
      isChangingRef.current = true;

      // If we're collapsing (clicking the same item), just call the handler
      if (newValue === currentValue) {
        onValueChange('');
        isChangingRef.current = false;
        return;
      }

      // Get elements for the new trigger
      const newTriggerElement = triggerRefs.current.get(newValue);
      
      if (newTriggerElement && newValue) {
        // Make the accordion change first
        onValueChange(newValue);
        
        // Wait for accordion animation to complete, then scroll to top
        setTimeout(() => {
          scrollToTop(newTriggerElement);
          isChangingRef.current = false;
        }, 300); // Match accordion animation duration
      } else {
        onValueChange(newValue);
        isChangingRef.current = false;
      }
    }, [scrollToTop]);

  return {
    registerTrigger,
    registerContent,
    handleAccordionChange
  };
};