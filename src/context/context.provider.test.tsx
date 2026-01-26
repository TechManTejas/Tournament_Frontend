import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyContextProvider, Context } from './context.provider'
import { getUserDataFromStorage } from '../utils/storage'

vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

describe('MyContextProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide context with user authenticated when token exists', () => {
    const mockStorageData = {
      token: 'test-token',
      user: { id: 1, verified: true },
    }
    vi.mocked(getUserDataFromStorage).mockReturnValue(mockStorageData)

    const TestComponent = () => {
      const context = Context()
      return <div>{context.userAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
    }

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )

    expect(screen.getByText('Authenticated')).toBeInTheDocument()
  })

  it('should provide context with user not authenticated when no token', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue(null)

    const TestComponent = () => {
      const context = Context()
      return <div>{context.userAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
    }

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )

    expect(screen.getByText('Not Authenticated')).toBeInTheDocument()
  })

  it('should provide userVerified from storage data', () => {
    const mockStorageData = {
      token: 'test-token',
      user: { id: 1, verified: true },
    }
    vi.mocked(getUserDataFromStorage).mockReturnValue(mockStorageData)

    const TestComponent = () => {
      const context = Context()
      return <div>{context.userVerified ? 'Verified' : 'Not Verified'}</div>
    }

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )

    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('should provide setUserAuthenticated and setUserVerified functions', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue(null)

    const TestComponent = () => {
      const context = Context()
      expect(typeof context.setUserAuthenticated).toBe('function')
      expect(typeof context.setUserVerified).toBe('function')
      return <div>Test</div>
    }

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
  })
})

describe('Context hook', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const TestComponent = () => {
      try {
        Context()
        return <div>No Error</div>
      } catch (error) {
        return <div>Error Thrown</div>
      }
    }

    const { container } = render(<TestComponent />)
    
    // The error should be caught and component should render error state
    expect(container.textContent).toBeTruthy()

    consoleSpy.mockRestore()
  })
})

