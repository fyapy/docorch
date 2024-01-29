import basicAuth from 'express-basic-auth'
import {Express} from 'express'
import {flags} from './src/flags'

export default (app: Express) => {
  const [username, password] = flags.master!.split(':')

  app.use(basicAuth({
    users: {[username]: password}
  }))


  app.get('/ui/*', (req, res) => {
    res.header('Content-Type', 'text/html')

    res.send(`<--html-->`)
  })

  app.get('/ui/assets/*.js', (req, res) => {
    res.header('Content-Type', 'text/javascript')

    res.send(`<--js-->`)
  })

  app.get('/ui/assets/*.css', (req, res) => {
    res.header('Content-Type', 'text/css')

    res.send(`<--css-->`)
  })

  app.get('/ui/favicon.svg', (req, res) => {
    res.header('Content-Type', 'image/svg+xml')

    res.send(`<--svg-->`)
  })
}
