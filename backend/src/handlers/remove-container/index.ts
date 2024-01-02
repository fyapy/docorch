import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {callNode, ip, nodePost} from '../../../deps.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const REMOVE_CONTAINER = '/remove-container'
const LOCAL_REMOVE_CONTAINER = '/local-remove-container'

type RemoveContainer = Awaited<ReturnType<typeof removeContainer>>
export async function removeContainer(dockerId: string | null) {
  if (!dockerId) {
    return {success: false}
  }

  const containers = await docker.containers()
  const container = containers.find(c => c.Id === dockerId)
  if (!container) {
    return {success: false}
  }

  await docker.removeContainer(dockerId)

  const containersWithSameImage = containers.some(c => c.ImageID === container.ImageID && container.Id !== dockerId)
  if (!containersWithSameImage) {
    await docker.removeImage(container.ImageID)
  }

  return {success: true}
}

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_REMOVE_CONTAINER,
    async handle(c) {
      const {dockerId} = await c.req.json<{dockerId: string}>()

      await removeContainer(dockerId)

      return c.json({success: Boolean(dockerId)})
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: REMOVE_CONTAINER,
    async handle(c) {
      const body = await c.req.json<{id: string}>()

      const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)

      if (serverIp === ip) {
        const res = await removeContainer(dockerId)
        if (res.success) {
          ContainerModel.remove('id', body.id)
        }
        return c.json(res)
      }

      const res = await callNode<RemoveContainer>(serverIp, LOCAL_REMOVE_CONTAINER, nodePost({dockerId}))
      if (res.success) {
        ContainerModel.remove('id', body.id)
      }
      return c.json(res)
    },
  })
})
