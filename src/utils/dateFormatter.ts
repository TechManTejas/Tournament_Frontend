/**
 * Date formatting utilities for tournament management
 * Provides various date formatting functions for displaying dates in different formats
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  format?: 'short' | 'long' | 'iso' | 'custom';
  customFormat?: string;
  timezone?: string;
}

/**
 * Formats a date to a readable string
 * @param date - Date object or date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, options: DateFormatOptions = {}): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  const {
    includeTime = false,
    includeSeconds = false,
    format = 'short',
    customFormat,
    timezone,
  } = options;

  if (format === 'iso') {
    return dateObj.toISOString();
  }

  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
        ...(includeSeconds && { second: '2-digit' }),
      }),
      ...(timezone && { timeZone: timezone }),
    });
  }

  if (format === 'custom' && customFormat) {
    return formatCustomDate(dateObj, customFormat);
  }

  // Default short format
  const dateStr = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(timezone && { timeZone: timezone }),
  });

  if (includeTime) {
    const timeStr = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' }),
      ...(timezone && { timeZone: timezone }),
    });
    return `${dateStr} ${timeStr}`;
  }

  return dateStr;
};

/**
 * Formats a date using a custom format string
 * @param date - Date object
 * @param format - Custom format string (e.g., 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string
 */
const formatCustomDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Formats a date relative to now (e.g., "2 hours ago", "in 3 days")
 * @param date - Date object or date string
 * @returns Relative date string
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isPast = diffMs < 0;
  const prefix = isPast ? '' : 'in ';
  const suffix = isPast ? ' ago' : '';

  if (diffYears > 0) {
    return `${prefix}${diffYears} year${diffYears > 1 ? 's' : ''}${suffix}`;
  }
  if (diffMonths > 0) {
    return `${prefix}${diffMonths} month${diffMonths > 1 ? 's' : ''}${suffix}`;
  }
  if (diffWeeks > 0) {
    return `${prefix}${diffWeeks} week${diffWeeks > 1 ? 's' : ''}${suffix}`;
  }
  if (diffDays > 0) {
    return `${prefix}${diffDays} day${diffDays > 1 ? 's' : ''}${suffix}`;
  }
  if (diffHours > 0) {
    return `${prefix}${diffHours} hour${diffHours > 1 ? 's' : ''}${suffix}`;
  }
  if (diffMinutes > 0) {
    return `${prefix}${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}${suffix}`;
  }
  return 'just now';
};

/**
 * Formats a date range (e.g., "Jan 1 - Jan 5, 2024")
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided');
  }

  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${startStr} - ${end.getDate()}, ${end.getFullYear()}`;
  }

  // If different years, include year in start date too
  if (start.getFullYear() !== end.getFullYear()) {
    const startStrWithYear = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startStrWithYear} - ${endStr}`;
  }

  return `${startStr} - ${endStr}`;
};

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return false;
  }

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return false;
  }

  return dateObj.getTime() < new Date().getTime();
};

/**
 * Checks if a date is in the future
 * @param date - Date to check
 * @returns True if date is in the future
 */
export const isFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return false;
  }

  return dateObj.getTime() > new Date().getTime();
};

/**
 * Gets the start of day for a given date
 * @param date - Date object
 * @returns Date object set to start of day (00:00:00)
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the end of day for a given date
 * @param date - Date object
 * @returns Date object set to end of day (23:59:59.999)
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Adds days to a date
 * @param date - Date object
 * @param days - Number of days to add (can be negative)
 * @returns New date object
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Gets the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days (positive if date2 is after date1)
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date provided');
  }

  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Gets the difference in hours between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in hours (positive if date2 is after date1)
 */
export const getHoursDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date provided');
  }

  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
};

/**
 * Gets the difference in minutes between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in minutes (positive if date2 is after date1)
 */
export const getMinutesDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date provided');
  }

  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60));
};

/**
 * Adds hours to a date
 * @param date - Date object
 * @param hours - Number of hours to add (can be negative)
 * @returns New date object
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * Adds minutes to a date
 * @param date - Date object
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New date object
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

/**
 * Gets the start of week for a given date
 * @param date - Date object (defaults to today)
 * @param startOfWeek - Day of week to start (0 = Sunday, 1 = Monday, etc.)
 * @returns Date object set to start of week
 */
export const getStartOfWeek = (date: Date = new Date(), startOfWeek: number = 0): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < startOfWeek ? 7 : 0) + day - startOfWeek;
  result.setDate(result.getDate() - diff);
  return getStartOfDay(result);
};

/**
 * Gets the end of week for a given date
 * @param date - Date object (defaults to today)
 * @param startOfWeek - Day of week to start (0 = Sunday, 1 = Monday, etc.)
 * @returns Date object set to end of week
 */
export const getEndOfWeek = (date: Date = new Date(), startOfWeek: number = 0): Date => {
  const start = getStartOfWeek(date, startOfWeek);
  return addDays(start, 6);
};

/**
 * Gets the start of month for a given date
 * @param date - Date object (defaults to today)
 * @returns Date object set to start of month
 */
export const getStartOfMonth = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setDate(1);
  return getStartOfDay(result);
};

/**
 * Gets the end of month for a given date
 * @param date - Date object (defaults to today)
 * @returns Date object set to end of month
 */
export const getEndOfMonth = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return getEndOfDay(result);
};

/**
 * Gets the start of year for a given date
 * @param date - Date object (defaults to today)
 * @returns Date object set to start of year
 */
export const getStartOfYear = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setMonth(0, 1);
  return getStartOfDay(result);
};

/**
 * Gets the end of year for a given date
 * @param date - Date object (defaults to today)
 * @returns Date object set to end of year
 */
export const getEndOfYear = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setMonth(11, 31);
  return getEndOfDay(result);
};

/**
 * Checks if a date is within a date range
 * @param date - Date to check
 * @param startDate - Start of range
 * @param endDate - End of range
 * @returns True if date is within range (inclusive)
 */
export const isDateInRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(d.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
};

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1h 30m 15s")
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 0) {
    return '0s';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Parses a duration string to seconds
 * @param duration - Duration string (e.g., "1h 30m 15s" or "90:15")
 * @returns Duration in seconds
 */
export const parseDuration = (duration: string): number => {
  // Handle format like "1h 30m 15s"
  const timeRegex = /(\d+)h\s*(\d+)m\s*(\d+)s/;
  const match = duration.match(timeRegex);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Handle format like "90:15" (minutes:seconds)
  const mmssRegex = /^(\d+):(\d+)$/;
  const mmssMatch = duration.match(mmssRegex);
  if (mmssMatch) {
    const minutes = parseInt(mmssMatch[1], 10);
    const seconds = parseInt(mmssMatch[2], 10);
    return minutes * 60 + seconds;
  }

  // Handle format like "90" (just seconds)
  const secondsOnly = parseInt(duration, 10);
  if (!isNaN(secondsOnly)) {
    return secondsOnly;
  }

  throw new Error(`Invalid duration format: ${duration}`);
};

