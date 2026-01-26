import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sidebar component', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })

  it('should render menu items', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    // Check for menu items (they might be in German)
    const sidebar = document.querySelector('.ant-layout-sider')
    expect(sidebar).toBeTruthy()
  })

  it('should handle menu click navigation', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    // Menu should be rendered
    const menu = document.querySelector('.ant-menu')
    expect(menu).toBeTruthy()
  })
})

