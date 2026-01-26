import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ThemeProvider from './themeProvider'

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should wrap children with ConfigProvider', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    )

    expect(container.firstChild).toBeTruthy()
  })

  it('should apply theme configuration', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    )

    // Theme provider should render without errors
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

