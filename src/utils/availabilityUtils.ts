
import { parseISO, format } from 'date-fns';

/**
 * Extracts month information from a date string in 'yyyy-MM-dd' format
 * @param dateString The date string in 'yyyy-MM-dd' format
 * @returns The month name in lowercase (e.g., 'january', 'february', etc.)
 */
export const extractMonthFromDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM').toLowerCase();
  } catch (error) {
    console.error('Error parsing date string:', dateString, error);
    return '';
  }
};

/**
 * Groups availability dates by month
 * @param dates Array of date strings in 'yyyy-MM-dd' format
 * @returns Object with months as keys and arrays of dates as values
 */
export const groupDatesByMonth = (dates: string[]): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  
  if (!dates || !Array.isArray(dates)) {
    return result;
  }
  
  dates.forEach(dateString => {
    const month = extractMonthFromDate(dateString);
    if (month) {
      if (!result[month]) {
        result[month] = [];
      }
      result[month].push(dateString);
    }
  });
  
  return result;
};

/**
 * Format dates for easy-to-read display
 * @param dates Array of date strings or full month names
 * @returns Formatted dates for display
 */
export const formatDatesForDisplay = (dates: string[] = [], availableMonths: string[] = []) => {
  const result: string[] = [];
  
  if (!dates) dates = [];
  if (!availableMonths) availableMonths = [];
  
  // Add full months
  if (availableMonths && availableMonths.length > 0) {
    availableMonths.forEach(month => {
      if (month) {
        const normalizedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
        result.push(`${normalizedMonth} (Full Month)`);
      }
    });
  }
  
  // Add specific dates
  dates.forEach(date => {
    if (date && date.includes('-')) { // YYYY-MM-DD format
      try {
        const parsedDate = parseISO(date);
        result.push(format(parsedDate, 'MMMM d, yyyy'));
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  });
  
  return result.length > 0 ? result : ["No specific dates available"];
};
