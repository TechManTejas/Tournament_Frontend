import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveUserDataToStorage,
  getUserDataFromStorage,
  clearUserDataFromStorage,
  storageKey,
  type UserData,
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
})

