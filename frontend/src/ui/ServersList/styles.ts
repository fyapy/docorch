import {styled} from 'styled-components'
import {color} from 'ui/theme'

export const Wrapper = styled.div`
  margin-bottom: 20px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`

export const Item = styled.div`
  height: 80px;
  padding: 0 20px 0 10px;

  display: flex;
  align-items: center;

  border: 1px solid #BCC4D2;
  border-radius: 3px;
`

export const Online = styled.span`
  width: 15px;
  height: 15px;
  margin-right: 10px;

  border-radius: 3px;
  background-color: ${color.danger};

  &.active {
    background-color: #029863;
  }
`
