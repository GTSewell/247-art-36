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

      // If we're expanding a new item, preserve scroll position
      const triggerElement = triggerRefs.current.get(newValue);
      
      if (triggerElement && newValue) {
        // Get the trigger's position before the change
        const triggerRect = triggerElement.getBoundingClientRect();
        const triggerTopOffset = triggerRect.top + window.scrollY;
        
        // Call the value change handler
        onValueChange(newValue);
        
        // After a brief delay to allow DOM updates, scroll to maintain position
        setTimeout(() => {
          // Calculate where to scroll to keep the trigger in the same relative position
          const newTriggerRect = triggerElement.getBoundingClientRect();
          const currentTriggerTop = newTriggerRect.top + window.scrollY;
          
          // If the trigger moved, adjust scroll to compensate
          if (Math.abs(currentTriggerTop - triggerTopOffset) > 10) {
            window.scrollTo({
              top: triggerTopOffset - 100, // 100px offset from top for breathing room
              behavior: 'smooth'
            });
          }
          
          isChangingRef.current = false;
        }, 150);
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
