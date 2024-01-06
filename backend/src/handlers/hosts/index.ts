import {defineHandlers, masterRoute} from '../../utils.ts'
import {HostModel} from '../../database.ts'

export default defineHandlers(api => {
  masterRoute(api, {
    url: '/hosts',
    method: 'GET',
    handle: c => c.json(HostModel.select()),
  })
})
