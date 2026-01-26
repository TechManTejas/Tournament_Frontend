import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUrl,
  validateNumber,
  validateRequired,
  validateLength,
  validateDate,
  validateMultiple,
  validateUsername,
  validateTeamName,
  validateTournamentName,
  validateScore,
  validateMatchTime,
} from './validation'

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true)
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true)
      expect(validateEmail('user+tag@example.com').isValid).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid').isValid).toBe(false)
      expect(validateEmail('@example.com').isValid).toBe(false)
      expect(validateEmail('user@').isValid).toBe(false)
      expect(validateEmail('user@domain').isValid).toBe(false)
    })

    it('should handle empty email when allowEmpty is true', () => {
      expect(validateEmail('', { allowEmpty: true }).isValid).toBe(true)
    })

    it('should reject empty email when allowEmpty is false', () => {
      expect(validateEmail('').isValid).toBe(false)
    })

    it('should validate domain when checkDomain is enabled', () => {
      const result = validateEmail('test@example.com', {
        checkDomain: true,
        allowedDomains: ['example.com', 'test.com'],
      })
      expect(result.isValid).toBe(true)
    })

    it('should reject email with disallowed domain', () => {
      const result = validateEmail('test@other.com', {
        checkDomain: true,
        allowedDomains: ['example.com'],
      })
      expect(result.isValid).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123').isValid).toBe(true)
      expect(validatePassword('MyP@ssw0rd').isValid).toBe(true)
    })

    it('should reject short passwords', () => {
      expect(validatePassword('Short1').isValid).toBe(false)
    })

    it('should reject passwords without uppercase', () => {
      expect(validatePassword('password123').isValid).toBe(false)
    })

    it('should reject passwords without lowercase', () => {
      expect(validatePassword('PASSWORD123').isValid).toBe(false)
    })

    it('should reject passwords without numbers', () => {
      expect(validatePassword('Password').isValid).toBe(false)
    })

    it('should validate with custom requirements', () => {
      expect(
        validatePassword('simplepass', 8, false, true, false, false).isValid
      ).toBe(true)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('1234567890').isValid).toBe(true)
      expect(validatePhone('+1 (123) 456-7890').isValid).toBe(true)
      expect(validatePhone('123-456-7890').isValid).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123').isValid).toBe(false)
      expect(validatePhone('abc1234567').isValid).toBe(false)
    })

    it('should handle empty phone when allowEmpty is true', () => {
      expect(validatePhone('', true).isValid).toBe(true)
    })
  })

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com').isValid).toBe(true)
      expect(validateUrl('http://test.org').isValid).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url').isValid).toBe(false)
      expect(validateUrl('').isValid).toBe(false)
    })

    it('should require protocol by default', () => {
      expect(validateUrl('example.com', true).isValid).toBe(false)
    })
  })

  describe('validateNumber', () => {
    it('should validate numbers in range', () => {
      expect(validateNumber(5, 0, 10).isValid).toBe(true)
      expect(validateNumber('15', 10, 20).isValid).toBe(true)
    })

    it('should reject numbers outside range', () => {
      expect(validateNumber(15, 0, 10).isValid).toBe(false)
      expect(validateNumber(5, 10, 20).isValid).toBe(false)
    })

    it('should reject non-numeric values', () => {
      expect(validateNumber('abc').isValid).toBe(false)
    })

    it('should validate integers when allowFloat is false', () => {
      expect(validateNumber(5.5, undefined, undefined, false).isValid).toBe(false)
      expect(validateNumber(5, undefined, undefined, false).isValid).toBe(true)
    })
  })

  describe('validateRequired', () => {
    it('should validate non-empty values', () => {
      expect(validateRequired('value').isValid).toBe(true)
      expect(validateRequired(0).isValid).toBe(true)
      expect(validateRequired(false).isValid).toBe(true)
    })

    it('should reject empty values', () => {
      expect(validateRequired('').isValid).toBe(false)
      expect(validateRequired(null).isValid).toBe(false)
      expect(validateRequired(undefined).isValid).toBe(false)
      expect(validateRequired([]).isValid).toBe(false)
    })
  })

  describe('validateLength', () => {
    it('should validate strings within length range', () => {
      expect(validateLength('test', 2, 10).isValid).toBe(true)
    })

    it('should reject strings too short', () => {
      expect(validateLength('a', 2, 10).isValid).toBe(false)
    })

    it('should reject strings too long', () => {
      expect(validateLength('this is too long', 2, 10).isValid).toBe(false)
    })
  })

  describe('validateDate', () => {
    it('should validate correct dates', () => {
      expect(validateDate('2024-01-15').isValid).toBe(true)
      expect(validateDate(new Date()).isValid).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(validateDate('invalid').isValid).toBe(false)
    })

    it('should validate date within range', () => {
      const min = new Date('2024-01-01')
      const max = new Date('2024-12-31')
      expect(validateDate('2024-06-15', min, max).isValid).toBe(true)
    })

    it('should reject date before minimum', () => {
      const min = new Date('2024-01-01')
      expect(validateDate('2023-12-31', min).isValid).toBe(false)
    })
  })

  describe('validateMultiple', () => {
    it('should return valid when all validations pass', () => {
      const results = [
        { isValid: true },
        { isValid: true },
        { isValid: true },
      ]
      expect(validateMultiple(results).isValid).toBe(true)
    })

    it('should return first invalid result', () => {
      const results = [
        { isValid: true },
        { isValid: false, error: 'Error 1' },
        { isValid: false, error: 'Error 2' },
      ]
      const result = validateMultiple(results)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Error 1')
    })
  })

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      expect(validateUsername('user123').isValid).toBe(true)
      expect(validateUsername('user_name').isValid).toBe(true)
      expect(validateUsername('user-name').isValid).toBe(true)
    })

    it('should reject invalid usernames', () => {
      expect(validateUsername('ab').isValid).toBe(false) // too short
      expect(validateUsername('a'.repeat(21)).isValid).toBe(false) // too long
      expect(validateUsername('_user').isValid).toBe(false) // starts with underscore
      expect(validateUsername('user@name').isValid).toBe(false) // invalid character
    })
  })

  describe('validateTeamName', () => {
    it('should validate correct team names', () => {
      expect(validateTeamName('Team Alpha').isValid).toBe(true)
      expect(validateTeamName('FC Barcelona').isValid).toBe(true)
    })

    it('should reject invalid team names', () => {
      expect(validateTeamName('').isValid).toBe(false)
      expect(validateTeamName('A').isValid).toBe(false) // too short
    })
  })

  describe('validateTournamentName', () => {
    it('should validate correct tournament names', () => {
      expect(validateTournamentName('World Cup 2024').isValid).toBe(true)
    })

    it('should reject invalid tournament names', () => {
      expect(validateTournamentName('').isValid).toBe(false)
      expect(validateTournamentName('AB').isValid).toBe(false) // too short
    })
  })

  describe('validateScore', () => {
    it('should validate non-negative scores', () => {
      expect(validateScore(0).isValid).toBe(true)
      expect(validateScore(10).isValid).toBe(true)
      expect(validateScore('5').isValid).toBe(true)
    })

    it('should reject negative scores', () => {
      expect(validateScore(-1).isValid).toBe(false)
    })
  })

  describe('validateMatchTime', () => {
    it('should validate match time within range', () => {
      expect(validateMatchTime(3600).isValid).toBe(true) // 1 hour
      expect(validateMatchTime(0).isValid).toBe(true)
    })

    it('should reject match time exceeding maximum', () => {
      expect(validateMatchTime(10000).isValid).toBe(false) // exceeds 2 hours
    })

    it('should reject negative match time', () => {
      expect(validateMatchTime(-100).isValid).toBe(false)
    })
  })
})

