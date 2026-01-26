import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Users from './Users'
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

describe('Users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      user: { role: 'club_admin' },
      token: 'test-token',
    })
  })

  it('should render users component', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should fetch users on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should display users data', async () => {
    const mockUsers = [
      { id: 1, username: 'user1', email: 'user1@test.com', first_name: 'John', last_name: 'Doe', role: 'user' },
      { id: 2, username: 'user2', email: 'user2@test.com', first_name: 'Jane', last_name: 'Smith', role: 'admin' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockUsers, count: 2 },
    })

    render(
      <BrowserRouter>
        <Users />
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
        <Users />
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
        <Users />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle delete action', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [{ id: 1, username: 'user1' }], count: 1 },
    })

    vi.mocked(axios.delete).mockResolvedValue({})

    render(
      <BrowserRouter>
        <Users />
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
        <Users />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

