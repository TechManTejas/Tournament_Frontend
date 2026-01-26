import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GoalScorerCard from './GoalScorerCard'

describe('GoalScorerCard', () => {
  const mockData = {
    teamA: {
      name: 'Team A',
      logo: 'team-a-logo.png',
      score: 2,
      goals: [
        { player: 'Player 1', minute: 15 },
        { player: 'Player 2', minute: 30 },
      ],
    },
    teamB: {
      name: 'Team B',
      logo: 'team-b-logo.png',
      score: 1,
      goals: [
        { player: 'Player 3', minute: 45 },
      ],
    },
  }

  it('should render goal scorer card with data', () => {
    render(<GoalScorerCard data={mockData} x={100} y={200} />)
    expect(screen.getByText('Team A')).toBeInTheDocument()
    expect(screen.getByText('Team B')).toBeInTheDocument()
  })

  it('should render with default values when data is not provided', () => {
    render(<GoalScorerCard />)
    expect(screen.getByText('Team A')).toBeInTheDocument()
    expect(screen.getByText('Team B')).toBeInTheDocument()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<GoalScorerCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border when isLive is false', () => {
    const { container } = render(<GoalScorerCard data={mockData} isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<GoalScorerCard data={mockData} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<GoalScorerCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })

  it('should display goal information', () => {
    render(<GoalScorerCard data={mockData} x={100} y={200} />)
    expect(screen.getByText('Team A')).toBeInTheDocument()
    expect(screen.getByText('Team B')).toBeInTheDocument()
  })
})

