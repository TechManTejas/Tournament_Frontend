/**
 * Validation utilities for tournament management
 * Provides various validation functions for form inputs, data validation, and business logic
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  field?: string;
}

export interface EmailValidationOptions {
  allowEmpty?: boolean;
  checkDomain?: boolean;
  allowedDomains?: string[];
}

/**
 * Validates an email address
 * @param email - Email address to validate
 * @param options - Validation options
 * @returns ValidationResult
 */
export const validateEmail = (
  email: string,
  options: EmailValidationOptions = {}
): ValidationResult => {
  const { allowEmpty = false, checkDomain = false, allowedDomains = [] } = options;

  if (!email || email.trim() === '') {
    if (allowEmpty) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Email is required', field: 'email' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format', field: 'email' };
  }

  if (checkDomain && allowedDomains.length > 0) {
    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      return {
        isValid: false,
        error: `Email domain must be one of: ${allowedDomains.join(', ')}`,
        field: 'email',
      };
    }
  }

  return { isValid: true };
};

/**
 * Validates a password
 * @param password - Password to validate
 * @param minLength - Minimum password length (default: 8)
 * @param requireUppercase - Require uppercase letter (default: true)
 * @param requireLowercase - Require lowercase letter (default: true)
 * @param requireNumber - Require number (default: true)
 * @param requireSpecialChar - Require special character (default: false)
 * @returns ValidationResult
 */
export const validatePassword = (
  password: string,
  minLength: number = 8,
  requireUppercase: boolean = true,
  requireLowercase: boolean = true,
  requireNumber: boolean = true,
  requireSpecialChar: boolean = false
): ValidationResult => {
  if (!password || password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`,
      field: 'password',
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
      field: 'password',
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
      field: 'password',
    };
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
      field: 'password',
    };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
      field: 'password',
    };
  }

  return { isValid: true };
};

/**
 * Validates a phone number
 * @param phone - Phone number to validate
 * @param allowEmpty - Allow empty phone number (default: false)
 * @returns ValidationResult
 */
export const validatePhone = (phone: string, allowEmpty: boolean = false): ValidationResult => {
  if (!phone || phone.trim() === '') {
    if (allowEmpty) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Phone number is required', field: 'phone' };
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');

  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must contain only digits', field: 'phone' };
  }

  // Check length (typically 10-15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return {
      isValid: false,
      error: 'Phone number must be between 10 and 15 digits',
      field: 'phone',
    };
  }

  return { isValid: true };
};

/**
 * Validates a URL
 * @param url - URL to validate
 * @param requireProtocol - Require http:// or https:// (default: true)
 * @returns ValidationResult
 */
export const validateUrl = (url: string, requireProtocol: boolean = true): ValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required', field: 'url' };
  }

  try {
    const urlObj = new URL(url);
    if (requireProtocol && !['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: 'URL must start with http:// or https://',
        field: 'url',
      };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format', field: 'url' };
  }
};

/**
 * Validates a number within a range
 * @param value - Number to validate
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @param allowFloat - Allow decimal numbers (default: false)
 * @returns ValidationResult
 */
export const validateNumber = (
  value: string | number,
  min?: number,
  max?: number,
  allowFloat: boolean = false
): ValidationResult => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return { isValid: false, error: 'Value must be a valid number', field: 'number' };
  }

  if (!allowFloat && !Number.isInteger(numValue)) {
    return { isValid: false, error: 'Value must be an integer', field: 'number' };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      error: `Value must be at least ${min}`,
      field: 'number',
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `Value must be at most ${max}`,
      field: 'number',
    };
  }

  return { isValid: true };
};

/**
 * Validates a required field
 * @param value - Value to validate
 * @param fieldName - Name of the field (for error message)
 * @returns ValidationResult
 */
export const validateRequired = (value: any, fieldName: string = 'Field'): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required`, field: fieldName.toLowerCase() };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required`, field: fieldName.toLowerCase() };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required`, field: fieldName.toLowerCase() };
  }

  return { isValid: true };
};

/**
 * Validates string length
 * @param value - String to validate
 * @param minLength - Minimum length (optional)
 * @param maxLength - Maximum length (optional)
 * @returns ValidationResult
 */
export const validateLength = (
  value: string,
  minLength?: number,
  maxLength?: number
): ValidationResult => {
  if (typeof value !== 'string') {
    return { isValid: false, error: 'Value must be a string', field: 'text' };
  }

  const length = value.length;

  if (minLength !== undefined && length < minLength) {
    return {
      isValid: false,
      error: `Text must be at least ${minLength} characters long`,
      field: 'text',
    };
  }

  if (maxLength !== undefined && length > maxLength) {
    return {
      isValid: false,
      error: `Text must be at most ${maxLength} characters long`,
      field: 'text',
    };
  }

  return { isValid: true };
};

/**
 * Validates a date
 * @param date - Date to validate (string or Date object)
 * @param minDate - Minimum allowed date (optional)
 * @param maxDate - Maximum allowed date (optional)
 * @returns ValidationResult
 */
export const validateDate = (
  date: string | Date,
  minDate?: Date,
  maxDate?: Date
): ValidationResult => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format', field: 'date' };
  }

  if (minDate && dateObj < minDate) {
    return {
      isValid: false,
      error: `Date must be on or after ${minDate.toLocaleDateString()}`,
      field: 'date',
    };
  }

  if (maxDate && dateObj > maxDate) {
    return {
      isValid: false,
      error: `Date must be on or before ${maxDate.toLocaleDateString()}`,
      field: 'date',
    };
  }

  return { isValid: true };
};

/**
 * Validates multiple fields at once
 * @param validations - Array of validation results
 * @returns Combined validation result
 */
export const validateMultiple = (validations: ValidationResult[]): ValidationResult => {
  const invalid = validations.find((v) => !v.isValid);
  if (invalid) {
    return invalid;
  }
  return { isValid: true };
};

/**
 * Validates a username
 * @param username - Username to validate
 * @param minLength - Minimum length (default: 3)
 * @param maxLength - Maximum length (default: 20)
 * @returns ValidationResult
 */
export const validateUsername = (
  username: string,
  minLength: number = 3,
  maxLength: number = 20
): ValidationResult => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username is required', field: 'username' };
  }

  const trimmed = username.trim();

  if (trimmed.length < minLength || trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `Username must be between ${minLength} and ${maxLength} characters`,
      field: 'username',
    };
  }

  // Username can contain letters, numbers, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores, and hyphens',
      field: 'username',
    };
  }

  // Username must start with a letter or number
  if (!/^[a-zA-Z0-9]/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Username must start with a letter or number',
      field: 'username',
    };
  }

  return { isValid: true };
};

/**
 * Validates a team name
 * @param teamName - Team name to validate
 * @returns ValidationResult
 */
export const validateTeamName = (teamName: string): ValidationResult => {
  const required = validateRequired(teamName, 'Team name');
  if (!required.isValid) {
    return required;
  }

  const length = validateLength(teamName, 2, 50);
  if (!length.isValid) {
    return length;
  }

  return { isValid: true };
};

/**
 * Validates a tournament name
 * @param tournamentName - Tournament name to validate
 * @returns ValidationResult
 */
export const validateTournamentName = (tournamentName: string): ValidationResult => {
  const required = validateRequired(tournamentName, 'Tournament name');
  if (!required.isValid) {
    return required;
  }

  const length = validateLength(tournamentName, 3, 100);
  if (!length.isValid) {
    return length;
  }

  return { isValid: true };
};

/**
 * Validates a score value
 * @param score - Score to validate
 * @returns ValidationResult
 */
export const validateScore = (score: number | string): ValidationResult => {
  return validateNumber(score, 0, undefined, false);
};

/**
 * Validates a match time (in seconds)
 * @param time - Time in seconds
 * @param maxTime - Maximum allowed time (default: 7200 for 2 hours)
 * @returns ValidationResult
 */
export const validateMatchTime = (time: number, maxTime: number = 7200): ValidationResult => {
  return validateNumber(time, 0, maxTime, false);
};

