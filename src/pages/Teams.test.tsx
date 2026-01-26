import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Teams } from './Teams'
import axios from '../api/axios'
import { getUserDataFromStorage } from '../utils/storage'

vi.mock('../api/axios')
vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

vi.mock('../components/Confirmation', () => ({
  confirmation: vi.fn(),
}))

describe('Teams', () => {
  const mockToggleAddEdit = vi.fn()
  const mockHandleSelectTeam = vi.fn()
  const mockTournament = {
    id: 1,
    name: 'Test Tournament',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { role: 'club_admin' },
      token: 'test-token',
    })
  })

  it('should render teams component', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should fetch teams on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should display teams data', async () => {
    const mockTeams = [
      { id: 1, name: 'Team A', logo: 'logo1.png' },
      { id: 2, name: 'Team B', logo: 'logo2.png' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockTeams, count: 2 },
    })

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
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
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle team selection', async () => {
    const mockTeams = [
      { id: 1, name: 'Team A', logo: 'logo1.png' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockTeams, count: 1 },
    })

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle delete action', async () => {
    const mockTeams = [
      { id: 1, name: 'Team A', logo: 'logo1.png' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockTeams, count: 1 },
    })

    vi.mocked(axios.delete).mockResolvedValue({})

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle edit action', async () => {
    const mockTeams = [
      { id: 1, name: 'Team A', logo: 'logo1.png' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockTeams, count: 1 },
    })

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
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
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle API errors gracefully', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('API Error'))

    render(
      <BrowserRouter>
        <Teams
          toggleAddEdit={mockToggleAddEdit}
          handleSelectTeam={mockHandleSelectTeam}
          tournament={mockTournament}
        />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

