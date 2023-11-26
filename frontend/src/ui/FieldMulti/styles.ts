import {styled} from 'styled-components'
import {color} from 'ui/theme'

export const Wrapper = styled.div`
  margin-bottom: 15px;

  display: flex;
  flex-flow: column;

  label {
    margin-bottom: 5px;

    color: #8393AA;
  }
  input {
    width: 100%;
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

export const InputGroup = styled.div`
  position: relative;

  display: flex;
  gap: 10px;
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
`

export const Remove = styled.button`
  position: absolute;
  right: -50px;
  top: 0;

  width: 40px;
  height: 40px;

  border-radius: 3px;
  border: 1px solid ${color.danger};
  background-color: ${color.danger};
  color: ${color.white};
  cursor: pointer;

  &:hover {
    background-color: #d32c52;
  }
`
