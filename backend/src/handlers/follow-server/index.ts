import {defineHandlers, masterRoute} from '../../utils'
import {FollowDTO, flags} from '../../flags'
import {ServerModel} from '../../database'
import {ip} from '../../../deps'

const masterHash = flags.master ? ip : ''

export default defineHandlers(api => {
  masterRoute(api, {
    method: 'POST',
    url: '/follow-server',
    async handle({body, ip}, c) {
      const clientIp = ip!

      if (!body.token || body.token !== masterHash || !clientIp) {
        throw new Error('Bad request')
      }

      if (ServerModel.select().some(server => server.ip === clientIp)) {
        return c.json(<FollowDTO>{success: false, message: 'Follower already added'})
      }

      ServerModel.insert({ip: clientIp})

      c.json(<FollowDTO>{success: true, message: 'Success'})
    }
  })
})
