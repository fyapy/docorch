import {toJS} from 'mobx'
import {HostsStore} from './hosts'
import {ServersStore} from './servers'
import {ContainersStore} from './containers'
import {NotificationsStore} from './notifications'

export class Root {
  notifications: NotificationsStore
  containers: ContainersStore
  servers: ServersStore
  hosts: HostsStore

  constructor(initialState?: Record<string, any>) {
    this.notifications = new NotificationsStore(this)
    this.containers = new ContainersStore(this)
    this.servers = new ServersStore(this)
    this.hosts = new HostsStore(this)

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
