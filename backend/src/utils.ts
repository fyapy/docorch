import Router from '@koa/router'
import crypto from 'node:crypto'
import {Context, Middleware} from 'koa'
import {addDays, isBefore} from 'date-fns'
import {createCA, createCert} from 'mkcert'
import {checkDiskSpace, fs, ip, socketPath} from '../deps'
import {NotFound} from './database'
import {enabled} from './docker'
import {flags} from './flags'

const handleError = (handle: (c: Context) => any): Middleware => async c => {
  try {
    await handle(c)
  } catch (err: any) {
    if (err instanceof NotFound) {
      c.status = 404
      c.body = {message: 'Database Object not found'}
      return
    }

    if (err.cause?.address === socketPath) {
      c.status = 500
      c.body = {message: 'Docker deamon not started'}
      return
    }

    c.status = 400
    c.body = {message: err.message || 'Unknown error'}
  }
}

type RouteOptions = {
  method: 'GET' | 'POST',
  url: string
  handle: (c: Context) => any
}
export function masterRoute(app: Router, {method, url, handle}: RouteOptions) {
  if (!flags.master) {
    return
  }

  const apiUrl = `/api${url}`

  if (method === 'GET') {
    console.log(`${method}  ${apiUrl}`)
    app.get(apiUrl, handleError(handle))
    return
  }
  if (method === 'POST') {
    console.log(`${method} ${apiUrl}`)
    app.post(apiUrl, handleError(handle))
    return
  }

  console.error(`masterRoute error ${method} ${apiUrl}`)
}
export function slaveRoute(app: Router, {method, url, handle}: RouteOptions) {
  if (!flags.slave) {
    return
  }

  const apiUrl = `/api${url}`

  if (method === 'GET') {
    console.log(`${method}  ${apiUrl}`)
    app.get(apiUrl, handleError(handle))
    return
  }
  if (method === 'POST') {
    console.log(`${method} ${apiUrl}`)
    app.post(apiUrl, handleError(handle))
    return
  }

  console.error(`slaveRoute error ${method} ${apiUrl}`)
}

export const defineHandlers = (handlers: (app: Router) => void) => (app: Router) => handlers(app)

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes'
  }

  const k = 1000 // 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export async function getDiskInfo() {
  const space = await checkDiskSpace('/')

  return {
    total: formatBytes(space.size),
    free: formatBytes(space.free),
  }
}

export const version = '29.08.27'

export async function stats(ip: string) {
  const space = await getDiskInfo()
  const docker = await enabled()
  const mode = flags.master ? 'master' : 'slave'
  const master = mode === 'master'
  const online = true

  return {version, mode, ip, docker, master, online, ...space}
}

export const defaultStats = (ip: string) => ({
  ip,
  version,
  mode: 'slave',
  master: false,
  online: false,
  docker: false,
  total: '0',
  free: '0',
})

const SSL_DIR = `${process.cwd().replace('/dist', '')}/ssl`

export async function isCertExpired() {
  const cert = await fs.promises.readFile(`${SSL_DIR}/localhost.crt`)

  return isBefore(
    new Date(new crypto.X509Certificate(cert).validTo),
    addDays(new Date(), 10),
  )
}

async function createSSL() {
  const certPath = `${SSL_DIR}/localhost.crt`
  if (fs.existsSync(certPath)) {
    fs.unlinkSync(certPath)
  }

  const keyPath = `${SSL_DIR}/localhost.key`
  if (fs.existsSync(keyPath)) {
    fs.unlinkSync(keyPath)
  }

  const cert = await createCert({
    ca: await createCA({
      organization: '',
      countryCode: '',
      state: '',
      locality: '',
      validity: 365,
    }),
    domains: [ip, '127.0.0.1', 'localhost'],
    validity: 365,
  })
  
  fs.writeFileSync(certPath, cert.cert)
  fs.writeFileSync(keyPath, cert.key)
}

export async function setupSSL() {
  if (!fs.existsSync(SSL_DIR)) {
    fs.mkdirSync(SSL_DIR)
    await createSSL()
  }

  if (await isCertExpired()) {
    await createSSL()
  }

  return {
    cert: fs.readFileSync(`${SSL_DIR}/localhost.crt`),
    key: fs.readFileSync(`${SSL_DIR}/localhost.key`),
  }
}
