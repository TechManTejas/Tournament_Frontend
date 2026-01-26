import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreCard from './ScoreCard'

describe('ScoreCard', () => {
  const mockData = {
    teamA: {
      name: 'Team Alpha',
      shortName: 'TA',
      logo: 'team-alpha-logo.png',
      score: 2,
      color: '#0000FF',
    },
    teamB: {
      name: 'Team Beta',
      shortName: 'TB',
      logo: 'team-beta-logo.png',
      score: 1,
      color: '#FF0000',
    },
  }

  it('should render score card with team data', () => {
    render(<ScoreCard data={mockData} time={3600} />)
    
    expect(screen.getByText('TA')).toBeInTheDocument()
    expect(screen.getByText('TB')).toBeInTheDocument()
  })

  it('should render with default values when data is not provided', () => {
    render(<ScoreCard />)
    
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<ScoreCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should format time correctly', () => {
    // Provide x and y to make it non-draggable so formatTime is used
    render(<ScoreCard data={mockData} time={3661} x={100} y={200} />)
    // 3661 seconds = 61 minutes 1 second = 61 : 01
    expect(screen.getByText(/61 : 01/)).toBeInTheDocument()
  })
})

