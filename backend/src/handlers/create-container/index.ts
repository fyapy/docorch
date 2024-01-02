import {defineHandlers, masterRoute, slaveRoute} from '../../utils.ts'
import {ip, callNode, nodePost} from '../../../deps.ts'
import {Network, Volume, Env} from '../../types.ts'
import {ContainerModel} from '../../database.ts'
import * as docker from '../../docker.ts'

const CREATE_CONTAINER = '/create-container'
const LOCAL_CREATE_CONTAINER = '/local-create-container'

interface CreateContainerInput {
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
      const body = await c.req.json<CreateContainerInput>()

      return c.json(await createContainer(body))
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: CREATE_CONTAINER,
    async handle(c) {
      const body = await c.req.json<CreateContainerInput>()

      const containerWithSameName = ContainerModel.select().some(c => c.name === body.name)
      if (containerWithSameName) {
        throw new Error(`Container with name = "${body.name}" already exists`)
      }

      const {dockerId} = body.serverIp === ip
        ? await createContainer(body)
        : await callNode<CreateContainer>(body.serverIp, LOCAL_CREATE_CONTAINER, nodePost(body))

      const data = ContainerModel.insert({id: crypto.randomUUID(), dockerId, ...body})

      return c.json(data)
    },
  })
})
