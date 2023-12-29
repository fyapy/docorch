import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {callNode, ip, nodePost} from '../../../deps.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const REMOVE_CONTAINER = '/remove-container'
const LOCAL_REMOVE_CONTAINER = '/local-remove-container'

function runRemoveContainer(dockerId: string | null) {
  if (dockerId) {
    return docker.removeContainer(dockerId)
  }
}

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_REMOVE_CONTAINER,
    handle: async c => {
      const {dockerId} = await c.req.json<{dockerId: string}>()

      await runRemoveContainer(dockerId)

      return c.json({deleted: Boolean(dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: REMOVE_CONTAINER,
    handle: async c => {
      const body = await c.req.json<{id: string}>()

      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await runRemoveContainer(dockerId)
        ContainerModel.remove('id', body.id)
        return c.json({})
      }

      const res = await callNode<{deleted: boolean}>(serverIp, LOCAL_REMOVE_CONTAINER, nodePost({dockerId}))
      if (res.deleted) {
        ContainerModel.remove('id', body.id)
      }
      return c.json({})
    },
  })
})
