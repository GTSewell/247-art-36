/**
 * Z-Index Management System
 * 
 * This file defines our standardized z-index hierarchy to prevent
 * overlapping issues, especially with modals and their internal elements.
 * 
 * Hierarchy:
 * - Base Layer: 0-10 (regular content)
 * - Floating Elements: 20-40 (tooltips, badges)
 * - Dropdowns/Popovers: 50 (default standalone)
 * - Modal Overlays: 9998
 * - Modal Content: 9999
 * - Modal Internal Elements: 10000-10010 (dropdowns, popovers inside modals)
 * - Critical Overlays: 10020+ (toast notifications, critical alerts)
 */

export const Z_INDEX = {
  // Base layers
  BASE: 0,
  CONTENT: 10,
  
  // Floating elements
  TOOLTIP: 20,
  BADGE: 30,
  FLOATING: 40,
  
  // Standard dropdowns and popovers (standalone)
  DROPDOWN: 50,
  POPOVER: 50,
  
  // Modal system
  MODAL_OVERLAY: 9998,
  MODAL_CONTENT: 9999,
  
  // Elements inside modals (must be higher than modal content)
  MODAL_DROPDOWN: 10000,
  MODAL_POPOVER: 10001,
  MODAL_CALENDAR: 10002,
  MODAL_COMMAND: 10003,
  MODAL_SELECT: 10004,
  MODAL_COMBOBOX: 10005,
  
  // Critical system overlays (highest priority)
  TOAST: 10020,
  CRITICAL_ALERT: 10030,
  ERROR_BOUNDARY: 10040,
} as const;

/**
 * Get appropriate z-index for a component based on context
 */
export const getZIndex = (component: keyof typeof Z_INDEX, inModal = false): string => {
  const base = Z_INDEX[component];
  
  // If we're inside a modal and this is an interactive element,
  // use the modal-specific z-index
  if (inModal) {
    switch (component) {
      case 'DROPDOWN':
        return `z-[${Z_INDEX.MODAL_DROPDOWN}]`;
      case 'POPOVER':
        return `z-[${Z_INDEX.MODAL_POPOVER}]`;
      default:
        return `z-[${base}]`;
    }
  }
  
  return `z-[${base}]`;
};

/**
 * Hook to detect if we're inside a modal context
 * This would need to be implemented with React Context
 */
export const useInModal = (): boolean => {
  // For now, return false - this would be implemented with proper context
  // in a future enhancement
  return false;
};