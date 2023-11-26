
interface Network {
  to: number
  static: number
}
export interface Container {
  id: string
  name: string
  state: 'exited' | 'running'
  status: string
  image: string
  imageId: string
  ports: Network[]
}
