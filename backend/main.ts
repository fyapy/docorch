import {Hono, ip} from './deps.ts'
import api from './api.ts'
import {NotFound, ServerModel} from './database.ts'

if (!ServerModel.exists('ip', ip)) {
  ServerModel.insert({ip})
}

const app = new Hono()

app.onError((err, c) => {
  if (err instanceof NotFound) {
    return c.json({message: 'Database Object not found'}, 404)
  }

  return c.json({message: err.message}, 400)
})

api.get('/', c => c.json({message: 'OK'}))

api.get('/ip', c => c.json({ip}))

app.route('/api', api)

Deno.serve({port: 4545}, app.fetch)
