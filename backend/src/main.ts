import {getDiskInfo, handleError, requestIp} from './utils.ts'
import {ServerModel} from './database.ts'
import {Hono, ip} from '../deps.ts'
import {flags} from './flags.ts'
import api from './api.ts'
import ui from '../ui.ts'

if (flags.master && !ServerModel.exists('ip', ip)) {
  ServerModel.insert({ip})
}

const app = new Hono()

app.onError(handleError)

app.get('/', c => c.json({}))

app.get('/stats', c => getDiskInfo().then(space => c.json({ip, ...space})))

app.route('/api', api)

if (flags.master) {
  ui(app)
}

Deno.serve(
  {port: 4545},
  (req, info) => app.fetch(req, {ip: requestIp(info.remoteAddr)}),
)
