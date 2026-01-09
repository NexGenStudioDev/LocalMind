import ngrok from 'ngrok'
import TunnelConstant from './Tunnel.constant'
import TunnelUtils from './Tunnel.utils'
import { ITunnelStartResponse, ITunnelStatus } from './Tunnel.type'

interface NgrokConfig {
  authtoken?: string
  port: number
  domain?: string
}

class NgrokService {
  private tunnelUrl: string | null = null
  private tunnelPort: number | null = null
  private startedAt: Date | null = null
  private isActive: boolean = false

  /**
   * Start an ngrok tunnel
   */
  async startTunnel(port: number, authToken?: string, domain?: string): Promise<ITunnelStartResponse> {
    // Check if tunnel is already running
    if (this.isActive) {
      throw new Error(TunnelConstant.TUNNEL_ALREADY_RUNNING)
    }

    // Validate port
    const validation = TunnelUtils.validateTunnelConfig(port)
    if (!validation.valid) {
      throw new Error(validation.error || TunnelConstant.INVALID_PORT)
    }

    try {
      // Configure ngrok options
      const options: any = {
        addr: port,
      }

      if (authToken) {
        options.authtoken = authToken
      }

      if (domain) {
        options.hostname = domain
      }

      // Start the tunnel
      const url = await ngrok.connect(options)

      // Store tunnel info
      this.tunnelUrl = url
      this.tunnelPort = port
      this.startedAt = new Date()
      this.isActive = true

      return {
        url: this.tunnelUrl,
        port: port,
        status: 'active',
      }
    } catch (error: any) {
      this.tunnelUrl = null
      this.tunnelPort = null
      this.startedAt = null
      this.isActive = false

      // Check for common ngrok errors
      if (error.message?.includes('authtoken')) {
        throw new Error('Invalid or missing ngrok authtoken')
      }

      throw new Error(`${TunnelConstant.TUNNEL_START_FAILED}: ${error.message}`)
    }
  }

  /**
   * Stop the active tunnel
   */
  async stopTunnel(): Promise<{ message: string; previousUrl?: string }> {
    if (!this.isActive) {
      throw new Error(TunnelConstant.TUNNEL_NOT_RUNNING)
    }

    const previousUrl = this.tunnelUrl

    try {
      await ngrok.disconnect()
      await ngrok.kill()

      this.tunnelUrl = null
      this.tunnelPort = null
      this.startedAt = null
      this.isActive = false

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
    if (!this.isActive) {
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
    return this.isActive
  }
}

export default new NgrokService()
