import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {callNode, ip, nodePost} from '../../../deps'
import {ContainerModel} from '../../database'
import * as docker from '../../docker'

const STOP_CONTAINER = '/stop-container'
const LOCAL_STOP_CONTAINER = '/local-stop-container'

const stopContainer = (dockerId: string | null) => dockerId && docker.stopContainer(dockerId)

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_STOP_CONTAINER,
    async handle(c) {
      const body = c.request.body
      await stopContainer(body.dockerId)

      c.body = {success: Boolean(body.dockerId)}
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: STOP_CONTAINER,
    async handle(c) {
      const body = c.request.body
      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await stopContainer(dockerId)
        return c.body = {success: Boolean(dockerId)}
      }

      c.body = await callNode(serverIp, LOCAL_STOP_CONTAINER, nodePost({dockerId}))
    },
  })
})
