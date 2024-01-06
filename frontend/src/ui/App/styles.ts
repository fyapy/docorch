import {styled} from 'styled-components'
import {color} from 'ui/theme'

export const Wrapper = styled.div`
  min-height: 100vh;

  display: flex;
  flex-flow: column;
`

export const Header = styled.div`
  height: 60px;
  padding: 0 60px;

  display: flex;
  align-items: center;

  font-weight: 600;
  font-size: 22px;
  background-color: ${color.primary};

  a {
    color: ${color.white};
  }
  a:not(:first-child) {
    margin-left: 30px;

    font-size: 16px;
  }
`
export const Content = styled.div`
  padding: 20px 60px;

  flex: 1;
`
