import { Request, Response } from 'express'
import { tunnelStartSchema } from './Tunnel.validator'
import tunnelService from './Tunnel.service'
import { SendResponse } from '../../../utils/SendResponse.utils'
import TunnelConstant from './Tunnel.constant'
import { StatusConstant } from '../../../constant/Status.constant'

class TunnelController {
  constructor() {
    this.startTunnel = this.startTunnel.bind(this)
    this.stopTunnel = this.stopTunnel.bind(this)
    this.getTunnelStatus = this.getTunnelStatus.bind(this)
  }

  /**
   * Start a cloudflared tunnel
   * POST /api/v1/expose/cloudflared
   */
  async startTunnel(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await tunnelStartSchema.parseAsync(req.body)

      const result = await tunnelService.startTunnel(validatedData.port, validatedData.subdomain)

      SendResponse.success(res, TunnelConstant.TUNNEL_STARTED, result, StatusConstant.CREATED)
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        SendResponse.error(
          res,
          err.errors?.[0]?.message || TunnelConstant.INVALID_PORT,
          StatusConstant.BAD_REQUEST,
          err
        )
        return
      }

      if (err.message === TunnelConstant.TUNNEL_ALREADY_RUNNING) {
        SendResponse.error(res, err.message, StatusConstant.CONFLICT, err)
        return
      }

      if (err.message === TunnelConstant.CLOUDFLARED_NOT_INSTALLED) {
        SendResponse.error(res, err.message, StatusConstant.SERVICE_UNAVAILABLE, err)
        return
      }

      SendResponse.error(
        res,
        err.message || TunnelConstant.TUNNEL_START_FAILED,
        StatusConstant.INTERNAL_SERVER_ERROR,
        err
      )
    }
  }

  /**
   * Stop the active tunnel
   * DELETE /api/v1/expose/cloudflared/stop
   */
  async stopTunnel(req: Request, res: Response): Promise<void> {
    try {
      const result = await tunnelService.stopTunnel()

      SendResponse.success(res, result.message, { previousUrl: result.previousUrl }, StatusConstant.OK)
    } catch (err: any) {
      if (err.message === TunnelConstant.TUNNEL_NOT_RUNNING) {
        SendResponse.error(res, err.message, StatusConstant.NOT_FOUND, err)
        return
      }

      SendResponse.error(
        res,
        err.message || TunnelConstant.TUNNEL_STOP_FAILED,
        StatusConstant.INTERNAL_SERVER_ERROR,
        err
      )
    }
  }

  /**
   * Get tunnel status
   * GET /api/v1/expose/cloudflared/status
   */
  async getTunnelStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = tunnelService.getTunnelStatus()

      SendResponse.success(res, TunnelConstant.TUNNEL_STATUS_RETRIEVED, status, StatusConstant.OK)
    } catch (err: any) {
      SendResponse.error(
        res,
        err.message || TunnelConstant.TUNNEL_ERROR,
        StatusConstant.INTERNAL_SERVER_ERROR,
        err
      )
    }
  }
}

export default new TunnelController()
