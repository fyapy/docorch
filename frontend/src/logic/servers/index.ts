import {runInAction, makeAutoObservable} from 'mobx'
import {Root} from 'logic/root'
import http from 'utils/http'
import {Server} from './types'

export class ServersStore {
  allList: Server[] = []

  root: Root

  constructor(root: Root) {
    this.root = root
    makeAutoObservable(this)
  }

  get options() {
    return this.allList.map(({ip, current}) => ({
      name: current ? `${ip} (master)` : ip,
      value: ip,
    }))
  }

  fetchList = async () => {
    try {
      const res = await http.get('/api/servers')
      runInAction(() => this.allList = res)
    } catch (e) {
      console.log(e)
    }
  }
}

export type {Server}
