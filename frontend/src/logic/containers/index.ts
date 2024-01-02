import {makeAutoObservable, runInAction} from 'mobx'
import {CreateContainerValues} from 'ui/CreateContainer'
import {navigate} from 'utils/router'
import {Root} from 'logic/root'
import http from 'utils/http'
import {Container} from './types'

export class ContainersStore {
  allList: Container[] = []
  pendingList: string[] = []

  root: Root

  constructor(root: Root) {
    this.root = root
    makeAutoObservable(this)
  }

  fetchList = async () => {
    try {
      const res = await http.get('/api/containers')
      runInAction(() => this.allList = res)
    } catch (e) {
      this.root.notifications.addAsyncError(e)
    }
  }
  createContainer = async (values: CreateContainerValues) => {
    try {
      await http.post('/api/create-container', values)
      navigate('/')
    } catch (e) {
      this.root.notifications.addAsyncError(e)
    }
  }
  containerAction = async (id: string, action: 'start' | 'stop' | 'remove' | 'recreate') => {
    this.pendingList.push(id)
    try {
      await http.post(`/api/${action}-container`, action === 'recreate' ? {name: id} : {id})
      await this.fetchList()
    } catch (e) {
      this.root.notifications.addAsyncError(e)
    }
    runInAction(() => {
      this.pendingList = this.pendingList.filter(i => i !== id)
    })
  }
}

export type {Container}
