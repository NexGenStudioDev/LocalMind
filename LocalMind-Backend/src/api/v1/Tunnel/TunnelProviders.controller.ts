import { Request, Response } from 'express'
import { localtunnelStartSchema, ngrokStartSchema } from './Tunnel.validator'
import localTunnelService from './LocalTunnel.service'
import ngrokService from './Ngrok.service'
import { SendResponse } from '../../../utils/SendResponse.utils'
import TunnelConstant from './Tunnel.constant'
import { StatusConstant } from '../../../constant/Status.constant'

class LocalTunnelController {
  constructor() {
    this.startTunnel = this.startTunnel.bind(this)
    this.stopTunnel = this.stopTunnel.bind(this)
    this.getTunnelStatus = this.getTunnelStatus.bind(this)
  }

  /**
   * Start a localtunnel
   * POST /api/v1/expose/localtunnel
   */
  async startTunnel(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await localtunnelStartSchema.parseAsync(req.body)

      const result = await localTunnelService.startTunnel(validatedData.port, validatedData.subdomain)

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
   * DELETE /api/v1/expose/localtunnel/stop
   */
  async stopTunnel(req: Request, res: Response): Promise<void> {
    try {
      const result = await localTunnelService.stopTunnel()

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
   * GET /api/v1/expose/localtunnel/status
   */
  async getTunnelStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = localTunnelService.getTunnelStatus()

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

class NgrokController {
  constructor() {
    this.startTunnel = this.startTunnel.bind(this)
    this.stopTunnel = this.stopTunnel.bind(this)
    this.getTunnelStatus = this.getTunnelStatus.bind(this)
  }

  /**
   * Start an ngrok tunnel
   * POST /api/v1/expose/ngrok
   */
  async startTunnel(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await ngrokStartSchema.parseAsync(req.body)

      const result = await ngrokService.startTunnel(
        validatedData.port,
        validatedData.authToken,
        validatedData.domain
      )

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

      if (err.message?.includes('authtoken')) {
        SendResponse.error(res, err.message, StatusConstant.UNAUTHORIZED, err)
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
   * DELETE /api/v1/expose/ngrok/stop
   */
  async stopTunnel(req: Request, res: Response): Promise<void> {
    try {
      const result = await ngrokService.stopTunnel()

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
   * GET /api/v1/expose/ngrok/status
   */
  async getTunnelStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = ngrokService.getTunnelStatus()

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

export const localTunnelController = new LocalTunnelController()
export const ngrokController = new NgrokController()
