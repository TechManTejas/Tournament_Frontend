import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResizablePanel from './ResizablePanel'

// Mock react-resizeable
vi.mock('react-resizeable', () => ({
  Resizeable: ({ children, width, height, onResize }: any) => (
    <div
      data-testid="resizable"
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={() => onResize(null, { size: { width: width + 10, height: height + 10 } })}
    >
      {children}
    </div>
  ),
}))

describe('ResizablePanel', () => {
  it('should render children', () => {
    render(
      <ResizablePanel initialWidth={200} initialHeight={150}>
        <div>Test Content</div>
      </ResizablePanel>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should initialize with provided dimensions', () => {
    const { container } = render(
      <ResizablePanel initialWidth={300} initialHeight={200}>
        <div>Content</div>
      </ResizablePanel>
    )

    const panel = container.querySelector('[style*="width: 300px"]')
    expect(panel).toBeInTheDocument()
  })

  it('should handle resize events', () => {
    const { container } = render(
      <ResizablePanel initialWidth={200} initialHeight={150}>
        <div>Content</div>
      </ResizablePanel>
    )

    const resizable = screen.getByTestId('resizable')
    expect(resizable).toBeInTheDocument()
  })

  it('should update dimensions on resize', () => {
    const { container, rerender } = render(
      <ResizablePanel initialWidth={200} initialHeight={150}>
        <div>Content</div>
      </ResizablePanel>
    )

    expect(container.querySelector('[style*="width: 200px"]')).toBeInTheDocument()
  })
})

