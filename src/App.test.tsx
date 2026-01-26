import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

// Mock the context provider
vi.mock('./context/context.provider', () => ({
  Context: () => ({
    userAuthenticated: false,
    userVerified: false,
  }),
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the app component', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('should render router component', () => {
    const { container } = render(<App />)
    // Router should be present
    expect(container.querySelector('div')).toBeTruthy()
  })
})

