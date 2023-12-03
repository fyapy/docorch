import {defineHandlers, masterRoute, slaveRoute} from '/utils.ts'
import {ip, callNode, nodePost} from '/deps.ts'
import {Network, Volume, Env} from '/types.ts'
import {ContainerModel} from '/database.ts'
import * as docker from '/docker.ts'

const RUN_CONTAINER = '/run-container'
const LOCAL_RUN_CONTAINER = '/local-run-container'

interface CreateContainerInput {
  serverIp: string
  name: string
  image: string
  networks: Network[]
  envs: Env[]
  volumes: Volume[]
  args: string[]
}

async function runLocalContainer(body: CreateContainerInput) {
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
    url: LOCAL_RUN_CONTAINER,
    handle: async c => {
      const body = await c.req.json<CreateContainerInput>()

      return c.json(await runLocalContainer(body))
    },
  })

  masterRoute(api, {
    method: 'POST',
    url: RUN_CONTAINER,
    handle: async c => {
      const body = await c.req.json<CreateContainerInput>()

      const {dockerId} = body.serverIp === ip
        ? await runLocalContainer(body)
        : await callNode<ReturnType<typeof runLocalContainer>>(body.serverIp, LOCAL_RUN_CONTAINER, nodePost(body))

      const data = ContainerModel.insert({id: crypto.randomUUID(), dockerId, ...body})

      return c.json(data)
    },
  })
})
