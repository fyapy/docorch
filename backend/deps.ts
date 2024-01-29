import {fetch, Agent, HeadersInit, BodyInit} from 'undici'

export {default as checkDiskSpace} from 'check-disk-space'

export const socketPath = '/var/run/docker.sock'

const dispatcher = new Agent({connect: {socketPath}})

interface FetchUnixOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: BodyInit | null
  headers?: HeadersInit
  prefix?: string
}
export const fetchUnix = (url: string, {method = 'GET', body, headers}: FetchUnixOptions = {}) => fetch('http://localhost/v1.43' + url, {
  dispatcher,
  headers,
  method,
  body,
})

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

import nodeIp from 'ip'
export const ip = nodeIp.address()

export * as fs from 'fs'
export {default as path} from 'path'

export async function callNode<T = {}>(serverId: string, url: string, {method = 'GET', body, headers, prefix = '/api'}: FetchUnixOptions = {}) {
  const res = await fetch(`http://${serverId}:4545${prefix}${url}`, {method, body, headers})
  if (res.ok) {
    return await res.json() as T
  }

  throw res
}
export const nodePost = (body: Record<string, any>): FetchUnixOptions => ({
  body: JSON.stringify(body),
  method: 'POST',
})

export {z, ZodError} from 'zod'
