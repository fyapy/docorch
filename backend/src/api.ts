import recreateContainer from './handlers/recreate-container/index.ts'
import removeContainer from './handlers/remove-container/index.ts'
import createContainer from './handlers/create-container/index.ts'
import startContainer from './handlers/start-container/index.ts'
import stopContainer from './handlers/stop-container/index.ts'
import followServer from './handlers/follow-server/index.ts'
import removeHost from './handlers/remove-host/index.ts'
import createHost from './handlers/create-host/index.ts'
import containers from './handlers/containers/index.ts'
import servers from './handlers/servers/index.ts'
import hosts from './handlers/hosts/index.ts'
import {Hono} from '../deps.ts'

const api = new Hono()

hosts(api)
createHost(api)
removeHost(api)

servers(api)
followServer(api)

containers(api)
stopContainer(api)
startContainer(api)
createContainer(api)
removeContainer(api)
recreateContainer(api)

export default api
