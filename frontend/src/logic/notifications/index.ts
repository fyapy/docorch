import {makeAutoObservable, runInAction} from 'mobx'
import {nanoid} from 'nanoid'
import {Root} from 'logic/root'
import {Notification} from './types'

export class NotificationsStore {
  allList: Notification[] = []

  root: Root

  constructor(root: Root) {
    this.root = root
    makeAutoObservable(this)
  }

  push = (text: string) => {
    this.allList.push({id: nanoid(), text, type: 'error'})
  }

  addAsyncError = async (e: Response | string | unknown) => {
    if (e instanceof Response) {
      try {
        const res = await e.json()

        if (res?.message) {
          this.push(res.message)
          return
        }
      } catch {
        this.push(e.statusText)
        return
      }
    }

    if (typeof e === 'string') {
      this.allList.push({id: nanoid(), text: e, type: 'error'})
      return
    }

    console.log('unhandled addAsyncError', e)
  }

  removeNotify = (id: string) => {
    this.allList = this.allList.filter(n => n.id !== id)
  }
}
