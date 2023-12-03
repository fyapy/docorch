import {makeAutoObservable, runInAction} from 'mobx'
import {Root} from 'logic/root'
import {Notification} from './types'

export class NotificationsStore {
  allList: Notification[] = []

  root: Root

  constructor(root: Root) {
    this.root = root
    makeAutoObservable(this)
  }

  addAsyncError = async (e: Response | string | unknown) => {
    if (e instanceof Response) {
      const res = await e.json()

      if (res?.message) {
        runInAction(() => this.allList.push({
          id: crypto.randomUUID(),
          text: res.message,
          type: 'error',
        }))
        return
      }
    }

    if (typeof e === 'string') {
      this.allList.push({id: crypto.randomUUID(), text: e, type: 'error'})
      return
    }

    console.log('unhandled addAsyncError', e)
  }

  removeNotify = (id: string) => {
    this.allList = this.allList.filter(n => n.id !== id)
  }
}
