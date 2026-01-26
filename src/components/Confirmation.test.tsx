import { describe, it, expect, vi, beforeEach } from 'vitest'
import { confirmation } from './Confirmation'
import { Modal } from 'antd'

vi.mock('antd', () => ({
  Modal: {
    confirm: vi.fn(),
  },
}))

describe('Confirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create confirmation modal', () => {
    const mockDestroy = vi.fn()
    const mockModal = {
      destroy: mockDestroy,
    }

    vi.mocked(Modal.confirm).mockReturnValue(mockModal as any)

    const promise = confirmation('Test message')

    expect(Modal.confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Confirmation',
        content: 'Test message',
        okText: 'Yes',
        cancelText: 'Cancel',
      })
    )

    expect(promise).toBeInstanceOf(Promise)
  })

  it('should resolve true when confirmed', async () => {
    let confirmHandler: () => void
    const mockDestroy = vi.fn()
    const mockModal = {
      destroy: mockDestroy,
    }

    vi.mocked(Modal.confirm).mockImplementation((config: any) => {
      confirmHandler = config.onOk
      return mockModal as any
    })

    const promise = confirmation('Test')

    // Simulate confirm
    confirmHandler!()

    const result = await promise
    expect(result).toBe(true)
    expect(mockDestroy).toHaveBeenCalled()
  })

  it('should resolve false when cancelled', async () => {
    let cancelHandler: () => void
    const mockDestroy = vi.fn()
    const mockModal = {
      destroy: mockDestroy,
    }

    vi.mocked(Modal.confirm).mockImplementation((config: any) => {
      cancelHandler = config.onCancel
      return mockModal as any
    })

    const promise = confirmation('Test')

    // Simulate cancel
    cancelHandler!()

    const result = await promise
    expect(result).toBe(false)
    expect(mockDestroy).toHaveBeenCalled()
  })
})

