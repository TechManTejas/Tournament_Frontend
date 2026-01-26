import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RefereesCard from './RefereesCard'
import { DraggableData, DraggableEvent } from 'react-draggable'

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1080,
})

describe('RefereesCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it('should render referee names', () => {
    render(<RefereesCard />)
    expect(screen.getByText('Steffen Winkler')).toBeInTheDocument()
    expect(screen.getByText('Peter Wunderlich')).toBeInTheDocument()
    expect(screen.getByText('Jan Benzing')).toBeInTheDocument()
  })

  it('should render sponsor information', () => {
    render(<RefereesCard />)
    expect(screen.getByText('Powered by')).toBeInTheDocument()
    expect(screen.getByText('Mitutoyo')).toBeInTheDocument()
  })

  it('should render referee images', () => {
    const { container } = render(<RefereesCard />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should render with correct dimensions for draggable card', () => {
    const { container } = render(<RefereesCard />)
    const card = container.querySelector('.w-\\[460px\\]')
    expect(card).toBeInTheDocument()
  })

  it('should render with correct dimensions for non-draggable card', () => {
    const { container } = render(<RefereesCard x={100} y={200} />)
    const card = container.querySelector('.w-\\[460px\\]')
    expect(card).toBeInTheDocument()
  })

  it('should apply correct background image style', () => {
    const { container } = render(<RefereesCard />)
    const card = container.querySelector('[style*="background-image"]')
    expect(card).toBeInTheDocument()
  })

  it('should handle isLive being undefined', () => {
    const { container } = render(<RefereesCard />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render with proper container structure', () => {
    const { container } = render(<RefereesCard />)
    const mainContainer = container.querySelector('.relative.px-4.flex.flex-col')
    expect(mainContainer).toBeInTheDocument()
  })

  it('should render all referee entries', () => {
    render(<RefereesCard />)
    // Check that all referee names appear (some may appear multiple times)
    const refereeNames = ['Steffen Winkler', 'Peter Wunderlich', 'Jan Benzing']
    refereeNames.forEach(name => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    })
  })

  it('should handle data prop when provided', () => {
    const mockData = {
      referees: [
        { name: 'Test Referee', role: 'head' },
      ],
    }
    render(<RefereesCard data={mockData} />)
    // Component should still render even with custom data
    expect(screen.getByText('Schiedsrichter')).toBeInTheDocument()
  })

  it('should maintain correct structure for both draggable and non-draggable modes', () => {
    const { container: container1 } = render(<RefereesCard />)
    const { container: container2 } = render(<RefereesCard x={0} y={0} />)
    
    expect(container1.querySelector('.absolute')).toBeInTheDocument()
    expect(container2.querySelector('[style*="left: 0px"]')).toBeInTheDocument()
  })

  it('should render with correct text styling', () => {
    render(<RefereesCard />)
    const title = screen.getByText('Schiedsrichter')
    expect(title).toHaveClass('text-2xl')
  })

  it('should handle multiple re-renders correctly', () => {
    const { rerender } = render(<RefereesCard />)
    expect(screen.getByText('Schiedsrichter')).toBeInTheDocument()
    
    rerender(<RefereesCard isLive={true} />)
    expect(screen.getByText('Schiedsrichter')).toBeInTheDocument()
  })
})

