import {Link, Route, Switch} from 'wouter'
import {Containers} from 'pages/Containers'
import {RunContainer} from 'ui/RunContainer'
import * as Styled from './styles'

export const App = () => {

  return (
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
    </Styled.Wrapper>
  )
}
