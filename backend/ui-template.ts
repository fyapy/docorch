import basicAuth from 'express-basic-auth'
import {Express, Request, Response} from 'express'
import {flags} from './src/flags'

export default (app: Express) => {
  const [username, password] = flags.master!.split(':')

  app.use(basicAuth({
    users: {[username]: password},
    challenge: true,
  }))

  app.get('/ui/assets/*.js', (req, res) => {
    res.header('Content-Type', 'text/javascript').send(`<--js-->`)
  })

  app.get('/ui/assets/*.css', (req, res) => {
    res.header('Content-Type', 'text/css').send(`<--css-->`)
  })

  app.get('/ui/favicon.svg', (req, res) => {
    res.header('Content-Type', 'image/svg+xml').send(`<--svg-->`)
  })

  const htmlHandler = (req: Request, res: Response) => res.header('Content-Type', 'text/html').send(`<--html-->`)

  app.get('/ui/*', htmlHandler)
  app.get('/ui', htmlHandler)
}
