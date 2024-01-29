import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {Host, HostModel, ServerModel} from '../../database'
import {callNode, ip, nodePost, z, fs} from '../../../deps'

const CREATE_HOST = '/create-host'
const LOCAL_CREATE_HOST = '/local-create-host'

const schema = z.object({
  host: z.string(),
  ip: z.string(),
})

function hostsInster(host: Host) {
  const originalHosts = (fs.readFileSync('/etc/hosts') as any).split('\n')

  const editedHosts = [...originalHosts, `${host.ip} ${host.host}\n`].filter(Boolean).join('\n')

  fs.writeFileSync('/etc/hosts', editedHosts)
}

export default defineHandlers(api => {
  slaveRoute(api, {
    url: LOCAL_CREATE_HOST,
    method: 'POST',
    async handle({body}) {
      hostsInster(body)

      return {success: true}
    },
  })

  masterRoute(api, {
    url: CREATE_HOST,
    method: 'POST',
    async handle({body}, res) {
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

      res.json({success: true})
    },
  })
})
