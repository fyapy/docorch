import ReactDOM from 'react-dom/client'
import {StoreProvider} from 'providers'
import {store} from 'logic/root'
import {App} from 'ui/App'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
)
