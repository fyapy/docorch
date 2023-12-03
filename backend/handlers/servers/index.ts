import {defineHandlers, getDiskInfo, masterRoute} from '/utils.ts'
import {ServerModel} from '/database.ts'
import {callNode, ip} from '/deps.ts'

export default defineHandlers(api => {
  masterRoute(api, {
    method: 'GET',
    url: '/servers',
    handle: async c => {
      const servers = ServerModel.select().map(async server => {
        const master = server.ip === ip

        if (master) {
          const space = await getDiskInfo()

          return {
            ...server,
            master,
            online: true,
            ...space,
          }
        }

        try {
          const res = await callNode<{total: string; free: string}>(server.ip, '/stats', {prefix: ''})

          return {
            ...server,
            master,
            online: true,
            total: res.total,
            free: res.free,
          }
        } catch {
          return {
            ...server,
            master,
            online: false,
            total: '0',
            free: '0',
          }
        }
      })

      return c.json(await Promise.all(servers))
    },
  })
})
