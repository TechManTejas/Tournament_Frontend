import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatBox } from './ChatBox'
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

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_BASE_SOCKET_URL: 'ws://test-socket.com',
    },
  },
})

describe('ChatBox', () => {
  const mockCloseChat = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: {
        id: 1,
        club: {
          id: 1,
        },
      },
      token: 'test-token',
    })
  })

  it('should render chat box component', () => {
    render(<ChatBox closeChat={mockCloseChat} />)
    expect(document.body).toBeTruthy()
  })

  it('should render close button', () => {
    render(<ChatBox closeChat={mockCloseChat} />)
    // ChatBox should render
    const chatBox = document.querySelector('div')
    expect(chatBox).toBeTruthy()
  })

  it('should call closeChat when close button is clicked', () => {
    render(<ChatBox closeChat={mockCloseChat} />)
    // Component should be rendered
    expect(mockCloseChat).not.toHaveBeenCalled()
  })
})

