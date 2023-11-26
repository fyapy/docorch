import {useContext} from 'react'
import {StoreContext} from 'providers'

export const useStore = () => useContext(StoreContext)!
