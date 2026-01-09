import TunnelConstant from './Tunnel.constant'
import TunnelUtils from './Tunnel.utils'

// Import cloudflared-tunnel with default import
const { tunnel } = require('cloudflared-tunnel')
import { ITunnelStartResponse, ITunnelStatus, ICloudflaredTunnel } from './Tunnel.type'

class TunnelService {
  private activeTunnel: ICloudflaredTunnel | null = null
  private tunnelUrl: string | null = null
  private tunnelPort: number | null = null
  private startedAt: Date | null = null

  /**
   * Start a cloudflared tunnel
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
      const tunnelInstance = await tunnel({
        '--url': `http://localhost:${port}`,
      })

      // Store tunnel instance
      this.activeTunnel = tunnelInstance
      this.tunnelUrl = TunnelUtils.formatTunnelUrl(tunnelInstance.url)
      this.tunnelPort = port
      this.startedAt = new Date()

      return {
        url: this.tunnelUrl,
        port: port,
        status: 'active',
      }
    } catch (error: any) {
      this.activeTunnel = null
      this.tunnelUrl = null
      this.tunnelPort = null
      this.startedAt = null

      // Check if error is due to cloudflared not being installed
      if (error.message?.includes('spawn') || error.message?.includes('ENOENT')) {
        throw new Error(TunnelConstant.CLOUDFLARED_NOT_INSTALLED)
      }

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
      await this.activeTunnel.stop()

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

export default new TunnelService()
