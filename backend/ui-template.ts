import {Context} from 'koa'
import Router from '@koa/router'
import basicAuth from 'koa-basic-auth'
import {flags} from './src/flags'

export default (app: Router) => {
  const [name, pass] = flags.master!.split(':')

  app.use(basicAuth({name, pass}))

  app.get('/ui/assets/(.*).js', c => {
    c.set('Content-Type', 'text/javascript')
    c.body = `<--js-->`
  })

  app.get('/ui/assets/(.*).css', c => {
    c.set('Content-Type', 'text/css')
    c.body = `<--css-->`
  })

  app.get('/ui/favicon.svg', c => {
    c.set('Content-Type', 'image/svg+xml')
    c.body = `<--svg-->`
  })

  function htmlHandler(c: Context) {
    c.set('Content-Type', 'text/html')
    c.body = `<--html-->`
  }

  app.get('/ui/(.*)', htmlHandler)
  app.get('/ui', htmlHandler)
}
