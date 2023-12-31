import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {callNode, ip, nodePost} from '../../../deps.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const REMOVE_CONTAINER = '/remove-container'
const LOCAL_REMOVE_CONTAINER = '/local-remove-container'

const removeContainer = (dockerId: string | null) => dockerId && docker.removeContainer(dockerId)

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_REMOVE_CONTAINER,
    async handle(c) {
      const {dockerId} = await c.req.json<{dockerId: string}>()

      await removeContainer(dockerId)

      return c.json({deleted: Boolean(dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: REMOVE_CONTAINER,
    async handle(c) {
      const body = await c.req.json<{id: string}>()

      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        await removeContainer(dockerId)
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
