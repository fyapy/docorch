import {Link, Route, Router, Switch} from 'wouter'
import {Containers} from 'pages/Containers'
import {CreateContainer} from 'ui/CreateContainer'
import {NotificationLayout} from 'ui/NotificationLayout'
import * as Styled from './styles'

export const App = () => (
  <Router base="/ui">
    <Styled.Wrapper>
      <Styled.Header>
        <Link to="/">Docorch</Link>
      </Styled.Header>

      <Styled.Content>
          <Switch>
            <Route path="/create-container" component={CreateContainer} />
            <Route path="/" component={Containers} />
          </Switch>
      </Styled.Content>

      <NotificationLayout />
    </Styled.Wrapper>
  </Router>
)
