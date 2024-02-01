import {defineHandlers, stats, defaultStats, masterRoute} from '../../utils'
import {callNode, ip} from '../../../deps'
import {ServerModel} from '../../database'

export default defineHandlers(api => {
  masterRoute(api, {
    method: 'GET',
    url: '/servers',
    async handle(req, c) {
      const servers = ServerModel.select().map(async server => {
        if (server.ip === ip) {
          return await stats(server.ip)
        }

        try {
          return await callNode(server.ip, '/stats', {prefix: ''})
        } catch {
          return defaultStats(server.ip)
        }
      })

      c.json(await Promise.all(servers))
    },
  })
})
