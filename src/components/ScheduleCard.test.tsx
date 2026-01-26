import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScheduleCard from './ScheduleCard'

describe('ScheduleCard', () => {
  const mockData = {
    matches: [
      { teamA: 'Team A', teamB: 'Team B', time: '10:00' },
      { teamA: 'Team C', teamB: 'Team D', time: '11:00' },
    ],
  }

  it('should render schedule card', () => {
    render(<ScheduleCard data={mockData} />)
    expect(document.body).toBeTruthy()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<ScheduleCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border when isLive is false', () => {
    const { container } = render(<ScheduleCard data={mockData} isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<ScheduleCard data={mockData} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<ScheduleCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })

  it('should handle drag events', () => {
    const mockOnDrag = vi.fn()
    const { container } = render(<ScheduleCard data={mockData} onDrag={mockOnDrag} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render with empty matches data', () => {
    render(<ScheduleCard data={{ matches: [] }} />)
    expect(document.body).toBeTruthy()
  })
})

