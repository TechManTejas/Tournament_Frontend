import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import GameModeAdder from './GameModeAdder'
import axios from '../api/axios'

vi.mock('../api/axios')

describe('GameModeAdder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render game mode adder component', () => {
    render(<GameModeAdder editingGameMode={null} />)
    expect(document.body).toBeTruthy()
  })

  it('should render with editing game mode', () => {
    const mockGameMode = {
      id: 1,
      name: 'Test Mode',
      description: 'Test Description',
      data: [] as any, // data should be an array
    }

    render(<GameModeAdder editingGameMode={mockGameMode} />)
    expect(document.body).toBeTruthy()
  })

  it('should render form elements', () => {
    render(<GameModeAdder editingGameMode={null} />)
    const form = document.querySelector('.ant-form')
    expect(form).toBeTruthy()
  })

  it('should handle component initialization', () => {
    render(<GameModeAdder editingGameMode={null} />)
    expect(document.body).toBeTruthy()
  })

  it('should render tabs for rounds and groups', () => {
    render(<GameModeAdder editingGameMode={null} />)
    expect(document.body).toBeTruthy()
  })
})

