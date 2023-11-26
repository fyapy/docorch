// deno-lint-ignore-file no-explicit-any
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
interface HttpOptions extends Exclude<RequestInit, 'body' | 'method'> {
  proggress?: (progress: number) => void
  cookie?: string
}
type HttpBody = Record<string, any>
type NewHttpClient = {
  baseURL: string
  getHeaders: () => RequestInit['headers']
}

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const createClient = ({
  baseURL,
  getHeaders,
}: NewHttpClient) => {
  const formatBody = (body?: HttpBody, options: HttpOptions = {}) => {
    const headers = {...defaultHeaders}
    const isForm = body instanceof FormData

    if (isForm) {
      delete headers['Content-Type']
    }

    return {
      ...options,
      headers: {
        ...headers,
        ...getHeaders(),
        ...options?.headers,
      },
      body: isForm
        ? body as FormData
        : JSON.stringify(body),
    }
  }

  const request = async <R>(
    method: HttpMethod,
    url: string,
    options: HttpOptions = {},
  ) => {
    const fullUrl = /^http/i.test(url) ? url : `${baseURL}${url}`

    const response = await fetch(fullUrl, {...options, method})

    if (response.ok) {
      return await response.json() as R
    }

    throw response
  }

  const get = <R = any>(url: string, options?: HttpOptions) => {
    const optionsCopy = {...options}
    optionsCopy.headers = {
      ...defaultHeaders,
      ...getHeaders(),
      ...optionsCopy.headers,
    }
    if (options?.cookie) {
      (optionsCopy.headers as any)['cookie'] = options.cookie
    }

    return request<R>('GET', url, optionsCopy)
  }

  const post = async <R = any>(url: string, body: HttpBody = {}, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('POST', url, fullOptions)
  }

  const put = async <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('PUT', url, fullOptions)
  }

  const patch = async <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('PATCH', url, fullOptions)
  }

  const del = async <R = any>(url: string, body?: HttpBody, options?: HttpOptions) => {
    const fullOptions = formatBody(body, options)

    return await request<R>('DELETE', url, fullOptions)
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  }
}

export default createClient({
  baseURL: '',
  getHeaders: () => ({}),
})

export function createSearch(data: Record<string, string | number | null | boolean | undefined>) {
  const entries = Object.entries(data)
  if (entries.length === 0) {
    return ''
  }

  const params = entries.filter(([, value]) => typeof value !== 'undefined'
    && value !== null
    && value !== false)
    .map(([key, value]) => ([key, `${value}`]))

  const search = new URLSearchParams(Object.fromEntries(params))

  return search.toString() !== ''
    ? `?${search}`
    : ''
}
