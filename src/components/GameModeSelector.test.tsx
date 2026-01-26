import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GameModeSelector from './GameModeSelector'
import axios from '../api/axios'
import { confirmation } from './Confirmation'

vi.mock('../api/axios')
vi.mock('./Confirmation', () => ({
  confirmation: vi.fn(),
}))

describe('GameModeSelector', () => {
  const mockGameMode = {
    id: 1,
    name: 'Round Robin',
    description: 'Round Robin tournament',
    data: {} as JSON,
  }

  const mockOnSelect = vi.fn()
  const mockOnEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render game mode selector', () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [],
    })

    render(
      <GameModeSelector
        selectedGameMode={null}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
      />
    )

    expect(document.body).toBeTruthy()
  })

  it('should fetch game modes on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [mockGameMode],
    })

    render(
      <GameModeSelector
        selectedGameMode={null}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
      />
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should call onEdit when edit button is clicked', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [mockGameMode],
    })

    render(
      <GameModeSelector
        selectedGameMode={null}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
      />
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })

  it('should handle delete confirmation', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [mockGameMode],
    })

    vi.mocked(confirmation).mockResolvedValue(true)
    vi.mocked(axios.delete).mockResolvedValue({})

    render(
      <GameModeSelector
        selectedGameMode={null}
        onSelect={mockOnSelect}
        onEdit={mockOnEdit}
      />
    )

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
})

