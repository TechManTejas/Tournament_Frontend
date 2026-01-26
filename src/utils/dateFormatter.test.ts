import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeDate,
  formatDateRange,
  isToday,
  isPast,
  isFuture,
  getStartOfDay,
  getEndOfDay,
  addDays,
  getDaysDifference,
  getHoursDifference,
  getMinutesDifference,
  addHours,
  addMinutes,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  isDateInRange,
  formatDuration,
  parseDuration,
} from './dateFormatter'

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('should format date in short format', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('should format date with time', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDate(date, { includeTime: true })
      expect(result).toContain('2:30')
    })

    it('should format date with seconds', () => {
      const date = new Date('2024-01-15T14:30:45')
      const result = formatDate(date, { includeTime: true, includeSeconds: true })
      expect(result).toContain('45')
    })

    it('should format date in long format', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date, { format: 'long' })
      expect(result).toContain('Monday')
      expect(result).toContain('January')
    })

    it('should format date in ISO format', () => {
      const date = new Date('2024-01-15T14:30:00Z')
      const result = formatDate(date, { format: 'iso' })
      expect(result).toContain('2024-01-15')
    })

    it('should format date from string', () => {
      const result = formatDate('2024-01-15')
      expect(result).toContain('Jan')
      expect(result).toContain('15')
    })

    it('should throw error for invalid date', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date')
    })
  })

  describe('formatRelativeDate', () => {
    it('should format date as "just now" for very recent dates', () => {
      const date = new Date()
      const result = formatRelativeDate(date)
      expect(result).toBe('just now')
    })

    it('should format past date correctly', () => {
      const date = new Date()
      date.setHours(date.getHours() - 2)
      const result = formatRelativeDate(date)
      expect(result).toContain('2 hours ago')
    })

    it('should format future date correctly', () => {
      const date = new Date()
      date.setDate(date.getDate() + 3)
      const result = formatRelativeDate(date)
      expect(result).toContain('in 3 days')
    })

    it('should handle plural forms correctly', () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      const result = formatRelativeDate(date)
      expect(result).toContain('1 day')
    })

    it('should throw error for invalid date', () => {
      expect(() => formatRelativeDate('invalid-date')).toThrow('Invalid date')
    })
  })

  describe('formatDateRange', () => {
    it('should format date range correctly', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-01-05')
      const result = formatDateRange(start, end)
      expect(result).toContain('Jan 1')
      expect(result).toContain('5')
      expect(result).toContain('2024')
    })

    it('should format date range with same month', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-01-10')
      const result = formatDateRange(start, end)
      expect(result).toContain('Jan 1')
      expect(result).toContain('10')
    })

    it('should throw error for invalid dates', () => {
      expect(() => formatDateRange('invalid', '2024-01-01')).toThrow('Invalid date')
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('should return false for yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isToday(yesterday)).toBe(false)
    })

    it('should return false for invalid date', () => {
      expect(isToday('invalid-date')).toBe(false)
    })
  })

  describe('isPast', () => {
    it('should return true for past date', () => {
      const past = new Date()
      past.setDate(past.getDate() - 1)
      expect(isPast(past)).toBe(true)
    })

    it('should return false for future date', () => {
      const future = new Date()
      future.setDate(future.getDate() + 1)
      expect(isPast(future)).toBe(false)
    })
  })

  describe('isFuture', () => {
    it('should return true for future date', () => {
      const future = new Date()
      future.setDate(future.getDate() + 1)
      expect(isFuture(future)).toBe(true)
    })

    it('should return false for past date', () => {
      const past = new Date()
      past.setDate(past.getDate() - 1)
      expect(isFuture(past)).toBe(false)
    })
  })

  describe('getStartOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = getStartOfDay(date)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
    })

    it('should use current date if no date provided', () => {
      const result = getStartOfDay()
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('getEndOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = getEndOfDay(date)
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
      expect(result.getSeconds()).toBe(59)
    })
  })

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-15')
      const result = addDays(date, 5)
      expect(result.getDate()).toBe(20)
    })

    it('should subtract days when negative', () => {
      const date = new Date('2024-01-15')
      const result = addDays(date, -5)
      expect(result.getDate()).toBe(10)
    })
  })

  describe('getDaysDifference', () => {
    it('should calculate days difference', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-06')
      const result = getDaysDifference(date1, date2)
      expect(result).toBe(5)
    })

    it('should return negative for reversed dates', () => {
      const date1 = new Date('2024-01-06')
      const date2 = new Date('2024-01-01')
      const result = getDaysDifference(date1, date2)
      expect(result).toBe(-5)
    })

    it('should handle string dates', () => {
      const result = getDaysDifference('2024-01-01', '2024-01-06')
      expect(result).toBe(5)
    })

    it('should throw error for invalid dates', () => {
      expect(() => getDaysDifference('invalid', '2024-01-01')).toThrow('Invalid date')
    })
  })

  describe('formatDate edge cases', () => {
    it('should handle custom format with all placeholders', () => {
      const date = new Date('2024-01-15T14:30:45')
      const result = formatDate(date, {
        format: 'custom',
        customFormat: 'YYYY-MM-DD HH:mm:ss',
      })
      expect(result).toContain('2024-01-15')
      expect(result).toContain('14:30:45')
    })

    it('should handle timezone option', () => {
      const date = new Date('2024-01-15T14:30:00Z')
      const result = formatDate(date, {
        format: 'long',
        timezone: 'America/New_York',
        includeTime: true,
      })
      expect(result).toBeTruthy()
    })

    it('should handle date at midnight', () => {
      const date = new Date('2024-01-15T00:00:00')
      const result = formatDate(date, { includeTime: true })
      expect(result).toContain('12:00')
    })

    it('should handle date at end of day', () => {
      const date = new Date('2024-01-15T23:59:59')
      const result = formatDate(date, { includeTime: true, includeSeconds: true })
      expect(result).toContain('11:59')
    })

    it('should handle leap year dates', () => {
      const date = new Date('2024-02-29')
      const result = formatDate(date)
      expect(result).toContain('Feb')
      expect(result).toContain('29')
    })

    it('should handle year boundary dates', () => {
      const date = new Date('2023-12-31')
      const result = formatDate(date)
      expect(result).toContain('Dec')
      expect(result).toContain('31')
      expect(result).toContain('2023')
    })

    it('should handle single digit days and months', () => {
      const date = new Date('2024-01-05')
      const result = formatDate(date)
      expect(result).toContain('Jan')
      expect(result).toContain('5')
    })
  })

  describe('formatRelativeDate edge cases', () => {
    it('should handle dates exactly one year ago', () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      const result = formatRelativeDate(date)
      expect(result).toContain('year')
    })

    it('should handle dates exactly one month ago', () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)
      const result = formatRelativeDate(date)
      expect(result).toContain('month')
    })

    it('should handle dates exactly one week ago', () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      const result = formatRelativeDate(date)
      expect(result).toContain('week')
    })

    it('should handle dates in the far future', () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() + 5)
      const result = formatRelativeDate(date)
      expect(result).toContain('in')
      expect(result).toContain('year')
    })

    it('should handle dates in the far past', () => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 10)
      const result = formatRelativeDate(date)
      expect(result).toContain('year')
      expect(result).toContain('ago')
    })
  })

  describe('formatDateRange edge cases', () => {
    it('should handle same start and end date', () => {
      const date = new Date('2024-01-15')
      const result = formatDateRange(date, date)
      expect(result).toContain('Jan 15')
    })

    it('should handle dates in different months', () => {
      const start = new Date('2024-01-15')
      const end = new Date('2024-02-20')
      const result = formatDateRange(start, end)
      expect(result).toContain('Jan')
      expect(result).toContain('Feb')
    })

    it('should handle dates in different years', () => {
      const start = new Date('2023-12-15')
      const end = new Date('2024-01-20')
      const result = formatDateRange(start, end)
      // Both years should be present when dates span different years
      expect(result).toContain('Dec 15')
      expect(result).toContain('Jan 20')
      expect(result).toContain('2023')
      expect(result).toContain('2024')
    })

    it('should handle very long date ranges', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      const result = formatDateRange(start, end)
      expect(result).toBeTruthy()
    })
  })

  describe('isToday edge cases', () => {
    it('should handle date at start of today', () => {
      const today = getStartOfDay()
      expect(isToday(today)).toBe(true)
    })

    it('should handle date at end of today', () => {
      const today = getEndOfDay()
      expect(isToday(today)).toBe(true)
    })

    it('should handle date exactly 24 hours ago', () => {
      const yesterday = new Date()
      yesterday.setHours(yesterday.getHours() - 24)
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('addDays edge cases', () => {
    it('should handle adding days across month boundary', () => {
      const date = new Date('2024-01-30')
      const result = addDays(date, 5)
      expect(result.getMonth()).toBe(1) // February
      expect(result.getDate()).toBe(4)
    })

    it('should handle adding days across year boundary', () => {
      const date = new Date('2023-12-30')
      const result = addDays(date, 5)
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January
    })

    it('should handle adding zero days', () => {
      const date = new Date('2024-01-15')
      const result = addDays(date, 0)
      expect(result.getTime()).toBe(date.getTime())
    })

    it('should handle adding large number of days', () => {
      const date = new Date('2024-01-01')
      // 2024 is a leap year (366 days), so 365 days is still in 2024
      // Use 366 days to get to 2025
      const result = addDays(date, 366)
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(1)
    })
  })

  describe('getDaysDifference edge cases', () => {
    it('should handle same dates', () => {
      const date = new Date('2024-01-15')
      const result = getDaysDifference(date, date)
      expect(result).toBe(0)
    })

    it('should handle dates exactly one day apart', () => {
      const date1 = new Date('2024-01-15')
      const date2 = new Date('2024-01-16')
      const result = getDaysDifference(date1, date2)
      expect(result).toBe(1)
    })

    it('should handle dates with time components', () => {
      const date1 = new Date('2024-01-15T00:00:00')
      const date2 = new Date('2024-01-16T23:59:59')
      const result = getDaysDifference(date1, date2)
      expect(result).toBe(1)
    })

    it('should handle very large date differences', () => {
      const date1 = new Date('2020-01-01')
      const date2 = new Date('2024-01-01')
      const result = getDaysDifference(date1, date2)
      expect(result).toBeGreaterThan(1400)
    })
  })

  describe('getHoursDifference', () => {
    it('should calculate hours difference', () => {
      const date1 = new Date('2024-01-01T10:00:00')
      const date2 = new Date('2024-01-01T14:30:00')
      const result = getHoursDifference(date1, date2)
      expect(result).toBe(4)
    })

    it('should handle negative differences', () => {
      const date1 = new Date('2024-01-01T14:00:00')
      const date2 = new Date('2024-01-01T10:00:00')
      const result = getHoursDifference(date1, date2)
      expect(result).toBe(-4)
    })

    it('should throw error for invalid dates', () => {
      expect(() => getHoursDifference('invalid', '2024-01-01')).toThrow('Invalid date')
    })
  })

  describe('getMinutesDifference', () => {
    it('should calculate minutes difference', () => {
      const date1 = new Date('2024-01-01T10:00:00')
      const date2 = new Date('2024-01-01T10:45:00')
      const result = getMinutesDifference(date1, date2)
      expect(result).toBe(45)
    })

    it('should handle negative differences', () => {
      const date1 = new Date('2024-01-01T10:45:00')
      const date2 = new Date('2024-01-01T10:00:00')
      const result = getMinutesDifference(date1, date2)
      expect(result).toBe(-45)
    })
  })

  describe('addHours', () => {
    it('should add hours to date', () => {
      const date = new Date('2024-01-01T10:00:00')
      const result = addHours(date, 5)
      expect(result.getHours()).toBe(15)
    })

    it('should handle negative hours', () => {
      const date = new Date('2024-01-01T10:00:00')
      const result = addHours(date, -3)
      expect(result.getHours()).toBe(7)
    })

    it('should handle hour overflow to next day', () => {
      const date = new Date('2024-01-01T22:00:00')
      const result = addHours(date, 5)
      expect(result.getDate()).toBe(2)
    })
  })

  describe('addMinutes', () => {
    it('should add minutes to date', () => {
      const date = new Date('2024-01-01T10:00:00')
      const result = addMinutes(date, 30)
      expect(result.getMinutes()).toBe(30)
    })

    it('should handle negative minutes', () => {
      const date = new Date('2024-01-01T10:30:00')
      const result = addMinutes(date, -15)
      expect(result.getMinutes()).toBe(15)
    })
  })

  describe('getStartOfWeek and getEndOfWeek', () => {
    it('should get start of week', () => {
      const date = new Date('2024-01-15') // Monday
      const result = getStartOfWeek(date, 1) // Start week on Monday
      expect(result.getDay()).toBe(1)
    })

    it('should get end of week', () => {
      const date = new Date('2024-01-15')
      const result = getEndOfWeek(date, 1)
      expect(result.getDay()).toBe(0) // Sunday
    })

    it('should use default start of week (Sunday)', () => {
      const date = new Date('2024-01-15')
      const result = getStartOfWeek(date)
      expect(result.getDay()).toBe(0)
    })
  })

  describe('getStartOfMonth and getEndOfMonth', () => {
    it('should get start of month', () => {
      const date = new Date('2024-01-15')
      const result = getStartOfMonth(date)
      expect(result.getDate()).toBe(1)
      expect(result.getMonth()).toBe(0)
    })

    it('should get end of month', () => {
      const date = new Date('2024-01-15')
      const result = getEndOfMonth(date)
      expect(result.getMonth()).toBe(0)
      expect(result.getDate()).toBe(31)
    })

    it('should handle February correctly', () => {
      const date = new Date('2024-02-15')
      const result = getEndOfMonth(date)
      expect(result.getDate()).toBe(29) // Leap year
    })
  })

  describe('getStartOfYear and getEndOfYear', () => {
    it('should get start of year', () => {
      const date = new Date('2024-06-15')
      const result = getStartOfYear(date)
      expect(result.getMonth()).toBe(0)
      expect(result.getDate()).toBe(1)
      expect(result.getFullYear()).toBe(2024)
    })

    it('should get end of year', () => {
      const date = new Date('2024-06-15')
      const result = getEndOfYear(date)
      expect(result.getMonth()).toBe(11)
      expect(result.getDate()).toBe(31)
      expect(result.getFullYear()).toBe(2024)
    })
  })

  describe('isDateInRange', () => {
    it('should return true for date within range', () => {
      const date = new Date('2024-06-15')
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      expect(isDateInRange(date, start, end)).toBe(true)
    })

    it('should return false for date outside range', () => {
      const date = new Date('2025-01-01')
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      expect(isDateInRange(date, start, end)).toBe(false)
    })

    it('should return true for date at range boundaries', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      expect(isDateInRange(start, start, end)).toBe(true)
      expect(isDateInRange(end, start, end)).toBe(true)
    })

    it('should return false for invalid dates', () => {
      expect(isDateInRange('invalid', '2024-01-01', '2024-12-31')).toBe(false)
    })
  })

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(3661)).toBe('1h 1m 1s')
      expect(formatDuration(3600)).toBe('1h')
      expect(formatDuration(90)).toBe('1m 30s')
      expect(formatDuration(45)).toBe('45s')
      expect(formatDuration(0)).toBe('0s')
    })

    it('should handle negative durations', () => {
      expect(formatDuration(-100)).toBe('0s')
    })

    it('should format large durations', () => {
      expect(formatDuration(366100)).toBe('101h 41m 40s')
    })
  })

  describe('parseDuration', () => {
    it('should parse duration string correctly', () => {
      expect(parseDuration('1h 30m 15s')).toBe(5415)
      expect(parseDuration('90:15')).toBe(5415)
      expect(parseDuration('90')).toBe(90)
    })

    it('should parse hours only', () => {
      expect(parseDuration('2h 0m 0s')).toBe(7200)
    })

    it('should parse minutes and seconds only', () => {
      expect(parseDuration('0h 5m 30s')).toBe(330)
    })

    it('should throw error for invalid format', () => {
      expect(() => parseDuration('invalid')).toThrow('Invalid duration format')
      expect(() => parseDuration('abc:def')).toThrow('Invalid duration format')
    })
  })
})

