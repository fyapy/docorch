// import recreateContainer from './handlers/recreate-container/index'
// import removeContainer from './handlers/remove-container/index'
// import createContainer from './handlers/create-container/index'
// import startContainer from './handlers/start-container/index'
// import stopContainer from './handlers/stop-container/index'
// import followServer from './handlers/follow-server/index'
// import removeHost from './handlers/remove-host/index'
// import createHost from './handlers/create-host/index'
// import containers from './handlers/containers/index'
import servers from './handlers/servers/index'
// import hosts from './handlers/hosts/index'
import Elysia from 'elysia'

export default (app: Elysia) => {
  // hosts(app)
  // createHost(app)
  // removeHost(app)

  servers(app)
  // followServer(app)

  // containers(app)
  // stopContainer(app)
  // startContainer(app)
  // createContainer(app)
  // removeContainer(app)
  // recreateContainer(app)

  return app
}
