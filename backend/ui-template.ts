import {Hono} from './deps.ts'

export default (hono: Hono) => {
  hono.get('/ui', c => c.html(`<--html-->`))

  hono.get('/ui/assets/*.js', c => c.html(`<--js-->`, 200, {'Content-Type': 'text/javascript'}))

  hono.get('/ui/assets/*.css', c => c.text(`<--css-->`, 200, {'Content-Type': 'text/css'}))

  hono.get('/ui/favicon.svg', c => c.text(`<--svg-->`, 200, {'Content-Type': 'image/svg+xml'}))
}
