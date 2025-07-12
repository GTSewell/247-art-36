import { useCallback, useRef } from 'react';

export const useAccordionScroll = () => {
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

      // Get elements for the new trigger and current expanded content
      const newTriggerElement = triggerRefs.current.get(newValue);
      const currentContentElement = currentValue ? contentRefs.current.get(currentValue) : null;
      
      if (newTriggerElement && newValue) {
        // Pre-calculate the height of content that will collapse
        let collapsingHeight = 0;
        let shouldCompensate = false;
        
        if (currentContentElement && currentValue) {
          // Get the full height of the currently expanded content
          const contentRect = currentContentElement.getBoundingClientRect();
          collapsingHeight = contentRect.height;
          
          // Check if the collapsing content is above the new trigger
          const currentTriggerElement = triggerRefs.current.get(currentValue);
          if (currentTriggerElement) {
            const currentTriggerRect = currentTriggerElement.getBoundingClientRect();
            const newTriggerRect = newTriggerElement.getBoundingClientRect();
            
            // If current trigger (and its content) is above the new trigger, we need to compensate
            shouldCompensate = currentTriggerRect.top < newTriggerRect.top;
          }
        }
        
        // Store the new trigger's current position
        const newTriggerRect = newTriggerElement.getBoundingClientRect();
        const targetViewportTop = newTriggerRect.top;
        const currentScrollY = window.scrollY;
        
        // Calculate proactive scroll adjustment
        let proactiveScrollAdjustment = 0;
        if (shouldCompensate && collapsingHeight > 0) {
          proactiveScrollAdjustment = collapsingHeight;
        }
        
        // Make the accordion change
        onValueChange(newValue);
        
        // Use setTimeout for better timing with Radix UI animations
        setTimeout(() => {
          // Calculate final scroll position to keep trigger in same viewport position
          const finalScrollY = currentScrollY - proactiveScrollAdjustment;
          
          // Verify the trigger hasn't moved too far from expected position
          const currentTriggerRect = newTriggerElement.getBoundingClientRect();
          const actualViewportTop = currentTriggerRect.top;
          const unexpectedShift = actualViewportTop - targetViewportTop;
          
          // Apply scroll correction
          window.scrollTo({
            top: finalScrollY - unexpectedShift,
            behavior: 'instant'
          });
          
          isChangingRef.current = false;
        }, 50);
      } else {
        onValueChange(newValue);
        isChangingRef.current = false;
      }
    }, []);

  return {
    registerTrigger,
    registerContent,
    handleAccordionChange
  };
};
