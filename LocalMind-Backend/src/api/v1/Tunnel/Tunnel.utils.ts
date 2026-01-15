import TunnelConstant from './Tunnel.constant'

export default class TunnelUtils {
  /**
   * Validates if a port number is valid
   */
  static isValidPort(port: number): boolean {
    return (
      Number.isInteger(port) &&
      port >= TunnelConstant.MIN_PORT &&
      port <= TunnelConstant.MAX_PORT
    )
  }

  /**
   * Formats tunnel URL for display
   */
  static formatTunnelUrl(url: string): string {
    // Ensure URL has https protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`
    }
    return url
  }

  static extractSubdomain(url: string): string | null {
    try {
      const urlObj = new URL(url)
      const parts = urlObj.hostname.split('.')
      if (parts.length > 2) {
        return parts[0] ?? null
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Validates tunnel configuration
   */
  static validateTunnelConfig(port: number, subdomain?: string): { valid: boolean; error?: string } {
    if (!this.isValidPort(port)) {
      return {
        valid: false,
        error: `${TunnelConstant.INVALID_PORT}. Port must be between ${TunnelConstant.MIN_PORT} and ${TunnelConstant.MAX_PORT}`,
      }
    }

    if (subdomain && subdomain.length > 63) {
      return {
        valid: false,
        error: 'Subdomain must be less than 63 characters',
      }
    }

    if (subdomain && !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(subdomain)) {
      return {
        valid: false,
        error: 'Subdomain must contain only alphanumeric characters and hyphens',
      }
    }

    return { valid: true }
  }
}
