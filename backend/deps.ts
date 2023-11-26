import {fetch, Agent, HeadersInit} from 'npm:undici@5.22.0'

const dispatcher = new Agent({
  connect: {socketPath: '/var/run/docker.sock'}
})

interface FetchUnixOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: BodyInit | null | undefined
  headers?: HeadersInit | undefined
}
export const fetchUnix = (url: string, {method = 'GET', body, headers}: FetchUnixOptions = {}) => fetch('http://localhost/v1.43' + url, {
  dispatcher,
  headers,
  method,
  body,
})

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export {Hono} from 'https://deno.land/x/hono@v3.9.2/mod.ts'

import {getIP} from 'https://deno.land/x/get_ip@v2.0.0/mod.ts'
export const ip = await getIP({ipv6: true})

export * as fs from 'https://deno.land/std@0.205.0/fs/mod.ts'
export * as path from 'https://deno.land/std@0.205.0/path/mod.ts'

export async function callNode<T>(serverId: string, url: string, {method = 'GET', body, headers}: FetchUnixOptions = {}) {
  const res = await fetch(`http://${serverId}/api${url}`, {method, body, headers})
  if (!res.ok) {
    return await res.json() as T
  }

  throw res
}
export const nodePost = (body: Record<string, any>): FetchUnixOptions => ({
  body: JSON.stringify(body),
  method: 'POST',
})
