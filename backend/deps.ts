import {fetch, Agent, HeadersInit} from 'npm:undici@5.22.0'

import _checkDiskSpace  from 'npm:check-disk-space'
export const checkDiskSpace = _checkDiskSpace as any as typeof _checkDiskSpace.default

export const socketPath = '/var/run/docker.sock'

const dispatcher = new Agent({connect: {socketPath}})

interface FetchUnixOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: BodyInit | null | undefined
  headers?: HeadersInit | undefined
  prefix?: string
}
export const fetchUnix = (url: string, {method = 'GET', body, headers}: FetchUnixOptions = {}) => fetch('http://localhost/v1.43' + url, {
  dispatcher,
  headers,
  method,
  body,
})

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export {Hono} from 'https://deno.land/x/hono@v3.9.2/mod.ts'
export {basicAuth} from 'https://deno.land/x/hono@v3.9.2/middleware.ts'
export {HTTPException} from 'https://deno.land/x/hono@v3.9.2/http-exception.ts'
export type {Env, ErrorHandler, Handler} from 'https://deno.land/x/hono@v3.9.2/mod.ts'

import {getIP} from 'https://deno.land/x/get_ip@v2.0.0/mod.ts'
export const ip = await getIP({ipv6: true})

export * as fs from 'https://deno.land/std@0.205.0/fs/mod.ts'
export * as path from 'https://deno.land/std@0.205.0/path/mod.ts'

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

export {z, ZodError} from "https://deno.land/x/zod@v3.22.4/mod.ts"
