import {defineHandlers, stats, defaultStats, masterRoute} from '../../utils.ts'
import {callNode, ip} from '../../../deps.ts'
import {ServerModel} from '../../database.ts'

export default defineHandlers(api => {
  masterRoute(api, {
    method: 'GET',
    url: '/servers',
    async handle(c) {
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

      return c.json(await Promise.all(servers))
    },
  })
})
