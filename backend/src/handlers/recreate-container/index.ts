import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {ContainerModel, Container, NotFound} from '../../database'
import {removeContainer} from '../remove-container/index'
import {createContainer} from '../create-container/index'
import {ip, callNode, nodePost} from '../../../deps'

const RECREATE_CONTAINER = '/recreate-container'
const LOCAL_RECREATE_CONTAINER = '/local-recreate-container'

type RecreateContainer = Awaited<ReturnType<typeof recreateContainer>>
async function recreateContainer(body: Container) {
  const deleteRes = await removeContainer(body.dockerId)
  if (!deleteRes.success) {
    return {success: false, dockerId: null}
  }

  const {dockerId} = await createContainer(body)

  return {success: true, dockerId}
}


export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_RECREATE_CONTAINER,
    async handle({body}, c) {
      c.json(await recreateContainer(body))
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: RECREATE_CONTAINER,
    async handle({body}, c) {
      const data = ContainerModel.selectBy('name', body.name)
      if (!data) {
        throw new NotFound(`Container with name = "${body.name}" not found`)
      }

      if (data.serverIp === ip) {
        const res = await recreateContainer(data)
        if (res.success) {
          ContainerModel.update('id', data.id, {dockerId: res.dockerId})
        }
        return c.json(res)
      }

      const res = await callNode<RecreateContainer>(data.serverIp, LOCAL_RECREATE_CONTAINER, nodePost(data))
      if (res.success) {
        ContainerModel.update('id', data.id, {dockerId: res.dockerId})
      }
      c.json(res)
    },
  })
})
