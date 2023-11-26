import styled from 'styled-components'
import {color} from 'ui/theme'

export const Required = styled.span`
  color: ${color.danger};
`

export const Wrapper = styled.div`
  margin-bottom: 15px;

  display: flex;
  flex-flow: column;

  label {
    margin-bottom: 5px;

    color: #8393AA;
  }
  input {
    height: 40px;
    padding: 0 20px;
    margin-bottom: 5px;

    border: 1px solid #BCC4D2;
    border-radius: 3px;

    &:focus {
      outline: none;
    }
  }
`

export const Error = styled.div`
  color: ${color.danger};
  font-size: 14px;
`
