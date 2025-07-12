import { useCallback, useRef } from 'react';

export const useAccordionScroll = () => {
  const triggerRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isChangingRef = useRef(false);

  const registerTrigger = useCallback((value: string, element: HTMLElement | null) => {
    if (element) {
      triggerRefs.current.set(value, element);
    } else {
      triggerRefs.current.delete(value);
    }
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

      // If we're expanding a new item, preserve the clicked trigger's viewport position
      const triggerElement = triggerRefs.current.get(newValue);
      
      if (triggerElement && newValue) {
        // Store the trigger's position relative to the viewport BEFORE the change
        const triggerRect = triggerElement.getBoundingClientRect();
        const initialViewportTop = triggerRect.top;
        const currentScrollY = window.scrollY;
        
        // Call the value change handler (this will cause layout shifts)
        onValueChange(newValue);
        
        // Immediately after the DOM change, compensate for any layout shift
        requestAnimationFrame(() => {
          // Get the trigger's new position
          const newTriggerRect = triggerElement.getBoundingClientRect();
          const newViewportTop = newTriggerRect.top;
          
          // Calculate how much the trigger moved in the viewport
          const viewportShift = newViewportTop - initialViewportTop;
          
          // If there was a significant shift, adjust scroll to compensate
          if (Math.abs(viewportShift) > 5) {
            // Adjust scroll by the opposite amount to keep trigger in same viewport position
            window.scrollTo({
              top: currentScrollY - viewportShift,
              behavior: 'instant'
            });
          }
          
          isChangingRef.current = false;
        });
      } else {
        onValueChange(newValue);
        isChangingRef.current = false;
      }
    }, []);

  return {
    registerTrigger,
    handleAccordionChange
  };
};
