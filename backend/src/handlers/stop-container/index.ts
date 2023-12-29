import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {callNode, ip, nodePost} from '../../../deps.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const STOP_CONTAINER = '/stop-container'
const LOCAL_STOP_CONTAINER = '/local-stop-container'

function runStopContainer(dockerId: string | null) {
  if (dockerId) {
    return docker.stopContainer(dockerId)
  }
}

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_STOP_CONTAINER,
    handle: async c => {
      const {dockerId} = await c.req.json<{dockerId: string}>()

      await runStopContainer(dockerId)

      return c.json({stoped: Boolean(dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: STOP_CONTAINER,
    handle: async c => {
      const body = await c.req.json<{id: string}>()

      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await runStopContainer(dockerId)
        return c.json({})
      }

      await callNode(serverIp, STOP_CONTAINER, nodePost(body))
      return c.json({})
    },
  })
})
