export default class TunnelConstant {
  // Success Messages
  static readonly TUNNEL_STARTED = 'Cloudflared tunnel started successfully'
  static readonly TUNNEL_STOPPED = 'Cloudflared tunnel stopped successfully'
  static readonly TUNNEL_STATUS_RETRIEVED = 'Tunnel status retrieved successfully'

  // Error Messages
  static readonly TUNNEL_ALREADY_RUNNING = 'A cloudflared tunnel is already running'
  static readonly TUNNEL_NOT_RUNNING = 'No cloudflared tunnel is currently running'
  static readonly TUNNEL_START_FAILED = 'Failed to start cloudflared tunnel'
  static readonly TUNNEL_STOP_FAILED = 'Failed to stop cloudflared tunnel'
  static readonly INVALID_PORT = 'Invalid port number provided'
  static readonly CLOUDFLARED_NOT_INSTALLED = 'Cloudflared binary not found on system'
  static readonly TUNNEL_ERROR = 'An error occurred with the tunnel service'

  // Configuration
  static readonly DEFAULT_PORT = 3000
  static readonly MIN_PORT = 1024
  static readonly MAX_PORT = 65535
}
