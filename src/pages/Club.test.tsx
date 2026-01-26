import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Club } from './Club'
import { getUserDataFromStorage } from '../utils/storage'

vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

vi.mock('../utils/dateFormatter', () => ({
  formatDate: vi.fn((date) => date.toLocaleDateString()),
  isToday: vi.fn(() => false),
  formatRelativeDate: vi.fn(() => '2 days ago'),
}))

// Mock console.log to avoid test output noise
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('Club', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockClear()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
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

  it('should render with proper container structure', () => {
    const mockClub = {
      id: 1,
      name: 'Test Club',
      logo: 'logo.png',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    const { container } = render(<Club />)
    const mainContainer = container.querySelector('.p-6.flex.flex-col')
    expect(mainContainer).toBeInTheDocument()
  })

  it('should handle club with all properties', () => {
    const mockClub = {
      id: 1,
      name: 'Complete Club',
      logo: 'complete-logo.png',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      founded: 1990,
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    render(<Club />)
    expect(screen.getByText('Complete Club')).toBeInTheDocument()
  })

  it('should handle empty club name', () => {
    const mockClub = {
      id: 1,
      name: '',
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
    const container = document.querySelector('.p-6')
    expect(container).toBeInTheDocument()
  })

  it('should handle undefined club logo', () => {
    const mockClub = {
      id: 1,
      name: 'Club Without Logo',
      logo: undefined,
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
  })

  it('should call getUserDataFromStorage on render', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: { id: 1, name: 'Test' },
      },
      token: 'test-token',
    })

    render(<Club />)
    expect(getUserDataFromStorage).toHaveBeenCalled()
  })

  it('should load club statistics on mount', async () => {
    const mockClub = {
      id: 1,
      name: 'Test Club',
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
    // Wait for statistics to load
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(screen.getByText('Test Club')).toBeInTheDocument()
  })

  it('should render with correct CSS classes', () => {
    const mockClub = {
      id: 1,
      name: 'Styled Club',
      logo: 'logo.png',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    const { container } = render(<Club />)
    const mainDiv = container.querySelector('.p-6.flex.flex-col.gap-12')
    expect(mainDiv).toBeInTheDocument()
  })

  it('should handle multiple re-renders correctly', () => {
    const mockClub = {
      id: 1,
      name: 'Re-render Test',
      logo: 'logo.png',
    }

    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: mockClub,
      },
      token: 'test-token',
    })

    const { rerender } = render(<Club />)
    expect(screen.getByText('Re-render Test')).toBeInTheDocument()

    rerender(<Club />)
    expect(screen.getByText('Re-render Test')).toBeInTheDocument()
  })
})

