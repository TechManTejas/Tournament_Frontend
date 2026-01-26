import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Profile } from './Profile'
import { getUserDataFromStorage, clearUserDataFromStorage } from '../utils/storage'

vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
  clearUserDataFromStorage: vi.fn(),
}))

// Mock window.location
delete (window as any).location
window.location = { href: '' } as any

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render user profile information', () => {
    const mockUser = {
      username: 'testuser',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'Admin',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: mockUser,
      token: 'test-token',
    })

    render(<Profile />)

    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('should render logout button', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { username: 'test' },
      token: 'token',
    })

    render(<Profile />)
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should handle logout click', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { username: 'test' },
      token: 'token',
    })

    render(<Profile />)
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    expect(clearUserDataFromStorage).toHaveBeenCalled()
  })

  it('should handle missing user data gracefully', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue(null)

    render(<Profile />)
    expect(document.body).toBeTruthy()
  })
})

