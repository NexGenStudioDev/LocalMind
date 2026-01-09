import { Router } from 'express'
const router: Router = Router()

import tunnelController from './Tunnel.controller'
import { localTunnelController, ngrokController } from './TunnelProviders.controller'

// Cloudflared tunnel routes
router.post('/v1/expose/cloudflared', tunnelController.startTunnel)
router.get('/v1/expose/cloudflared/status', tunnelController.getTunnelStatus)
router.delete('/v1/expose/cloudflared/stop', tunnelController.stopTunnel)

// LocalTunnel routes
router.post('/v1/expose/localtunnel', localTunnelController.startTunnel)
router.get('/v1/expose/localtunnel/status', localTunnelController.getTunnelStatus)
router.delete('/v1/expose/localtunnel/stop', localTunnelController.stopTunnel)

// Ngrok routes
router.post('/v1/expose/ngrok', ngrokController.startTunnel)
router.get('/v1/expose/ngrok/status', ngrokController.getTunnelStatus)
router.delete('/v1/expose/ngrok/stop', ngrokController.stopTunnel)

export { router as TunnelRoutes }
