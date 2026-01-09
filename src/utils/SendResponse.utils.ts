import { Response } from 'express'

export class SendResponse {
  static success(res: Response, message: string, data: any, status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    })
  }

  static error(res: Response, message: string, status = 500, error?: any) {
    return res.status(status).json({
      success: false,
      message,
      error: error ? (typeof error === 'string' ? error : error?.message || error) : undefined,
    })
  }
}
