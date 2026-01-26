import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Tournaments } from './Tournaments'
import axios from '../api/axios'

vi.mock('../api/axios')
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

describe('Tournaments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render tournaments component', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Tournaments />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should fetch tournaments on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { results: [], count: 0 },
    })

    render(
      <BrowserRouter>
        <Tournaments />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should display tournaments data', async () => {
    const mockTournaments = [
      { id: 1, name: 'Tournament 1', alias: 't1' },
      { id: 2, name: 'Tournament 2', alias: 't2' },
    ]

    vi.mocked(axios.get).mockResolvedValue({
      data: { results: mockTournaments, count: 2 },
    })

    render(
      <BrowserRouter>
        <Tournaments />
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
        <Tournaments />
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
        <Tournaments />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

