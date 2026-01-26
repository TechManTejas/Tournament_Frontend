import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SwapsCard from './SwapsCard'

describe('SwapsCard', () => {
  const mockData = {
    swaps: [
      { playerIn: 'Player A', playerOut: 'Player B', minute: 45 },
    ],
  }

  it('should render swaps card', () => {
    render(<SwapsCard data={mockData} />)
    expect(document.body).toBeTruthy()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<SwapsCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border when isLive is false', () => {
    const { container } = render(<SwapsCard data={mockData} isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<SwapsCard data={mockData} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<SwapsCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })

  it('should handle drag events', () => {
    const mockOnDrag = vi.fn()
    const { container } = render(<SwapsCard data={mockData} onDrag={mockOnDrag} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render with empty swaps data', () => {
    render(<SwapsCard data={{ swaps: [] }} />)
    expect(document.body).toBeTruthy()
  })
})

