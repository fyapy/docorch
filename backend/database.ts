import {fs, path} from './deps.ts'

const DATA_DIR = `${Deno.cwd()}/docorch-data`
if (!fs.existsSync(DATA_DIR)) {
  Deno.mkdirSync(DATA_DIR)
}

export class NotFound extends Error {}

function readJson(filePath: string) {
  if (!fs.existsSync(filePath)) {
    Deno.writeTextFileSync(filePath, '[]')
    return []
  }

  return JSON.parse(Deno.readTextFileSync(filePath))
}

interface CreateTableProps {
  name: string
}

function createTable<T extends Record<string, any>>({name}: CreateTableProps) {
  const filePath = path.join(`${DATA_DIR}/${name}.json`)
  let data = readJson(filePath) as T[]
  let hasChanges = false

  function select() {
    return data.map(item => ({...item}))
  }

  function selectBy(key: keyof T, value: T[keyof T]): T {
    const item = data.find(item => item[key] === value)
    if (!item) {
      throw new NotFound()
    }

    return item
  }

  function insert(newRow: T) {
    data.push(newRow)
    hasChanges = true
    return newRow
  }

  function update(key: keyof T, value: T[keyof T], set: Partial<T>) {
    data = data.map(item => {
      if (item[key] === value) {
        return {...item, ...set}
      }

      return item
    })
  }

  function remove(key: keyof T, value: T[keyof T]) {
    data = data.filter(item => item[key] !== value)
  }

  function exists(key: keyof T, value: T[keyof T]) {
    return data.some(item => item[key] === value)
  }

  setInterval(() => {
    if (hasChanges) {
      hasChanges = false
      Deno.writeTextFileSync(filePath, JSON.stringify(data))
    }
  }, 5000)

  return {
    exists,
    selectBy,
    select,
    insert,
    remove,
    update,
  }
}

export interface Network {
  to: number
  static: number
}
export interface Env {
  k: string
  v: string
}
export interface Volume {
  host: string
  inside: string
}
export interface Container {
  id: string

  name: string
  image: string
  networks: Network[]
  envs: Env[]
  volumes: Volume[]
  args: string[]
  serverIp: string

  dockerId: string | null
}

export const ContainerModel = createTable<Container>({name: 'containers'})

export interface Server {
  ip: string
}
export const ServerModel = createTable<Server>({name: 'servers'})
