import {toJS} from 'mobx'
import {ServersStore} from './servers'
import {ContainersStore} from './containers'

export class Root {
  containers: ContainersStore
  servers: ServersStore

  constructor(initialState?: Record<string, any>) {
    this.containers = new ContainersStore(this)
    this.servers = new ServersStore(this)

    if (initialState) {
      for (const key in initialState) {
        const storeKey = key as any
        const initialStore = initialState[storeKey] as any

        for (const valueKey in initialStore) {
          const value = initialStore[valueKey]

          // @ts-ignore
          this[storeKey][valueKey] = value
        }
      }
    }
  }
}

declare global {
  var state: any;
}

export const store = new Root(window.state)

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    const jsStore = toJS(store)
    // @ts-ignore
    Object.keys(jsStore).forEach(storeKey => delete jsStore[storeKey]?.root)

    window.state = JSON.parse(JSON.stringify(jsStore))
  })
}
