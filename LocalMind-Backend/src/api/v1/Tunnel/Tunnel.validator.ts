import { z } from 'zod'
import TunnelConstant from './Tunnel.constant'

export const tunnelStartSchema = z.object({
  port: z
    .number()
    .int()
    .min(TunnelConstant.MIN_PORT, {
      message: `Port must be at least ${TunnelConstant.MIN_PORT}`,
    })
    .max(TunnelConstant.MAX_PORT, {
      message: `Port must be at most ${TunnelConstant.MAX_PORT}`,
    }),
  subdomain: z
    .string()
    .max(63, { message: 'Subdomain must be less than 63 characters' })
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i, {
      message: 'Subdomain must contain only alphanumeric characters and hyphens',
    })
    .optional(),
})

export const localtunnelStartSchema = z.object({
  port: z
    .number()
    .int()
    .min(TunnelConstant.MIN_PORT)
    .max(TunnelConstant.MAX_PORT),
  subdomain: z.string().optional(),
})

export const ngrokStartSchema = z.object({
  port: z
    .number()
    .int()
    .min(TunnelConstant.MIN_PORT)
    .max(TunnelConstant.MAX_PORT),
  authToken: z.string().optional(),
  domain: z.string().optional(),
})

export type TunnelStartInput = z.infer<typeof tunnelStartSchema>
export type LocalTunnelStartInput = z.infer<typeof localtunnelStartSchema>
export type NgrokStartInput = z.infer<typeof ngrokStartSchema>
