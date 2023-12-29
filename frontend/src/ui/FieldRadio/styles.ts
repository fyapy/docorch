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
`

export const Items = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
`

export const Item = styled.div`
  height: 40px;
  padding: 0 20px 0 10px;
  margin-bottom: 5px;

  flex: 0.33;
  display: flex;
  align-items: center;

  border: 1px solid #BCC4D2;
  border-radius: 3px;
  cursor: pointer;
`

export const Dot = styled.span`
  width: 15px;
  height: 15px;
  margin-right: 10px;

  border-radius: 3px;
  background-color: #BCC4D2;

  &.active {
    background-color: ${color.primary};
  }
`

export const Error = styled.div`
  color: ${color.danger};
  font-size: 14px;
`
