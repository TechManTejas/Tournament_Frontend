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
})

