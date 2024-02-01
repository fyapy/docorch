import cors from 'cors'
import express from 'express'
import {flags, parseAppFlags} from './flags'
import {stats, version} from './utils'
import {ServerModel} from './database'
import {ip} from '../deps'
import api from './api'
import ui from '../ui'

parseAppFlags().then(() => {
  if (flags.master && !ServerModel.exists('ip', ip)) {
    ServerModel.insert({ip})
  }

  const app = express()

  app.set('trust proxy', true)

  app.use(cors())
  app.use(express.json())

  app.get('/', (req, res) => res.json({}))
  app.get('/stats', async (req, res) => res.json(await stats(ip)))

  api(app)

  if (flags.master) {
    ui(app)
  }

  const port = 4545
  const hostname = '0.0.0.0'

  app.listen(port, hostname, () => console.log(`Listening on http://${hostname}:${port}/ version ${version}`))
})
