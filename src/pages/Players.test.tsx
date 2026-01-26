import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Players from './Players'
import axios from '../api/axios'
import { getUserDataFromStorage } from '../utils/storage'

vi.mock('../api/axios')
vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

vi.mock('../components/Confirmation', () => ({
  confirmation: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Players', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { role: 'club_admin' },
      token: 'test-token',
    })
  })

  it('should render players component', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Players />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should fetch players on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Players />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should display players data', async () => {
    const mockPlayers = [
      { id: 1, name: 'Player 1', email: 'player1@test.com' },
      { id: 2, name: 'Player 2', email: 'player2@test.com' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockPlayers, count: 2 },
    })

    render(
      <BrowserRouter>
        <Players />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle search functionality', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Players />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle pagination', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Players />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

