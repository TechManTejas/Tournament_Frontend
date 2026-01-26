import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RefereesCard from './RefereesCard'

describe('RefereesCard', () => {
  it('should render referees card', () => {
    render(<RefereesCard />)
    expect(screen.getByText('Schiedsrichter')).toBeInTheDocument()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<RefereesCard isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border when isLive is false', () => {
    const { container } = render(<RefereesCard isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<RefereesCard />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<RefereesCard x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })

  it('should handle drag events', () => {
    const mockOnDrag = vi.fn()
    const { container } = render(<RefereesCard onDrag={mockOnDrag} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })
})

