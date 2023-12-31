import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {callNode, ip, nodePost} from '../../../deps.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const START_CONTAINER = '/start-container'
const LOCAL_START_CONTAINER = '/local-start-container'

const startContainer = (dockerId: string | null) => dockerId && docker.startContainer(dockerId)

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_START_CONTAINER,
    async handle(c) {
      const {dockerId} = await c.req.json<{dockerId: string}>()

      await startContainer(dockerId)

      return c.json({success: Boolean(dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: START_CONTAINER,
    async handle(c) {
      const body = await c.req.json<{id: string}>()

      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await startContainer(dockerId)
        return c.json({success: Boolean(dockerId)})
      }

      return c.json(await callNode(serverIp, LOCAL_START_CONTAINER, nodePost({dockerId})))
    },
  })
})
