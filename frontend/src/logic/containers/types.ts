
interface Network {
  to: number
  static: number
}
export interface Container {
  id: string
  name: string
  status: string
  image: string
  imageId: string
  serverIp: string
  networks: Network[]
  docker: {
    state: 'exited' | 'running'
  }
}
