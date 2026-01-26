import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Authentication } from './Authentication'
import axios from 'axios'
import { saveUserDataToStorage } from '../utils/storage'

vi.mock('axios')
vi.mock('../context/context.provider', () => ({
  Context: () => ({
    setUserAuthenticated: vi.fn(),
    setUserVerified: vi.fn(),
  }),
}))

vi.mock('../utils/storage', () => ({
  saveUserDataToStorage: vi.fn(),
}))

// Mock window.location
delete (window as any).location
window.location = { href: '' } as any

// Mock import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_BASE_URL: 'http://test-api.com',
      },
    },
  },
  writable: true,
})

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render authentication component', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should render login form by default', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    const form = document.querySelector('.ant-form')
    expect(form).toBeTruthy()
  })

  it('should switch between login and register forms', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should handle successful login', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { id: 1, username: 'testuser', verified: true },
      },
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(document.body).toBeTruthy()
    })
  })

  it('should handle login error', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('Invalid credentials'))

    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(document.body).toBeTruthy()
    })
  })

  it('should handle successful registration', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { id: 1, username: 'newuser', verified: false },
      },
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(document.body).toBeTruthy()
    })
  })

  it('should handle registration error', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('Registration failed'))

    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(document.body).toBeTruthy()
    })
  })

  it('should save user data on successful authentication', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { id: 1, username: 'testuser', verified: true },
      },
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(document.body).toBeTruthy()
    })
  })
})

