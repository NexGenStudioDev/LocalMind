export interface ITunnelStartRequest {
  port: number
  subdomain?: string
}

export interface ITunnelStartResponse {
  url: string
  port: number
  status: 'active'
  tunnelId?: string
}

export interface ITunnelStatus {
  active: boolean
  url?: string
  port?: number
  tunnelId?: string
  startedAt?: Date
}

export interface ITunnelStopResponse {
  message: string
  previousUrl?: string
}

export interface ICloudflaredTunnel {
  url: string
  connections: Array<{
    id: string
    protocol: string
    location: string
  }>
  stop: () => Promise<void>
}
