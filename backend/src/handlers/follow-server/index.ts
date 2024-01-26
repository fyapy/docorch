import {defineHandlers, masterRoute} from '../../utils'
import {FollowDTO, flags} from '../../flags'
import {ServerModel} from '../../database'
import {ip, z} from '../../../deps'

const masterHash = flags.master ? ip : ''

const schema = z.object({token: z.string()})

type Body = z.infer<typeof schema>

export default defineHandlers(api => {
  masterRoute(api, {
    method: 'POST',
    url: '/follow-server',
    async handle(c) {
      const body = await c.req.json<Body>()

      const clientIp = c.env.ip

      if (!body.token || body.token !== masterHash) {
        throw new Error('Bad request')
      }

      if (ServerModel.select().some(server => server.ip === clientIp)) {
        return c.json<FollowDTO>({success: false, message: 'Follower already added'})
      }

      ServerModel.insert({ip: clientIp})

      return c.json<FollowDTO>({success: true, message: 'Success'})
    }
  })
})
