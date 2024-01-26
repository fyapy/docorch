import {Elysia} from 'elysia'
import {basicAuth} from '@eelkevdbos/elysia-basic-auth'
import {flags} from './src/flags'

export default (app: Elysia) => {
  const [username, password] = flags.master!.split(':')

  app.use(basicAuth({
    credentials: [{username, password}],
  }))

  app.get('/ui/assets/*.js', ({set}) => {
    set.headers['Content-Type'] = 'text/javascript'

    return `<--js-->`
  })

  app.get('/ui/assets/*.css', ({set}) => {
    set.headers['Content-Type'] = 'text/css'

    return `<--css-->`
  })

  app.get('/ui/favicon.svg', ({set}) => {
    set.headers['Content-Type'] = 'image/svg+xml'

    return `<--svg-->`
  })

  app.get('/ui/*', ({set}) => {
    set.headers['Content-Type'] = 'text/html'

    return `<--html-->`
  })
}
