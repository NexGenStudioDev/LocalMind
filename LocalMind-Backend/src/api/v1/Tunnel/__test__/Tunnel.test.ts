import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import TunnelService from '../Tunnel.service'
import TunnelConstant from '../Tunnel.constant'

// Mock the cloudflared-tunnel module
jest.mock('cloudflared-tunnel', () => ({
  tunnel: jest.fn(),
}))

const { tunnel } = require('cloudflared-tunnel')

const mockedTunnel = tunnel as any

describe('Tunnel Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    // Clean up any active tunnels
    if (TunnelService.isTunnelActive()) {
      try {
        await TunnelService.stopTunnel()
      } catch {
        // Ignore errors during cleanup
      }
    }
  })

  describe('startTunnel', () => {
    it('should successfully start a tunnel with valid port', async () => {
      const mockTunnelInstance: any = {
        url: 'https://test-tunnel.trycloudflare.com',
        connections: [],
        stop: jest.fn(() => Promise.resolve()),
      }

      mockedTunnel.mockResolvedValue(mockTunnelInstance)

      const result = await TunnelService.startTunnel(5000)

      expect(result).toBeDefined()
      expect(result.url).toBe('https://test-tunnel.trycloudflare.com')
      expect(result.port).toBe(5000)
      expect(result.status).toBe('active')
      expect(mockedTunnel).toHaveBeenCalledWith({
        '--url': 'http://localhost:5000',
      })
    })

    it('should reject port numbers below minimum', async () => {
      await expect(TunnelService.startTunnel(1000)).rejects.toThrow()
    })

    it('should reject port numbers above maximum', async () => {
      await expect(TunnelService.startTunnel(70000)).rejects.toThrow()
    })

    it('should reject non-integer port numbers', async () => {
      await expect(TunnelService.startTunnel(5000.5)).rejects.toThrow()
    })

    it('should throw error if tunnel is already running', async () => {
      const mockTunnelInstance: any = {
        url: 'https://test-tunnel.trycloudflare.com',
        connections: [],
        stop: jest.fn(() => Promise.resolve()),
      }

      mockedTunnel.mockResolvedValue(mockTunnelInstance)

      await TunnelService.startTunnel(5000)

      await expect(TunnelService.startTunnel(5001)).rejects.toThrow(
        TunnelConstant.TUNNEL_ALREADY_RUNNING
      )
    })

    it('should handle cloudflared not installed error', async () => {
      const error = new Error('spawn cloudflared ENOENT')
      mockedTunnel.mockRejectedValue(error)

      await expect(TunnelService.startTunnel(5000)).rejects.toThrow(
        TunnelConstant.CLOUDFLARED_NOT_INSTALLED
      )
    })

    it('should handle generic tunnel start errors', async () => {
      const error = new Error('Connection failed')
      mockedTunnel.mockRejectedValue(error)

      await expect(TunnelService.startTunnel(5000)).rejects.toThrow(
        TunnelConstant.TUNNEL_START_FAILED
      )
    })
  })

  describe('stopTunnel', () => {
    it('should successfully stop an active tunnel', async () => {
      const mockTunnelInstance: any = {
        url: 'https://test-tunnel.trycloudflare.com',
        connections: [],
        stop: jest.fn(() => Promise.resolve()),
      }

      mockedTunnel.mockResolvedValue(mockTunnelInstance)

      await TunnelService.startTunnel(5000)
      const result = await TunnelService.stopTunnel()

      expect(result).toBeDefined()
      expect(result.message).toBe(TunnelConstant.TUNNEL_STOPPED)
      expect(result.previousUrl).toBe('https://test-tunnel.trycloudflare.com')
      expect(mockTunnelInstance.stop).toHaveBeenCalled()
    })

    it('should throw error if no tunnel is running', async () => {
      await expect(TunnelService.stopTunnel()).rejects.toThrow(TunnelConstant.TUNNEL_NOT_RUNNING)
    })

    it('should handle errors during tunnel stop', async () => {
      const stopError = new Error('Stop failed')
      const mockTunnelInstance: any = {
        url: 'https://test-tunnel.trycloudflare.com',
        connections: [],
        stop: jest.fn(() => Promise.reject(stopError)),
      }

      mockedTunnel.mockResolvedValue(mockTunnelInstance)

      await TunnelService.startTunnel(5000)

      await expect(TunnelService.stopTunnel()).rejects.toThrow(TunnelConstant.TUNNEL_STOP_FAILED)
    })
  })

  describe('getTunnelStatus', () => {
    it('should return inactive status when no tunnel is running', () => {
      const status = TunnelService.getTunnelStatus()

      expect(status).toBeDefined()
      expect(status.active).toBe(false)
      expect(status.url).toBeUndefined()
      expect(status.port).toBeUndefined()
    })

    it('should return active status with details when tunnel is running', async () => {
      const mockTunnelInstance: any = {
        url: 'https://test-tunnel.trycloudflare.com',
        connections: [],
        stop: jest.fn(() => Promise.resolve()),
      }

      mockedTunnel.mockResolvedValue(mockTunnelInstance)

      await TunnelService.startTunnel(5000)
      const status = TunnelService.getTunnelStatus()

      expect(status).toBeDefined()
      expect(status.active).toBe(true)
      expect(status.url).toBe('https://test-tunnel.trycloudflare.com')
      expect(status.port).toBe(5000)
      expect(status.startedAt).toBeDefined()
    })
  })

  describe('isTunnelActive', () => {
    it('should return false when no tunnel is running', () => {
      expect(TunnelService.isTunnelActive()).toBe(false)
    })

    it('should return true when tunnel is running', async () => {
      const mockTunnelInstance: any = {
        url: 'https://test-tunnel.trycloudflare.com',
        connections: [],
        stop: jest.fn(() => Promise.resolve()),
      }

      mockedTunnel.mockResolvedValue(mockTunnelInstance)

      await TunnelService.startTunnel(5000)

      expect(TunnelService.isTunnelActive()).toBe(true)
    })
  })
})
