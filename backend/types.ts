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

export interface CreateContainerInput {
  serverIp: string
  name: string
  image: string
  networks: Network[]
  envs: Env[]
  volumes: Volume[]
  args: string[]
}
