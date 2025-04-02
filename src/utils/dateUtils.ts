
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Melbourne/Australia timezone
 */
export const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

/**
 * Format a date string to local Melbourne time
 * @param dateString ISO date string to format
 * @param formatStr date-fns format string (default: 'PPpp' - 'Apr 29, 2023, 1:30:00 PM')
 * @returns Formatted date string in Melbourne timezone
 */
export const formatToMelbourneTime = (
  dateString: string,
  formatStr: string = 'PPpp'
): string => {
  try {
    // Handle both ISO strings and Date objects
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatInTimeZone(date, MELBOURNE_TIMEZONE, formatStr);
  } catch (error) {
    console.error('Error formatting date to Melbourne time:', error);
    return dateString; // Fallback to original string
  }
};

/**
 * Format a date string to Melbourne time with a custom format
 * Common formats:
 * - 'PPpp': Apr 29, 2023, 1:30:00 PM
 * - 'Pp': Apr 29, 2023, 1:30 PM
 * - 'PPP': April 29th, 2023
 * - 'pp': 1:30:00 PM
 */
export const formatDateInMelbourne = {
  /**
   * Format as full date and time (Apr 29, 2023, 1:30:00 PM)
   */
  full: (dateString: string) => formatToMelbourneTime(dateString, 'PPpp'),
  
  /**
   * Format as short date and time (Apr 29, 2023, 1:30 PM)
   */
  short: (dateString: string) => formatToMelbourneTime(dateString, 'Pp'),
  
  /**
   * Format as date only (April 29th, 2023)
   */
  dateOnly: (dateString: string) => formatToMelbourneTime(dateString, 'PPP'),
  
  /**
   * Format as time only (1:30:00 PM)
   */
  timeOnly: (dateString: string) => formatToMelbourneTime(dateString, 'pp'),
  
  /**
   * Format as custom format
   */
  custom: (dateString: string, formatStr: string) => formatToMelbourneTime(dateString, formatStr)
};
