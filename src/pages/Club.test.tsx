import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Club } from './Club'
import { getUserDataFromStorage } from '../utils/storage'

vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

describe('Club', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render club component with club data', () => {
    const mockClub = {
      id: 1,
      name: 'Test Club',
      logo: 'club-logo.png',
      address: '123 Main St',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    render(<Club />)
    expect(screen.getByText('Test Club')).toBeInTheDocument()
  })

  it('should render club logo when available', () => {
    const mockClub = {
      id: 1,
      name: 'Test Club',
      logo: 'club-logo.png',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    const { container } = render(<Club />)
    const logo = container.querySelector('img[alt="Club Logo"]')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'club-logo.png')
  })

  it('should handle missing club data gracefully', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
      },
      token: 'test-token',
    })

    render(<Club />)
    expect(document.body).toBeTruthy()
  })

  it('should handle null user data', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue(null)

    render(<Club />)
    expect(document.body).toBeTruthy()
  })

  it('should display club name when club exists', () => {
    const mockClub = {
      id: 1,
      name: 'My Football Club',
      logo: 'logo.png',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    render(<Club />)
    expect(screen.getByText('My Football Club')).toBeInTheDocument()
  })
})

