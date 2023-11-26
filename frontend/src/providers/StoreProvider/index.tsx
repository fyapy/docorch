import {ReactNode, createContext} from 'react'
import {observer} from 'mobx-react-lite'
import {Root} from 'logic/root'

export const StoreContext = createContext<Root>({} as Root)

type StoreProviderProps = {
  store: Root
  children?: ReactNode
}

export const StoreProvider = observer(({
  store,
  children,
}: StoreProviderProps) => (
  <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
))
