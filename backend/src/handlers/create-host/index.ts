import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {Host, HostModel, ServerModel} from '../../database.ts'
import {callNode, ip, nodePost, z} from '../../../deps.ts'

const CREATE_HOST = '/create-host'
const LOCAL_CREATE_HOST = '/local-create-host'

type Body = z.infer<typeof schema>
const schema = z.object({
  host: z.string(),
  ip: z.string(),
})

function hostsInster(host: Host) {
  const originalHosts = Deno.readTextFileSync('/etc/hosts').split('\n')

  const editedHosts = [...originalHosts, `${host.ip} ${host.host}\n`].filter(Boolean).join('\n')

  Deno.writeTextFileSync('/etc/hosts', editedHosts)
}

export default defineHandlers(api => {
  slaveRoute(api, {
    url: LOCAL_CREATE_HOST,
    method: 'POST',
    async handle(c) {
      hostsInster(await c.req.json<Host>())

      return c.json({success: true})
    },
  })

  masterRoute(api, {
    url: CREATE_HOST,
    method: 'POST',
    async handle(c) {
      const body = await c.req.json<Body>()
      schema.parse(body)

      if (HostModel.select().some(h => h.ip === body.ip || h.host === body.host)) {
        throw new Error('Host ot ip already exists')
      }

      const host = HostModel.insert({id: crypto.randomUUID(), ...body})!

      await Promise.all(
        ServerModel.select().map(({ip: serverIp}) => {
          if (serverIp === ip) {
            return hostsInster(host)
          }
          return callNode(serverIp, LOCAL_CREATE_HOST, nodePost(host))
        })
      )

      return c.json({success: true})
    },
  })
})
