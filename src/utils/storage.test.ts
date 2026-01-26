import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveUserDataToStorage,
  getUserDataFromStorage,
  clearUserDataFromStorage,
  saveUserPreferences,
  getUserPreferences,
  getDefaultPreferences,
  clearUserPreferences,
  saveToCache,
  getFromCache,
  clearCache,
  clearAllStorage,
  isStorageAvailable,
  getStorageSize,
  storageKey,
  storagePreferencesKey,
  storageCacheKey,
  type UserData,
  type UserPreferences,
} from './storage'
import { IUser } from '../types/user.types'

describe('storage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('saveUserDataToStorage', () => {
    it('should save user data to localStorage', () => {
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      } as IUser

      const userData: UserData = {
        user: mockUser,
        token: 'test-token-123',
      }

      saveUserDataToStorage(userData)

      const stored = localStorage.getItem(storageKey)
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.user.username).toBe('testuser')
      expect(parsed.token).toBe('test-token-123')
    })

    it('should throw error on storage failure', () => {
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      } as IUser

      const userData: UserData = {
        user: mockUser,
        token: 'test-token-123',
      }

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Use vi.spyOn to mock localStorage.setItem
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      expect(() => saveUserDataToStorage(userData)).toThrow('Failed to save user data')
      expect(consoleSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('getUserDataFromStorage', () => {
    it('should retrieve user data from localStorage', () => {
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      } as IUser

      const userData: UserData = {
        user: mockUser,
        token: 'test-token-123',
      }

      localStorage.setItem(storageKey, JSON.stringify(userData))
      const retrieved = getUserDataFromStorage()

      expect(retrieved).not.toBeNull()
      expect(retrieved?.user.username).toBe('testuser')
      expect(retrieved?.token).toBe('test-token-123')
    })

    it('should return null when no data exists', () => {
      const retrieved = getUserDataFromStorage()
      expect(retrieved).toBeNull()
    })

    it('should return null when invalid JSON is stored', () => {
      localStorage.setItem(storageKey, 'invalid-json{')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const retrieved = getUserDataFromStorage()
      
      expect(retrieved).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should return null when data structure is invalid', () => {
      localStorage.setItem(storageKey, JSON.stringify({ invalid: 'data' }))
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const retrieved = getUserDataFromStorage()
      
      expect(retrieved).toBeNull()
      
      consoleSpy.mockRestore()
    })
  })

  describe('clearUserDataFromStorage', () => {
    it('should remove user data from localStorage', () => {
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      } as IUser

      const userData: UserData = {
        user: mockUser,
        token: 'test-token-123',
      }

      localStorage.setItem(storageKey, JSON.stringify(userData))
      clearUserDataFromStorage()

      const stored = localStorage.getItem(storageKey)
      expect(stored).toBeNull()
    })
  })

  describe('saveUserPreferences', () => {
    it('should save user preferences to localStorage', () => {
      const preferences: UserPreferences = {
        theme: 'dark',
        language: 'en',
        notifications: true,
        emailNotifications: false,
        timezone: 'UTC',
      }

      saveUserPreferences(preferences)

      const stored = localStorage.getItem(storagePreferencesKey)
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed.theme).toBe('dark')
    })

    it('should throw error on storage failure', () => {
      const preferences: UserPreferences = getDefaultPreferences()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Use vi.spyOn to mock localStorage.setItem
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => saveUserPreferences(preferences)).toThrow('Failed to save preferences')
      expect(consoleSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('getUserPreferences', () => {
    it('should retrieve user preferences from localStorage', () => {
      const preferences: UserPreferences = {
        theme: 'light',
        language: 'en',
        notifications: true,
        emailNotifications: true,
        timezone: 'America/New_York',
      }

      localStorage.setItem(storagePreferencesKey, JSON.stringify(preferences))
      const retrieved = getUserPreferences()

      expect(retrieved).not.toBeNull()
      expect(retrieved?.theme).toBe('light')
      expect(retrieved?.timezone).toBe('America/New_York')
    })

    it('should return null when no preferences exist', () => {
      const retrieved = getUserPreferences()
      expect(retrieved).toBeNull()
    })
  })

  describe('getDefaultPreferences', () => {
    it('should return default preferences', () => {
      const defaults = getDefaultPreferences()
      expect(defaults.theme).toBe('auto')
      expect(defaults.language).toBe('en')
      expect(defaults.notifications).toBe(true)
      expect(defaults.emailNotifications).toBe(false)
      expect(defaults.timezone).toBeTruthy()
    })
  })

  describe('clearUserPreferences', () => {
    it('should remove user preferences from localStorage', () => {
      const preferences: UserPreferences = getDefaultPreferences()
      localStorage.setItem(storagePreferencesKey, JSON.stringify(preferences))
      clearUserPreferences()

      const stored = localStorage.getItem(storagePreferencesKey)
      expect(stored).toBeNull()
    })
  })

  describe('saveToCache and getFromCache', () => {
    it('should save and retrieve data from cache', () => {
      const testData = { key: 'value', number: 123 }
      saveToCache('test-key', testData, 60)

      const retrieved = getFromCache<typeof testData>('test-key')
      expect(retrieved).toEqual(testData)
    })

    it('should return null for expired cache entries', async () => {
      const testData = { key: 'value' }
      saveToCache('expired-key', testData, 0.001) // 0.001 minutes = very short TTL

      await new Promise((resolve) => setTimeout(resolve, 100))

      const retrieved = getFromCache('expired-key')
      expect(retrieved).toBeNull()
    })

    it('should return null for non-existent cache keys', () => {
      const retrieved = getFromCache('non-existent')
      expect(retrieved).toBeNull()
    })
  })

  describe('clearCache', () => {
    it('should clear specific cache entry', () => {
      saveToCache('key1', { data: 1 })
      saveToCache('key2', { data: 2 })

      clearCache('key1')

      expect(getFromCache('key1')).toBeNull()
      expect(getFromCache('key2')).not.toBeNull()
    })

    it('should clear all cache when no key provided', () => {
      saveToCache('key1', { data: 1 })
      saveToCache('key2', { data: 2 })

      clearCache()

      expect(getFromCache('key1')).toBeNull()
      expect(getFromCache('key2')).toBeNull()
    })
  })

  describe('clearAllStorage', () => {
    it('should clear all storage data', () => {
      const mockUser: IUser = { id: 1, username: 'test' } as IUser
      saveUserDataToStorage({ user: mockUser, token: 'token' })
      saveUserPreferences(getDefaultPreferences())
      saveToCache('test', { data: 1 })

      clearAllStorage()

      expect(getUserDataFromStorage()).toBeNull()
      expect(getUserPreferences()).toBeNull()
      expect(getFromCache('test')).toBeNull()
    })
  })

  describe('isStorageAvailable', () => {
    it('should return true when storage is available', () => {
      expect(isStorageAvailable()).toBe(true)
    })

    it('should return false when storage is not available', () => {
      // Mock both setItem and removeItem to throw to properly test
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage not available')
      })
      
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage not available')
      })

      const result = isStorageAvailable()
      expect(result).toBe(false)

      setItemSpy.mockRestore()
      removeItemSpy.mockRestore()
    })
  })

  describe('getStorageSize', () => {
    it('should calculate storage size', () => {
      saveUserDataToStorage({
        user: { id: 1, username: 'test' } as IUser,
        token: 'token',
      })
      saveUserPreferences(getDefaultPreferences())

      const size = getStorageSize()
      expect(size).toBeGreaterThan(0)
    })

    it('should return 0 when storage is empty', () => {
      localStorage.clear()
      const size = getStorageSize()
      expect(size).toBe(0)
    })
  })
})

