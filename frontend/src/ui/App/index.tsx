import {Link, Route, Router, Switch} from 'wouter'
import {Hosts} from 'pages/Hosts'
import {CreateHost} from 'ui/CreateHost'
import {Containers} from 'pages/Containers'
import {CreateContainer} from 'ui/CreateContainer'
import {NotificationLayout} from 'ui/NotificationLayout'
import * as Styled from './styles'

export const App = () => (
  <Router base="/ui">
    <Styled.Wrapper>
      <Styled.Header>
        <Link to="/">Docorch</Link>

        <Link to="/">Containers</Link>
        <Link to="/hosts">Hosts</Link>
      </Styled.Header>

      <Styled.Content>
          <Switch>
            <Route path="/create-container" component={CreateContainer} />
            <Route path="/create-host" component={CreateHost} />
            <Route path="/hosts" component={Hosts} />
            <Route path="/" component={Containers} />
          </Switch>
      </Styled.Content>

      <NotificationLayout />
    </Styled.Wrapper>
  </Router>
)
