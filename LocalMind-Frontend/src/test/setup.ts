import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock the image asset
vi.mock('../../assets/robot-signup.png', () => ({
  default: 'test-image-stub',
}))

// Also mock it as an absolute path helper if needed,
// strictly creating a catch-all for pngs is safer:
// vi.mock('*.png', () => ({ default: 'test-image-stub' }))
