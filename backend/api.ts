import {Hono, callNode, ip, nodePost} from './deps.ts'
import {ContainerModel, ServerModel} from './database.ts'
import {CreateContainerInput} from './types.ts'
import * as docker from './docker.ts'

const api = new Hono()

api.get('/servers', c => c.json(ServerModel.select().map(server => ({
  ...server,
  current: server.ip === ip,
}))))

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

const RUN_LOCAL_CONTAINER = '/local-run-container'
api.post(RUN_LOCAL_CONTAINER, async c => {
  const body = await c.req.json<CreateContainerInput>()

  return c.json(await runLocalContainer(body))
})

const RUN_CONTAINER = '/run-container'
api.post(RUN_CONTAINER, async c => {
  const body = await c.req.json<CreateContainerInput>()

  const {dockerId} = body.serverIp === ip
    ? await runLocalContainer(body)
    : await callNode<ReturnType<typeof runLocalContainer>>(body.serverIp, RUN_LOCAL_CONTAINER, nodePost(body))

  const data = ContainerModel.insert({id: crypto.randomUUID(), dockerId, ...body})

  return c.json(data)
})

const STOP_CONTAINER = '/stop-container'
api.post(STOP_CONTAINER, async c => {
  const body = await c.req.json<{id: string}>()

  const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)
  if (serverIp === ip) {
    if (dockerId) {
      await docker.stopContainer(dockerId)
    }

    return c.json({})
  }

  return callNode(serverIp, STOP_CONTAINER, nodePost(body)).then(c.json)
})

const START_CONTAINER = '/start-container'
api.post(START_CONTAINER, async c => {
  const body = await c.req.json<{id: string}>()

  const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)
  if (serverIp === ip) {
    if (dockerId) {
      await docker.startContainer(dockerId)
    }

    return c.json({})
  }

  return callNode(serverIp, START_CONTAINER, nodePost(body)).then(c.json)
})

const REMOVE_CONTAINER = '/remove-container'
api.post(REMOVE_CONTAINER, async c => {
  const body = await c.req.json<{id: string}>()

  const {serverIp, dockerId} = ContainerModel.selectBy('id', body.id)
  if (serverIp === ip) {
    if (dockerId) {
      await docker.removeContainer(dockerId)
    }

    return c.json({})
  }

  return callNode(serverIp, REMOVE_CONTAINER, nodePost(body)).then(c.json)
})

const LOCAL_CONTAINERS = '/local-containers'
api.get(LOCAL_CONTAINERS, c => docker.containers().then(c.json))

api.get('/containers', async c => {
  const servers = ServerModel.select()

  const responses = (await Promise.all(servers.map(({ip: serverIp}) => {
    if (serverIp === ip) {
      return docker.containers()
    }

    return callNode<ReturnType<typeof docker.containers>>(serverIp, LOCAL_CONTAINERS)
  }))).flat()


  const list = ContainerModel.select()

  return c.json(list.map(item => {
    const docker = responses.find(d => d.Id === item.dockerId)

    return {
      docker: docker
        ? {
          id: docker.Id,
          name: docker.Names[0].replace('/', ''),
          state: docker.State,
          status: docker.Status,
          image: docker.Image,
          imageId: docker.ImageID,
          ports: docker.Ports.map(port => ({to: port.PrivatePort, static: port.PublicPort || ''}))
        }
        : null,
      ...item,
    }
  }))
})

export default api
