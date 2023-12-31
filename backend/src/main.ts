import {handleError, requestIp, stats, version} from './utils.ts'
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

app.get('/stats', async c => c.json(await stats(ip)))

app.route('/api', api)

if (flags.master) {
  ui(app)
}

Deno.serve({
  port: 4545,
  onListen({hostname, port}) {
    console.log(`Listening on http://${hostname}:${port}/ version ${version}`)
  },
}, (req, info) => app.fetch(req, {ip: requestIp(info.remoteAddr)}))
