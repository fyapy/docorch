import styled from 'styled-components'
import {color} from 'ui/theme'

export const Absolute = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;

  max-height: calc(100vh - 40px);
`

export const Notification = styled.div`
  padding: 10px;
  gap: 15px;

  display: flex;
  align-items: center;

  border-radius: 3px;
  background-color: ${color.white};
  border: 1px solid ${color.danger};

  .icon {
    cursor: pointer;
  }
`
