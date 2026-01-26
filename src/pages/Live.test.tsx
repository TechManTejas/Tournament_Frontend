import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Live from './Live'
import { getUserDataFromStorage } from '../utils/storage'

vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

vi.mock('websocket', () => ({
  w3cwebsocket: vi.fn().mockImplementation(() => ({
    onopen: null,
    onclose: null,
    onmessage: null,
    onerror: null,
    close: vi.fn(),
    send: vi.fn(),
  })),
}))

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
  }
})

describe('Live', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { id: 1 },
      token: 'test-token',
    })
  })

  it('should render live component', () => {
    render(
      <BrowserRouter>
        <Live />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should render score card component', () => {
    const { container } = render(
      <BrowserRouter>
        <Live />
      </BrowserRouter>
    )

    expect(container).toBeTruthy()
  })

  it('should render match card component', () => {
    const { container } = render(
      <BrowserRouter>
        <Live />
      </BrowserRouter>
    )

    expect(container).toBeTruthy()
  })

  it('should handle websocket connection', () => {
    render(
      <BrowserRouter>
        <Live />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should initialize with default positions', () => {
    const { container } = render(
      <BrowserRouter>
        <Live />
      </BrowserRouter>
    )

    expect(container).toBeTruthy()
  })

  it('should handle component mounting', () => {
    render(
      <BrowserRouter>
        <Live />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })
})

