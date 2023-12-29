import removeContainer from './handlers/remove-container/index.ts'
import startContainer from './handlers/start-container/index.ts'
import stopContainer from './handlers/stop-container/index.ts'
import runContainer from './handlers/run-container/index.ts'
import followServer from './handlers/follow-server/index.ts'
import containers from './handlers/containers/index.ts'
import servers from './handlers/servers/index.ts'
import {Hono} from '../deps.ts'

const api = new Hono()

servers(api)
containers(api)
runContainer(api)
followServer(api)
stopContainer(api)
startContainer(api)
removeContainer(api)

export default api
