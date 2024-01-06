import {runInAction, makeAutoObservable} from 'mobx'
import {navigate} from 'utils/router'
import {Root} from 'logic/root'
import http from 'utils/http'
import {Host} from './types'

export class HostsStore {
  allList: Host[] = []

  root: Root

  constructor(root: Root) {
    this.root = root
    makeAutoObservable(this)
  }

  fetchList = async () => {
    try {
      const res = await http.get('/api/hosts')
      runInAction(() => this.allList = res)
    } catch (e) {
      this.root.notifications.addAsyncError(e)
    }
  }
  createItem = async (values: {host: string; ip: string}) => {
    try {
      await http.post('/api/create-host', values)
      navigate('/hosts')
    } catch (e) {
      this.root.notifications.addAsyncError(e)
    }
  }
  removeItem = async (id: string) => {
    try {
      await http.post('/api/remove-host', {id})
      await this.fetchList()
    } catch (e) {
      this.root.notifications.addAsyncError(e)
    }
  }
}

export type {Host}
