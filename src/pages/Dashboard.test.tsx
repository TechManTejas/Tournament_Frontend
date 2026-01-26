import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Dashboard } from './Dashboard'

vi.mock('../context/context.provider', () => ({
  Context: () => ({
    userAuthenticated: true,
    userVerified: true,
  }),
}))

describe('Dashboard', () => {
  it('should render dashboard component', () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    expect(container).toBeTruthy()
  })

  it('should render routes', () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    expect(container.querySelector('div')).toBeTruthy()
  })
})

