import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {callNode, ip, nodePost} from '../../../deps'
import {ContainerModel} from '../../database'
import * as docker from '../../docker'

const START_CONTAINER = '/start-container'
const LOCAL_START_CONTAINER = '/local-start-container'

const startContainer = (dockerId: string | null) => dockerId && docker.startContainer(dockerId)

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_START_CONTAINER,
    async handle({body}, c) {
      await startContainer(body.dockerId)

      c.json({success: Boolean(body.dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: START_CONTAINER,
    async handle({body}, c) {
      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await startContainer(dockerId)
        return c.json({success: Boolean(dockerId)})
      }

      c.json(await callNode(serverIp, LOCAL_START_CONTAINER, nodePost({dockerId})))
    },
  })
})
