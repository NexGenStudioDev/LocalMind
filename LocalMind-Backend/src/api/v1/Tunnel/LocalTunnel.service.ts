import localtunnel from 'localtunnel'
import TunnelConstant from './Tunnel.constant'
import TunnelUtils from './Tunnel.utils'
import { ITunnelStartResponse, ITunnelStatus } from './Tunnel.type'

interface LocalTunnelInstance {
  url: string
  close: () => void
}

class LocalTunnelService {
  private activeTunnel: LocalTunnelInstance | null = null
  private tunnelUrl: string | null = null
  private tunnelPort: number | null = null
  private startedAt: Date | null = null

  /**
   * Start a localtunnel
   */
  async startTunnel(port: number, subdomain?: string): Promise<ITunnelStartResponse> {
    // Check if tunnel is already running
    if (this.activeTunnel) {
      throw new Error(TunnelConstant.TUNNEL_ALREADY_RUNNING)
    }

    // Validate port
    const validation = TunnelUtils.validateTunnelConfig(port, subdomain)
    if (!validation.valid) {
      throw new Error(validation.error || TunnelConstant.INVALID_PORT)
    }

    try {
      // Start the tunnel
      const tunnel = await localtunnel({
        port,
        subdomain,
      })

      // Store tunnel instance
      this.activeTunnel = tunnel
      this.tunnelUrl = tunnel.url || ''
      this.tunnelPort = port
      this.startedAt = new Date()

      return {
        url: tunnel.url,
        port: port,
        status: 'active',
      }
    } catch (error: any) {
      this.activeTunnel = null
      this.tunnelUrl = null
      this.tunnelPort = null
      this.startedAt = null

      throw new Error(`${TunnelConstant.TUNNEL_START_FAILED}: ${error.message}`)
    }
  }

  /**
   * Stop the active tunnel
   */
  async stopTunnel(): Promise<{ message: string; previousUrl?: string }> {
    if (!this.activeTunnel) {
      throw new Error(TunnelConstant.TUNNEL_NOT_RUNNING)
    }

    const previousUrl = this.tunnelUrl

    try {
      this.activeTunnel.close()

      this.activeTunnel = null
      this.tunnelUrl = null
      this.tunnelPort = null
      this.startedAt = null

      return {
        message: TunnelConstant.TUNNEL_STOPPED,
        ...(previousUrl && { previousUrl }),
      }
    } catch (error: any) {
      throw new Error(`${TunnelConstant.TUNNEL_STOP_FAILED}: ${error.message}`)
    }
  }

  /**
   * Get tunnel status
   */
  getTunnelStatus(): ITunnelStatus {
    if (!this.activeTunnel) {
      return {
        active: false,
      }
    }

    const status: ITunnelStatus = {
      active: true,
    }

    if (this.tunnelUrl) status.url = this.tunnelUrl
    if (this.tunnelPort) status.port = this.tunnelPort
    if (this.startedAt) status.startedAt = this.startedAt

    return status
  }

  /**
   * Check if tunnel is active
   */
  isTunnelActive(): boolean {
    return this.activeTunnel !== null
  }
}

export default new LocalTunnelService()
