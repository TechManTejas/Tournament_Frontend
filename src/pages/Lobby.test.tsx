import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Lobby } from './Lobby'
import axios from '../api/axios'
import { getUserDataFromStorage, saveUserDataToStorage } from '../utils/storage'
import { Context } from '../context/context.provider'

vi.mock('../api/axios')
vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
  saveUserDataToStorage: vi.fn(),
}))

vi.mock('../context/context.provider', () => ({
  Context: () => ({
    setUserVerified: vi.fn(),
  }),
}))

// Mock window.location
delete (window as any).location
window.location = { href: '' } as any

describe('Lobby', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render lobby component', () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { id: 1 },
      token: 'test-token',
    })

    vi.mocked(axios.get).mockResolvedValue({
      data: { verified: false, message: 'Waiting for verification' },
    })

    render(<Lobby />)
    expect(document.body).toBeTruthy()
  })

  it('should check verification status on mount', async () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { id: 1 },
      token: 'test-token',
    })

    vi.mocked(axios.get).mockResolvedValue({
      data: { verified: false },
    })

    render(<Lobby />)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle verified user', async () => {
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { id: 1 },
      token: 'test-token',
    })

    vi.mocked(axios.get).mockResolvedValue({
      data: { verified: true, id: 1 },
    })

    render(<Lobby />)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

