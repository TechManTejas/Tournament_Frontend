import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardsCard from './CardsCard'

describe('CardsCard', () => {
  const mockData = {
    name: 'Player Name',
    logo: 'player-logo.png',
    card_type: '#FFD700',
  }

  it('should render with card data', () => {
    render(<CardsCard data={mockData} x={100} y={200} />)
    
    expect(screen.getByText('Player Name')).toBeInTheDocument()
  })

  it('should render with default values when data is not provided', () => {
    render(<CardsCard />)
    
    expect(screen.getByText('Player Name')).toBeInTheDocument()
  })

  it('should apply live border when isLive is true', () => {
    const { container } = render(<CardsCard data={mockData} isLive={true} />)
    const card = container.querySelector('.border-green-500')
    expect(card).toBeInTheDocument()
  })

  it('should apply non-live border when isLive is false', () => {
    const { container } = render(<CardsCard data={mockData} isLive={false} />)
    const card = container.querySelector('.border-red-500')
    expect(card).toBeInTheDocument()
  })

  it('should render as draggable when x and y are undefined', () => {
    const { container } = render(<CardsCard data={mockData} />)
    const draggable = container.querySelector('.absolute')
    expect(draggable).toBeInTheDocument()
  })

  it('should render as non-draggable when x and y are provided', () => {
    const { container } = render(<CardsCard data={mockData} x={100} y={200} />)
    const nonDraggable = container.querySelector('[style*="left: 100px"]')
    expect(nonDraggable).toBeInTheDocument()
  })
})

