import {useLayoutEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {HostsTable} from 'ui/HostsTable'
import {useStore} from 'utils/hooks'

export const Hosts = observer(() => {
  const {hosts} = useStore()

  useLayoutEffect(() => {
    hosts.fetchList()
  }, [])

  return (
    <HostsTable
      list={hosts.allList}
      remove={hosts.removeItem}
    />
  )
})
