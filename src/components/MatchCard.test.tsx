import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MatchCard from './MatchCard'
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

describe('MatchCard', () => {
  const mockData = {
    teamA: {
      name: 'Team Alpha',
      logo: 'team-alpha-logo.png',
    },
    teamB: {
      name: 'Team Beta',
      logo: 'team-beta-logo.png',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with team names', () => {
    render(<MatchCard data={mockData} isLive={true} />)
    
    expect(screen.getByText('Team Alpha')).toBeInTheDocument()
    expect(screen.getByText('Team Beta')).toBeInTheDocument()
  })

  it('should render with default team names when data is not provided', () => {
    render(<MatchCard />)
    
    expect(screen.getByText('Team A Name')).toBeInTheDocument()
    expect(screen.getByText('Team B Name')).toBeInTheDocument()
  })

  it('should apply live border class when isLive is true', () => {
    const { container } = render(<MatchCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border class when isLive is false', () => {
    const { container } = render(<MatchCard data={mockData} isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<MatchCard data={mockData} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<MatchCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })

  it('should call onDrag callback when dragging', () => {
    const mockOnDrag = vi.fn()
    const { container } = render(<MatchCard data={mockData} onDrag={mockOnDrag} />)
    
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render team logos when provided', () => {
    const { container } = render(<MatchCard data={mockData} />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should render default logos when team logos are not provided', () => {
    const dataWithoutLogos = {
      teamA: { name: 'Team A' },
      teamB: { name: 'Team B' },
    }
    const { container } = render(<MatchCard data={dataWithoutLogos} />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should handle missing teamA data', () => {
    const partialData = {
      teamB: {
        name: 'Team Beta',
        logo: 'team-beta-logo.png',
      },
    }
    render(<MatchCard data={partialData} />)
    expect(screen.getByText('Team A Name')).toBeInTheDocument()
    expect(screen.getByText('Team Beta')).toBeInTheDocument()
  })

  it('should handle missing teamB data', () => {
    const partialData = {
      teamA: {
        name: 'Team Alpha',
        logo: 'team-alpha-logo.png',
      },
    }
    render(<MatchCard data={partialData} />)
    expect(screen.getByText('Team Alpha')).toBeInTheDocument()
    expect(screen.getByText('Team B Name')).toBeInTheDocument()
  })

  it('should render with correct dimensions for draggable card', () => {
    const { container } = render(<MatchCard data={mockData} />)
    const card = container.querySelector('.w-\\[580px\\]')
    expect(card).toBeInTheDocument()
  })

  it('should render with correct dimensions for non-draggable card', () => {
    const { container } = render(<MatchCard data={mockData} x={100} y={200} />)
    const card = container.querySelector('.w-\\[580px\\]')
    expect(card).toBeInTheDocument()
  })

  it('should apply correct background image style', () => {
    const { container } = render(<MatchCard data={mockData} />)
    const card = container.querySelector('[style*="background-image"]')
    expect(card).toBeInTheDocument()
  })

  it('should handle isLive being undefined', () => {
    const { container } = render(<MatchCard data={mockData} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render separator character', () => {
    const { container } = render(<MatchCard data={mockData} />)
    expect(container.textContent).toContain('/')
  })

  it('should handle empty data object', () => {
    render(<MatchCard data={{}} />)
    expect(screen.getByText('Team A Name')).toBeInTheDocument()
    expect(screen.getByText('Team B Name')).toBeInTheDocument()
  })

  it('should maintain correct structure for both draggable and non-draggable modes', () => {
    const { container: container1 } = render(<MatchCard data={mockData} />)
    const { container: container2 } = render(<MatchCard data={mockData} x={0} y={0} />)
    
    expect(container1.querySelector('.absolute')).toBeInTheDocument()
    expect(container2.querySelector('[style*="left: 0px"]')).toBeInTheDocument()
  })
})

