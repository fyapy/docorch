import {defineHandlers, masterRoute} from '../../utils'
import {HostModel} from '../../database'

export default defineHandlers(api => {
  masterRoute(api, {
    url: '/hosts',
    method: 'GET',
    handle: () => HostModel.select(),
  })
})
