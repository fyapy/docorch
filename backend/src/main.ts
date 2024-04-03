import Koa from 'koa'
import cors from '@koa/cors'
import http2 from 'node:http2'
import Router from '@koa/router'
import {koaBody} from 'koa-body'
import {flags, parseAppFlags} from './flags'
import {isCertExpired, setupSSL, stats, version} from './utils'
import {ServerModel} from './database'
import {ip} from '../deps'
import api from './api'
import ui from '../ui'

parseAppFlags().then(async () => {
  if (flags.master && !ServerModel.exists('ip', ip)) {
    ServerModel.insert({ip})
  }

  const app = new Koa({proxy: true})
  const router = new Router()

  app.use(cors())
  app.use(koaBody())

  router.get('/', c => c.body = {})
  router.get('/stats', async c => c.body = await stats(ip))

  api(router)

  if (flags.master) {
    ui(router)
  }

  app.use(router.routes()).use(router.allowedMethods())

  const port = 4545
  const hostname = '0.0.0.0'

  async function startServer(app: Koa) {
    const internalServer = http2
      .createSecureServer(await setupSSL(), app.callback())
      .listen(
        port,
        hostname,
        () => console.log(`Listening on https://${hostname}:${port}/ version ${version}`),
      )

    return () => new Promise<void>(res => internalServer.close(() => {
      console.log('Server stopped')
      res()
    }))
  }

  let stopServer = await startServer(app)

  setInterval(async () => {
    if (await isCertExpired()) {
      await stopServer()
      stopServer = await startServer(app)
    }
  }, 86400 * 1000)
})
