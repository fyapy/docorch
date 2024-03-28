import crypto from 'crypto'
import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {ip, callNode, nodePost} from '../../../deps'
import {Network, Volume, Env} from '../../types'
import {ContainerModel} from '../../database'
import * as docker from '../../docker'

const CREATE_CONTAINER = '/create-container'
const LOCAL_CREATE_CONTAINER = '/local-create-container'

interface CreateContainerInput {
  hostname?: string
  serverIp: string
  name: string
  image: string
  networks: Network[]
  envs: Env[]
  volumes: Volume[]
  args: string[]
}

type CreateContainer = Awaited<ReturnType<typeof createContainer>>
export async function createContainer(body: CreateContainerInput) {
  const hasImage = await docker.imageExists(body.image)
  if (!hasImage) {
    await docker.pullImage(body.image)

    const hasImage = await docker.imageRepeatableExists(body.image)
    if (!hasImage) throw new Error('image dont exists after pulling')
  }

  const container = await docker.createContainer(body)
  await docker.startContainer(container.Id)

  return {dockerId: container.Id}
}


export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'POST',
    url: LOCAL_CREATE_CONTAINER,
    async handle(c) {
      c.body = await createContainer(c.request.body)
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: CREATE_CONTAINER,
    async handle(c) {
      const body = c.request.body
      const containerWithSameName = ContainerModel.select().some(c => c.name === body.name)
      if (containerWithSameName) {
        throw new Error(`Container with name = "${body.name}" already exists`)
      }

      const {dockerId} = body.serverIp === ip
        ? await createContainer(body)
        : await callNode<CreateContainer>(body.serverIp, LOCAL_CREATE_CONTAINER, nodePost(body))

      const data = ContainerModel.insert({id: crypto.randomUUID(), dockerId, ...body})

      c.body = data
    },
  })
})
