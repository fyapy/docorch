import {Link, Route, Router, Switch} from 'wouter'
import {Containers} from 'pages/Containers'
import {RunContainer} from 'ui/RunContainer'
import {NotificationLayout} from 'ui/NotificationLayout'
import * as Styled from './styles'

export const App = () => {

  return (
    <Router base="/ui">
      <Styled.Wrapper>
        <Styled.Header>
          <Link to="/">Docorch</Link>
        </Styled.Header>

        <Styled.Content>
            <Switch>
              <Route path="/run-container" component={RunContainer} />
              <Route path="/" component={Containers} />
            </Switch>
        </Styled.Content>

        <NotificationLayout />
      </Styled.Wrapper>
    </Router>
  )
}
