import {Express, RequestHandler} from 'express'
import {checkDiskSpace, socketPath} from '../deps'
import {NotFound} from './database'
import {enabled} from './docker'
import {flags} from './flags'

const handleError = (handle: RequestHandler): RequestHandler => async (req, res, next) => {
  try {
    await handle(req, res, next)
  } catch (err: any) {
    if (err instanceof NotFound) {
      return res.status(404).json({message: 'Database Object not found'})
    }

    if (err.cause?.address === socketPath) {
      return res.status(500).json({message: 'Docker deamon not started'})
    }

    res.status(400).json({message: err.message || 'Unknown error'})
  }
}

type RouteOptions = {
  method: 'GET' | 'POST',
  url: string
  handle: RequestHandler
}
export function masterRoute(app: Express, {method, url, handle}: RouteOptions) {
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
export function slaveRoute(app: Express, {method, url, handle}: RouteOptions) {
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

export const defineHandlers = (handlers: (app: Express) => void) => (app: Express) => handlers(app)

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

export const version = '01.08.34'

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
