import {defineHandlers, masterRoute, slaveRoute} from '/utils.ts'
import {ContainerModel, ServerModel} from '/database.ts'
import * as docker from '/docker.ts'
import {ip, callNode} from '/deps.ts'

const CONTAINERS = '/containers'
const LOCAL_CONTAINERS = '/local-containers'

export default defineHandlers(api => {
  slaveRoute(api, {
    method: 'GET',
    url: LOCAL_CONTAINERS,
    handle: c => docker.containers().then(c.json),
  })

  masterRoute(api, {
    method: 'GET',
    url: CONTAINERS,
    handle: async c => {
      const responses = await Promise.all(ServerModel.select().map(({ip: serverIp}) => {
        if (serverIp === ip) {
          return docker.containers()
        }

        return callNode<ReturnType<typeof docker.containers>>(serverIp, LOCAL_CONTAINERS)
      }))

      return c.json(ContainerModel.select().map(item => {
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
      }))
    },
  })
})
