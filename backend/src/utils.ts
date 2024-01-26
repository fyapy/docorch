import Elysia, {ErrorHandler, Handler} from 'elysia'
import {checkDiskSpace, socketPath} from '../deps'
import {NotFound} from './database'
import {enabled} from './docker'
import {flags} from './flags'
// import { $ } from 'bun'

export const handleError: ErrorHandler = ({code, error}) => {
  console.log('handleError', error)

  return {err: true}

  // if (err instanceof NotFound) {
  //   return c.json({message: 'Database Object not found'}, 404)
  // }

  // if ((err.cause as any)?.address === socketPath) {
  //   return c.json({message: 'Docker deamon not started'}, 500)
  // }

  // if (err instanceof Response) {
  //   return err
  // }

  // return c.json({message: err.message || 'Unknown error'}, 400)
}

type RouteOptions = {
  method: 'GET' | 'POST',
  url: string
  handle: Handler
}
export function masterRoute(app: Elysia, {method, url, handle}: RouteOptions) {
  if (!flags.master) {
    return
  }

  const apiUrl = `/api${url}`

  if (method === 'GET') {
    console.log(`${method}  ${apiUrl}`)
    app.get(apiUrl, handle)
    return
  }
  if (method === 'POST') {
    console.log(`${method} ${apiUrl}`)
    app.post(apiUrl, handle)
    return
  }

  console.error(`masterRoute error ${method} ${apiUrl}`)
}
export function slaveRoute(app: Elysia, {method, url, handle}: RouteOptions) {
  if (!flags.slave) {
    return
  }

  const apiUrl = `/api${url}`

  if (method === 'GET') {
    console.log(`${method}  ${apiUrl}`)
    app.get(apiUrl, handle)
    return
  }
  if (method === 'POST') {
    console.log(`${method} ${apiUrl}`)
    app.post(apiUrl, handle)
    return
  }

  console.error(`slaveRoute error ${method} ${apiUrl}`)
}

export const defineHandlers = (handlers: (app: Elysia) => void) => (app: Elysia) => handlers(app)

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

export const version = '06.09.36'

export async function stats(ip: string) {
  // const space = await getDiskInfo()
  const space = {total: '0', free: '0'}
  // const docker = await enabled()
  const docker = false
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
