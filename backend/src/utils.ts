import {Env, ErrorHandler, HTTPException, Handler, Hono, checkDiskSpace, socketPath} from '../deps.ts'
import {NotFound} from './database.ts'
import {enabled} from './docker.ts'
import {flags} from './flags.ts'

export const handleError: ErrorHandler<Env> = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  if (err instanceof NotFound) {
    return c.json({message: 'Database Object not found'}, 404)
  }

  if ((err.cause as any)?.address === socketPath) {
    return c.json({message: 'Docker deamon not started'}, 500)
  }

  if (err instanceof Response) {
    return err
  }

  return c.json({message: err.message || 'Unknown error'}, 400)
}

type RouteOptions = {
  method: 'GET' | 'POST',
  url: string
  handle: Handler
}
export function masterRoute(hono: Hono, {method, url, handle}: RouteOptions) {
  if (!flags.master) {
    return
  }

  if (method === 'GET') {
    console.log(`${method}  ${url}`)
    hono.get(url, handle)
    return
  }
  if (method === 'POST') {
    console.log(`${method} ${url}`)
    hono.post(url, handle)
    return
  }

  console.error(`masterRoute error ${method} ${url}`)
}
export function slaveRoute(hono: Hono, {method, url, handle}: RouteOptions) {
  if (!flags.slave) {
    return
  }

  if (method === 'GET') {
    console.log(`${method}  ${url}`)
    hono.get(url, handle)
    return
  }
  if (method === 'POST') {
    console.log(`${method} ${url}`)
    hono.post(url, handle)
    return
  }

  console.error(`slaveRoute error ${method} ${url}`)
}

export const defineHandlers = (handlers: (hono: Hono) => void) => (hono: Hono) => handlers(hono)

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

const transports = ['tcp', 'udp']

export function requestIp(addr: Deno.Addr) {
  if (transports.includes(addr.transport)) {
    return (addr as Deno.NetAddr).hostname
  }

  return (addr as Deno.UnixAddr).path
}

export const version = '03.02.01'

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
