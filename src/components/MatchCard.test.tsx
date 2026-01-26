import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MatchCard from './MatchCard'

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
    // Check for draggable component (react-draggable adds specific classes)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<MatchCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })
})

