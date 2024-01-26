import {defineHandlers, masterRoute, slaveRoute} from '../../utils'
import {ContainerModel, ServerModel} from '../../database'
import {ip, callNode} from '../../../deps'
import * as docker from '../../docker'

const CONTAINERS = '/containers'
const LOCAL_CONTAINERS = '/local-containers'

type Containers = Awaited<ReturnType<typeof docker.containers>>

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'GET',
    url: LOCAL_CONTAINERS,
    async handle(c) {
      try {
        return await docker.containers()
      } catch {
        return []
      }
    },
  })

  masterRoute(api, {
    method: 'GET',
    url: CONTAINERS,
    async handle(c) {
      const responses = await Promise.all(ServerModel.select().map(({ip: serverIp}) => {
        if (serverIp === ip) {
          try {
            return docker.containers()
          } catch {
            return [] as Containers
          }
        }

        try {
          return callNode<Containers>(serverIp, LOCAL_CONTAINERS)
        } catch {
          return [] as Containers
        }
      }))

      return ContainerModel.select().map(item => {
        const docker = responses.flat().find(d => d.Id === item.dockerId)

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
      })
    },
  })
})
