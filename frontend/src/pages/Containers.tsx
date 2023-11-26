import {useLayoutEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {ContainersTable} from 'ui/ContainersTable'
import {useStore} from 'utils/hooks'

export const Containers = observer(() => {
  const {containers} = useStore()

  useLayoutEffect(() => {
    containers.fetchList()
  }, [])

  return (
    <ContainersTable
      action={containers.containerAction}
      pendings={containers.pendingList}
      list={containers.allList}
    />
  )
})
