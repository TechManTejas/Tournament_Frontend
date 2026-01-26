import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import TimeCard from './TimeCard'

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

// Mock console.log
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('TimeCard', () => {
  const mockData = {
    name: 'John Doe',
    logo: 'player-logo.png',
    minute: 45,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockClear()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should render with player data', () => {
    render(<TimeCard data={mockData} x={100} y={200} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('45 MIN')).toBeInTheDocument()
  })

  it('should render with default values when data is not provided', () => {
    render(<TimeCard />)
    
    expect(screen.getByText('Player Name')).toBeInTheDocument()
    expect(screen.getByText('TIME MIN')).toBeInTheDocument()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<TimeCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border when isLive is false', () => {
    const { container } = render(<TimeCard data={mockData} isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<TimeCard data={mockData} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<TimeCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })

  it('should log data when provided', () => {
    render(<TimeCard data={mockData} />)
    expect(consoleSpy).toHaveBeenCalledWith(mockData)
  })

  it('should render player logo when data is provided', () => {
    const { container } = render(<TimeCard data={mockData} x={100} y={200} />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should render default logo when data is not provided', () => {
    const { container } = render(<TimeCard />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should handle different minute values', () => {
    const dataWithMinutes = { ...mockData, minute: 90 }
    render(<TimeCard data={dataWithMinutes} x={100} y={200} />)
    expect(screen.getByText('90 MIN')).toBeInTheDocument()
  })

  it('should handle zero minutes', () => {
    const dataWithZero = { ...mockData, minute: 0 }
    render(<TimeCard data={dataWithZero} x={100} y={200} />)
    expect(screen.getByText('0 MIN')).toBeInTheDocument()
  })

  it('should render with correct dimensions', () => {
    const { container } = render(<TimeCard data={mockData} />)
    const card = container.querySelector('.w-\\[580px\\]')
    expect(card).toBeInTheDocument()
  })

  it('should apply correct background image style', () => {
    const { container } = render(<TimeCard data={mockData} />)
    const card = container.querySelector('[style*="background-image"]')
    expect(card).toBeInTheDocument()
  })

  it('should handle drag events', () => {
    const mockOnDrag = vi.fn()
    const { container } = render(<TimeCard data={mockData} onDrag={mockOnDrag} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should handle missing logo in data', () => {
    const dataWithoutLogo = { name: 'Test Player', minute: 30 }
    render(<TimeCard data={dataWithoutLogo} x={100} y={200} />)
    expect(screen.getByText('Test Player')).toBeInTheDocument()
  })

  it('should maintain correct structure for both draggable and non-draggable modes', () => {
    const { container: container1 } = render(<TimeCard data={mockData} />)
    const { container: container2 } = render(<TimeCard data={mockData} x={0} y={0} />)
    
    expect(container1.querySelector('.absolute')).toBeInTheDocument()
    expect(container2.querySelector('[style*="left: 0px"]')).toBeInTheDocument()
  })

  it('should handle isLive being undefined', () => {
    const { container } = render(<TimeCard data={mockData} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render with proper container structure', () => {
    const { container } = render(<TimeCard data={mockData} />)
    const mainContainer = container.querySelector('.relative.px-4.flex.flex-col')
    expect(mainContainer).toBeInTheDocument()
  })
})

