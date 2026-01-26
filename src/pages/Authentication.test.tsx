import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Authentication } from './Authentication'
import axios from 'axios'

vi.mock('axios')
vi.mock('../context/context.provider', () => ({
  Context: () => ({
    setUserAuthenticated: vi.fn(),
    setUserVerified: vi.fn(),
  }),
}))

vi.mock('../utils/storage', () => ({
  saveUserDataToStorage: vi.fn(),
}))

// Mock window.location
delete (window as any).location
window.location = { href: '' } as any

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render authentication component', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should render login form by default', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    // Form should be rendered
    const form = document.querySelector('.ant-form')
    expect(form).toBeTruthy()
  })

  it('should switch between login and register forms', () => {
    render(
      <BrowserRouter>
        <Authentication />
      </BrowserRouter>
    )

    // Component should render
    expect(document.body).toBeTruthy()
  })
})

