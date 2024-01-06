import {Network, Volume, Env} from './types.ts'
import {fetchUnix, delay} from '../deps.ts'

const headers = {'Content-Type': 'application/json'} as const
const post = {headers, method: 'POST', body: '{}'} as const

export async function images() {
  const res = await fetchUnix('/images/json')
  return await res.json() as {
    Created: number
    RepoTags: string[]
  }[]
}

export const imageExists = (image: string) => images().then(images =>
  images.some(i => i.RepoTags.some(tag => tag.includes(image)))
)

export async function imageRepeatableExists(image: string, repeats = 60, ms = 1000): Promise<boolean> {
  const hasImage = await imageExists(image)

  if (hasImage) {
    return hasImage
  }
  if (repeats !== 0) {
    await delay(ms)
    return await imageRepeatableExists(image, repeats - 1, ms)
  }

  return false
}

export async function pullImage(name: string) {
  if (!name) throw new Error('pullImage name required!')

  await fetchUnix(`/images/create?fromImage=${encodeURIComponent(name)}`, post)
}

export async function containers() {
  try {
    const res = await fetchUnix('/containers/json?all=true')
    return await res.json() as {
      Id: string
      Names: string[]
      Image: string
      ImageID: string
      Ports: {
        PrivatePort: number
        PublicPort: number
      }[]
      State: 'exited' | 'running'
      Status: string
      Mounts: {}[]
    }[]
  } catch (e) {
    console.error(`Docker containers error `, e)
    throw e
  }
}

export async function enabled() {
  try {
    await containers()
    return true
  } catch {
    return false
  }
}

export async function startContainer(id: string) {
  if (!id) throw new Error('startContainer id required!')

  await fetchUnix(`/containers/${id}/start`, post)
}

export async function stopContainer(id: string) {
  if (!id) throw new Error('startContainer id required!')

  await fetchUnix(`/containers/${id}/stop`, post)
}

interface CreateContainerInput {
  hostname?: string
  serverIp: string
  name: string
  image: string
  networks: Network[]
  envs: Env[]
  volumes: Volume[]
  args: string[]
}

export async function createContainer({name, hostname, image, envs, networks, volumes, args}: CreateContainerInput) {
  if (!name) throw new Error('createContainer name required!')
  if (!image) throw new Error('createContainer image required!')

  const body = {
    Hostname: hostname,
    Cmd: args,
    Image: image,
    Env: envs.reduce<string[]>((acc, {k, v}) => ([...acc, `${k}=${v}`]), []),
    ExposedPorts: networks.reduce<Record<string, {}>>((acc, item) => ({
      ...acc,
      [`${item.to}/tcp`]: {},
    }), {}),
    HostConfig: {
      PortBindings: networks.reduce<Record<string, [{HostPort: string}]>>((acc, item) => ({
        ...acc,
        [`${item.to}/tcp`]: [{HostPort: `${item.static}`}],
      }), {}),
      Binds: volumes.reduce<string[]>((acc, item) => ([
        ...acc,
        `${item.host}:${item.inside}`,
      ]), []),
      RestartPolicy: {Name: 'always', MaximumRetryCount: 0},
    },
  }

  const res = await fetchUnix(`/containers/create?name=${name}`, {...post, body: JSON.stringify(body)})
  return await res.json() as {Id: string}
}

export async function removeContainer(id: string) {
  if (!id) throw new Error('startContainer id required!')

  await fetchUnix(`/containers/${id}?force=true`, {...post, method: 'DELETE'})
}

export async function removeImage(imageId: string) {
  await fetchUnix(`/images/${imageId}?force=true`, {...post, method: 'DELETE'})
}
