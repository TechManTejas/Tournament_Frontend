import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TimeCard from './TimeCard'

describe('TimeCard', () => {
  const mockData = {
    name: 'John Doe',
    logo: 'player-logo.png',
    minute: 45,
  }

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
})

