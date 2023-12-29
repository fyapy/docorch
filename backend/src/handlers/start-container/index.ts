import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {callNode, ip, nodePost} from '../../../deps.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const START_CONTAINER = '/start-container'
const LOCAL_START_CONTAINER = '/local-start-container'

function runStartContainer(dockerId: string | null) {
  if (dockerId) {
    return docker.startContainer(dockerId)
  }
}

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_START_CONTAINER,
    handle: async c => {
      const {dockerId} = await c.req.json<{dockerId: string}>()

      await runStartContainer(dockerId)

      return c.json({started: Boolean(dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: START_CONTAINER,
    handle: async c => {
      const body = await c.req.json<{id: string}>()

      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await runStartContainer(dockerId)
        return c.json({})
      }

      await callNode(serverIp, START_CONTAINER, nodePost(body))
      return c.json({})
    },
  })
})