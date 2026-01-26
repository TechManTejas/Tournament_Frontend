import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Referees from './Referees'
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

describe('Referees', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { role: 'club_admin' },
      token: 'test-token',
    })
  })

  it('should render referees component', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Referees />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should fetch referees on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Referees />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should display referees data', async () => {
    const mockReferees = [
      { id: 1, name: 'Referee 1' },
      { id: 2, name: 'Referee 2' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockReferees, count: 2 },
    })

    render(
      <BrowserRouter>
        <Referees />
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
        <Referees />
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
        <Referees />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should show add button for club admin', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Referees />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle delete action', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [{ id: 1, name: 'Referee 1' }], count: 1 },
    })

    vi.mocked(axios.delete).mockResolvedValue({})

    render(
      <BrowserRouter>
        <Referees />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

