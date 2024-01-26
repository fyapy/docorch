import {Host, HostModel, NotFound, ServerModel} from '../../database'
import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {callNode, ip, nodePost, z, fs} from '../../../deps'

const REMOVE_HOST = '/remove-host'
const LOCAL_REMOVE_HOST = '/local-remove-host'

type Body = z.infer<typeof schema>
const schema = z.object({id: z.string()})

function hostsRemove(host: Host) {
  const hostToRemove = `${host.ip} ${host.host}`
  const originalHosts = (fs.readFileSync('/etc/hosts') as any as string).split('\n')

  const editedHosts = originalHosts.filter(h => h !== hostToRemove).filter(Boolean).join('\n')

  fs.writeFileSync('/etc/hosts', editedHosts)
}

export default defineHandlers(api => {
  slaveRoute(api, {
    url: LOCAL_REMOVE_HOST,
    method: 'POST',
    async handle(c) {
      hostsRemove(await c.req.json<Host>())

      return c.json({success: true})
    },
  })

  masterRoute(api, {
    url: REMOVE_HOST,
    method: 'POST',
    async handle(c) {
      const body = await c.req.json<Body>()
      schema.parse(body)

      const host = HostModel.select().find(h => h.id === body.id)
      if (!host) {
        throw new NotFound()
      }

      await Promise.all(
        ServerModel.select().map(({ip: serverIp}) => {
          if (serverIp === ip) {
            return hostsRemove(host)
          }
          return callNode(serverIp, LOCAL_REMOVE_HOST, nodePost(host))
        })
      )
      HostModel.remove('id', body.id)


      return c.json({success: true})
    },
  })
})
