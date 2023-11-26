import {styled} from 'styled-components'
import { color } from 'ui/theme'

export const Wrapper = styled.form`
  max-width: 650px;
`

export const Btn = styled.button`
  padding: 6px 8px;

  font-weight: 600;
  border-radius: 3px;
  border: 1px solid #1E8F63;
  background-color: #26BA81;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: ${color.primary};
    border-color: ${color.primary};
  }
  &:disabled {
    background-color: #8393AA;
    border-color: #8393AA;
    cursor: default;
  }
`
