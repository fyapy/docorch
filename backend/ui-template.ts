import {Hono, basicAuth} from './deps.ts'
import {flags} from './src/flags.ts'

export default (hono: Hono) => {
  const [username, password] = flags.master!.split(':')

  hono.use('/ui/*', basicAuth({username, password}))

  hono.get('/ui/assets/*.js', c => c.text(`<--js-->`, 200, {'Content-Type': 'text/javascript'}))

  hono.get('/ui/assets/*.css', c => c.text(`<--css-->`, 200, {'Content-Type': 'text/css'}))

  hono.get('/ui/favicon.svg', c => c.text(`<--svg-->`, 200, {'Content-Type': 'image/svg+xml'}))

  hono.get('/ui/*', c => c.html(`<--html-->`))
}
