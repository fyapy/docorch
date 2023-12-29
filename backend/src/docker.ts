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

export const imageExists = (image: string) => images().then(images => {

  console.log(images, 'images')
  return images.some(i => i.RepoTags.some(tag => tag.includes(image)))
})

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

  console.log(`Start pulling image ${name}`)
  await fetchUnix(`/images/create?fromImage=${encodeURIComponent(name)}`, post)
  console.log(`Finish pulling image ${name}`)
}

export async function containers() {
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
  serverIp: string
  name: string
  image: string
  networks: Network[]
  envs: Env[]
  volumes: Volume[]
  args: string[]
}

export async function createContainer({name, image, envs, networks, volumes, args}: CreateContainerInput) {
  if (!name) throw new Error('createContainer name required!')
  if (!image) throw new Error('createContainer image required!')

  const body = {
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
    },
  }

  const res = await fetchUnix(`/containers/create?name=${name}`, {...post, body: JSON.stringify(body)})
  return await res.json() as {Id: string}
}

export async function removeContainer(id: string) {
  if (!id) throw new Error('startContainer id required!')

  await fetchUnix(`/containers/${id}?force=true`, {...post, method: 'DELETE'})
}