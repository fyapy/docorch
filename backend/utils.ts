import {Env, ErrorHandler, Handler, Hono, checkDiskSpace, socketPath} from './deps.ts'
import {NotFound} from './database.ts'
import {flags} from './flags.ts'

export const handleError: ErrorHandler<Env> = (err, c) => {
  if (err instanceof NotFound) {
    return c.json({message: 'Database Object not found'}, 404)
  }

  if ((err.cause as any)?.address === socketPath) {
    return c.json({message: 'Docker deamon not started'}, 500)
  }

  return c.json({message: err.message}, 400)
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
    hono.get(url, handle)
    return
  }
  if (method === 'POST') {
    hono.post(url, handle)
    return
  }
}
export function slaveRoute(hono: Hono, {method, url, handle}: RouteOptions) {
  if (!flags.slave) {
    return
  }

  if (method === 'GET') {
    hono.get(url, handle)
    return
  }
  if (method === 'POST') {
    hono.post(url, handle)
    return
  }
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
