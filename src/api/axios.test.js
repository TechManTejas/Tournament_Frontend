import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock storage before importing axios
vi.mock('../utils/storage', () => ({
  getUserDataFromStorage: vi.fn(),
}))

// Mock import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_BASE_URL: 'http://test-api.com',
      },
    },
  },
  writable: true,
})

describe('axios instance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create axios instance', async () => {
    const { getUserDataFromStorage } = await import('../utils/storage')
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      token: 'test-token',
      user: { id: 1 },
    })

    // Import the instance after mocking
    const axiosModule = await import('./axios.js')
    const instance = axiosModule.default

    expect(instance).toBeTruthy()
    expect(instance.defaults).toBeTruthy()
  })

  it('should have request interceptor', async () => {
    const { getUserDataFromStorage } = await import('../utils/storage')
    vi.mocked(getUserDataFromStorage).mockReturnValue({
      token: 'test-token',
      user: { id: 1 },
    })

    const axiosModule = await import('./axios.js')
    const instance = axiosModule.default

    expect(instance.interceptors.request).toBeTruthy()
  })

  it('should have response interceptor', async () => {
    const { getUserDataFromStorage } = await import('../utils/storage')
    vi.mocked(getUserDataFromStorage).mockReturnValue(null)

    const axiosModule = await import('./axios.js')
    const instance = axiosModule.default

    expect(instance.interceptors.response).toBeTruthy()
  })
})

