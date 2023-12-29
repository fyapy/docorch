import {defineHandlers, getDiskInfo, masterRoute} from '../../utils.ts'
import {callNode, ip} from '../../../deps.ts'
import {ServerModel} from '../../database.ts'
import {enabled} from '../../docker.ts'

export default defineHandlers(api => {
  masterRoute(api, {
    method: 'GET',
    url: '/servers',
    handle: async c => {
      const servers = ServerModel.select().map(async server => {
        const master = server.ip === ip

        if (master) {
          const space = await getDiskInfo()
          const docker = await enabled()

          return {
            ...server,
            master,
            docker,
            online: true,
            ...space,
          }
        }

        try {
          const res = await callNode<{total: string; free: string; docker: boolean}>(server.ip, '/stats', {prefix: ''})

          return {
            ...server,
            master,
            online: true,
            total: res.total,
            docker: res.docker,
            free: res.free,
          }
        } catch {
          return {
            ...server,
            master,
            online: false,
            docker: false,
            total: '0',
            free: '0',
          }
        }
      })

      return c.json(await Promise.all(servers))
    },
  })
})
