
import {Elysia} from 'elysia'
import {cors} from '@elysiajs/cors'
import http from 'http'
// @ts-ignore
import {ip as elysiaIp} from 'elysia-ip'
import {handleError, stats, version} from './utils'
import {ServerModel} from './database'
import {flags} from './flags'
import {ip} from '../deps'
import { containers } from './docker'
// import api from './api'
// // import ui from '../ui'

try {
  await containers()
} catch (e) {
  console.log('e', e)
}

if (flags.master && !ServerModel.exists('ip', ip)) {
  ServerModel.insert({ip})
}

const app = (
  new Elysia()
    .use(cors())
    .use(elysiaIp())
    // .onError(handleError)
    .get('/', () => ({}))
    // .get('/stats', () => stats(ip))
)

if (flags.master) {
  // ui(app)
}

app.listen(4545, ({hostname, port}) => {
  console.log(`Listening on http://${hostname}:${port}/ version ${version}`)
})
