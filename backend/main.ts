import {getDiskInfo, handleError} from './utils.ts'
import {Hono, ip} from './deps.ts'
import {ServerModel} from './database.ts'
import {flags} from './flags.ts'
import api from './api.ts'

if (flags.master && !ServerModel.exists('ip', ip)) {
  ServerModel.insert({ip})
}

const app = new Hono()

app.onError(handleError)

app.get('/', c => c.json({}))

app.get('/stats', c => getDiskInfo().then(space => c.json({ip, ...space})))

app.route('/api', api)

Deno.serve({port: 4545}, app.fetch)
